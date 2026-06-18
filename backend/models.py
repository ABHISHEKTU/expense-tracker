from sqlalchemy import Column, Integer, String, Float, Date, Text
from database import Base
from datetime import date

CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"]

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(Date, nullable=False, default=date.today)
    note = Column(Text, nullable=True)
