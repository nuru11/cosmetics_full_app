# Cosmetics Shop (Flutter + GetX)

Mobile app that lists products from the cosmetics backend API.

## API base URL

Set your deployed API URL (must include the `/api` suffix):

```bash
flutter run --dart-define=API_BASE_URL=https://your-host.com/api
```

Default placeholder (edit in `lib/core/config/api_config.dart` or use `--dart-define`):

`https://YOUR_DEPLOYED_HOST/api`

For local backend during development:

```bash
# Windows / desktop / iOS simulator
flutter run --dart-define=API_BASE_URL=http://localhost:3000/api

# Android emulator (host machine)
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

## Run

```bash
cd mobile
flutter pub get
flutter run --dart-define=API_BASE_URL=<your-api-url>
```

## Structure

- `lib/core/` — API config, HTTP client, image URL helper
- `lib/data/` — models, API service, repository
- `lib/modules/products/` — product list (GetX)
- `lib/modules/product_detail/` — product detail screen
