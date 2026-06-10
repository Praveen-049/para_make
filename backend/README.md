# Parachute Design Platform Backend

## Setup

1. Install Python 3.11+.
2. Create a virtual environment and activate it.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and update PostgreSQL credentials.

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/{project_id}/design`
- `POST /api/projects/preview`
- `GET /api/projects/stats`
- `GET /api/projects/{project_id}/report`
