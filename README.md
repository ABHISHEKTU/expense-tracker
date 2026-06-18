# Expense Tracker

Personal expense tracker web app built for the Riafy Software Engineer Practical Test.

## How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend (FastAPI + SQLite)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at http://localhost:8000  
API docs at http://localhost:8000/docs

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

Open http://localhost:5173 in your browser.

---

## Stack & Tradeoffs

| Layer | Choice | Why |
|-------|--------|-----|
| Backend | FastAPI (Python) | Fast to build, auto docs, great pydantic validation |
| Database | SQLite via SQLAlchemy | Zero setup, single file, sufficient for local use |
| Frontend | React + Vite | Fast HMR, component model fits CRUD UI well |
| Styling | Inline styles | No CSS file juggling, scoped by component |

**SQLite over Postgres:** No deployment required per spec; SQLite is zero-config and the file (`expenses.db`) is auto-created on first run.

**No auth:** Spec explicitly says not required.

**Inline styles over Tailwind/CSS modules:** Reduces setup time, keeps components self-contained.

---

## Features Done

- [x] Add expense (title, amount, category, date defaults to today, optional note)
- [x] List all expenses sorted by date descending
- [x] Edit any expense (inline form swap)
- [x] Delete any expense (with confirmation)
- [x] Monthly summary: total + category breakdown with bar chart
- [x] Filter by category, date range (from/to), title (partial match)
- [x] Input validation (empty title, non-positive amount, invalid category)
- [x] Empty state handling
- [x] Error state if backend is down

## Features Skipped

- Pagination (not needed for local/personal use)
- Dark mode
- Tests
- Deployment

## Known Rough Edges

- No mobile responsive layout (grid stays 2-col on narrow screens)
- Summary refreshes only when add/edit/delete happens, not on filter change
- SQLite concurrent write limit (not relevant for single-user local use)
