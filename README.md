# cosmetics_full_app

Monorepo for the cosmetics e-commerce platform.

## Structure

| Directory | Description |
|-----------|-------------|
| `backend/` | Node.js API (Express + Sequelize) |
| `mobile/` | Flutter customer app (Abana) |
| `web/` | React customer storefront (Abana) |
| `adminpanel/` | Vite + React admin panel |

## Setup

1. **Backend** — Copy `backend/.env.example` to `backend/.env`, set DB and JWT values, then:
   - `npm install`
   - Run migrations and seeders as needed

2. **Admin panel** — Copy `adminpanel/.env.example` to `adminpanel/.env`, then:
   - `npm install`
   - `npm run dev` (http://localhost:5173)

3. **Web storefront** — Copy `web/.env.example` to `web/.env`, then:
   - `npm install`
   - `npm run dev` (http://localhost:5174)
   - Set `VITE_API_URL` to your API (default production API in code if unset)

4. **Mobile** — From `mobile/`:
   - `flutter pub get`
   - Run with optional `--dart-define=API_BASE_URL=...` for your API URL
