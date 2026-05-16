# cosmetics_full_app

Monorepo for the cosmetics e-commerce platform.

## Structure

| Directory | Description |
|-----------|-------------|
| `backend/` | Node.js API (Express + Sequelize) |
| `mobile/` | Flutter customer app |
| `cosmetics_adminpanel/snack_adminpanel/` | Vite + React admin panel |

## Setup

1. **Backend** — Copy `backend/.env.example` to `backend/.env`, set DB and JWT values, then:
   - `npm install`
   - Run migrations and seeders as needed

2. **Admin panel** — Copy `cosmetics_adminpanel/snack_adminpanel/.env.example` to `.env`, then:
   - `npm install`
   - `npm run dev`

3. **Mobile** — From `mobile/`:
   - `flutter pub get`
   - Run with optional `--dart-define=API_BASE_URL=...` for your API URL
