# Expense Tracker

A full-stack Expense Tracker web application built using FastAPI, React, and SQLite.

This application allows users to manage personal expenses, filter records, view monthly summaries, and analyze spending categories through a simple and intuitive interface.

---

## Features

### Expense Management
- Add new expenses
- Edit existing expenses
- Delete expenses with confirmation
- View all expenses sorted by date

### Filtering & Search
- Filter by category
- Filter by date range
- Search expenses by title

### Analytics
- Monthly expense summary
- Category-wise expense breakdown
- Visual bar chart representation

### Validation & Error Handling
- Required field validation
- Positive amount validation
- Invalid category prevention
- Backend connection error handling
- Empty state handling

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

---

## Project Structure

```text
expense-tracker/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend Server:

```text
http://localhost:8000
```

Swagger API Docs:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | /expenses | Get all expenses |
| POST | /expenses | Create expense |
| PUT | /expenses/{id} | Update expense |
| DELETE | /expenses/{id} | Delete expense |
| GET | /summary | Monthly summary |

---

## Screenshots

Add screenshots here:

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Summary View

![Summary](screenshots/summary.png)

---

## Design Decisions

### Why FastAPI?
- Fast development
- Automatic API documentation
- Strong validation through Pydantic

### Why SQLite?
- Zero configuration
- Lightweight
- Suitable for personal expense tracking

### Why React + Vite?
- Fast development experience
- Component-based architecture
- Instant Hot Module Reloading

---

## Future Improvements

- User authentication
- Dark mode
- Responsive mobile layout
- Export expenses to CSV/PDF
- Pagination
- Unit and integration tests
- Cloud deployment

---

## Author

Abhishek T U

GitHub:
https://github.com/ABHISHEKTU

---

## License

This project is for educational and assessment purposes.