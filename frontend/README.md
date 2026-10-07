# CampusMind AI frontend

Responsive React frontend for the CampusMind AI FastAPI backend. The existing Create React App setup is retained.

## Run locally

1. Start the backend in one terminal:

   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   ```

2. Start the frontend in another terminal:

   ```powershell
   cd frontend
   npm install
   Copy-Item .env.example .env
   npm start
   ```

   The frontend runs at `http://localhost:3000`; the backend API docs are at `http://127.0.0.1:8001/docs`.

Set `REACT_APP_API_URL` in `frontend/.env` to point the frontend at another backend URL. Restart `npm start` after changing environment variables.

## Screens

- Sign in and session restoration
- Student/teacher issue dashboard and report form with image attachment
- College admin issue search, category filtering, pagination, and status updates
- AI campus assistant and study planner
- College admin category/user management
- Super admin college and college-admin setup

Accounts are provisioned through the backend/admin experience; the backend does not expose public registration.
