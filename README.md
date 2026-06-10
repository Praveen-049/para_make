# Parachute Design Platform

A full-stack aerospace engineering platform for parachute and parafoil design.

## Structure

- `frontend/` - React + Vite frontend
- `backend/` - FastAPI backend

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## Run the backend

### Option 1: Docker (recommended)

```bash
docker-compose up --build
```

Then open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/docs`

### Option 2: Local Python

1. Install Python 3.11+.
2. Create a virtual environment and activate it.
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Copy `backend/.env.example` to `backend/.env` and update as needed.
5. Start the backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Notes

- Frontend defaults to `http://localhost:8000/api` for the backend.
- The project includes JWT auth, mission wizard, design calculations, and report export.
