from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import extract
from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import date as date_type
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173","http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

VALID_CATEGORIES = ["Food","Transport","Shopping","Bills","Entertainment","Other"]

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: Optional[date_type] = None
    note: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v):
        if not v.strip(): raise ValueError("Title cannot be empty")
        return v.strip()

    @field_validator("amount")
    @classmethod
    def amount_positive(cls, v):
        if v <= 0: raise ValueError("Amount must be positive")
        return round(v, 2)

    @field_validator("category")
    @classmethod
    def category_valid(cls, v):
        if v not in VALID_CATEGORIES: raise ValueError(f"Category must be one of {VALID_CATEGORIES}")
        return v

    @model_validator(mode="after")
    def set_default_date(self):
        if self.date is None:
            self.date = date_type.today()
        return self

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date_type] = None
    note: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_positive(cls, v):
        if v is not None and v <= 0: raise ValueError("Amount must be positive")
        return round(v, 2) if v is not None else v

    @field_validator("category")
    @classmethod
    def category_valid(cls, v):
        if v is not None and v not in VALID_CATEGORIES: raise ValueError(f"Category must be one of {VALID_CATEGORIES}")
        return v

class ExpenseOut(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: date_type
    note: Optional[str]
    model_config = {"from_attributes": True}

@app.get("/expenses", response_model=list[ExpenseOut])
def list_expenses(category: Optional[str]=Query(None), date_from: Optional[date_type]=Query(None), date_to: Optional[date_type]=Query(None), title: Optional[str]=Query(None), db: Session=Depends(get_db)):
    q = db.query(models.Expense)
    if category and category != "All": q = q.filter(models.Expense.category == category)
    if date_from: q = q.filter(models.Expense.date >= date_from)
    if date_to: q = q.filter(models.Expense.date <= date_to)
    if title: q = q.filter(models.Expense.title.ilike(f"%{title}%"))
    return q.order_by(models.Expense.date.desc(), models.Expense.id.desc()).all()

@app.post("/expenses", response_model=ExpenseOut, status_code=201)
def create_expense(expense: ExpenseCreate, db: Session=Depends(get_db)):
    db_exp = models.Expense(**expense.model_dump())
    db.add(db_exp); db.commit(); db.refresh(db_exp)
    return db_exp

@app.get("/expenses/{expense_id}", response_model=ExpenseOut)
def get_expense(expense_id: int, db: Session=Depends(get_db)):
    e = db.query(models.Expense).filter(models.Expense.id==expense_id).first()
    if not e: raise HTTPException(404, "Expense not found")
    return e

@app.put("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: int, updates: ExpenseUpdate, db: Session=Depends(get_db)):
    e = db.query(models.Expense).filter(models.Expense.id==expense_id).first()
    if not e: raise HTTPException(404, "Expense not found")
    for k,v in updates.model_dump(exclude_unset=True).items(): setattr(e,k,v)
    db.commit(); db.refresh(e)
    return e

@app.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session=Depends(get_db)):
    e = db.query(models.Expense).filter(models.Expense.id==expense_id).first()
    if not e: raise HTTPException(404, "Expense not found")
    db.delete(e); db.commit()

@app.get("/summary/monthly")
def monthly_summary(year: int=Query(None), month: int=Query(None), db: Session=Depends(get_db)):
    today = date_type.today()
    year = year or today.year; month = month or today.month
    expenses = db.query(models.Expense).filter(extract("year",models.Expense.date)==year, extract("month",models.Expense.date)==month).all()
    total = sum(e.amount for e in expenses)
    breakdown = {}
    for e in expenses: breakdown[e.category] = round(breakdown.get(e.category,0)+e.amount,2)
    return {"year":year,"month":month,"total":round(total,2),"breakdown":breakdown,"count":len(expenses)}

@app.get("/categories")
def get_categories(): return VALID_CATEGORIES
