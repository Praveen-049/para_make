# Parachute Design Platform Frontend

A React + Vite frontend for the Parachute Design Platform.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update the API URL if needed.
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment variables

- `VITE_API_URL` - backend API base URL (default: `http://localhost:8000/api`)

## Notes

This app includes:
- JWT authentication
- Multi-step project wizard
- Project dashboard with search
- Backend API integration via Axios
- Three.js preview visualization
- Tailwind CSS dark aerospace theme
