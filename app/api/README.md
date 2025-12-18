# app/api (HW-09 ready)

Це правильні маршрути для ДЗ 09 (NoteHub з авторизацією через cookies).
Маршрути проксють запити на https://notehub-api.goit.study і:
- переносять вгору cookie з клієнта
- повертають до клієнта Set-Cookie з upstream (accessToken, refreshToken)

## Структура
- `auth/register` (POST)
- `auth/login` (POST)
- `auth/logout` (POST)
- `auth/session` (GET)
- `users/me` (GET, PATCH)
- `notes` (GET, POST)  — підтримує search, page, perPage, tag
- `notes/[id]` (GET, DELETE)

Жодних API-токенів у заголовках не потрібно. Авторизація тільки через cookies.
