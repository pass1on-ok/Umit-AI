# UMIT AI — Инструкция по запуску

## Требования
- Node.js 18+
- PostgreSQL 13+
- npm

---

## 1. База данных

Создайте БД и пользователя (или используйте Docker):

```bash
# Через Docker (рекомендуется):
cd backend
docker-compose up -d postgres
```

Или вручную в PostgreSQL:
```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE median OWNER myuser;
```

---

## 2. Backend (NestJS)

```bash
cd backend

# Установить зависимости
npm install

# Создать .env (уже создан, проверьте значения)
# DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL

# Применить все миграции (включая новые поля симптомов и профиля)
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Запустить в режиме разработки
npm run start:dev
```

Бэкенд будет доступен на: http://localhost:3000  
Swagger-документация: http://localhost:3000/api

---

## 3. Frontend (React + Vite)

```bash
cd react

# Установить зависимости
npm install

# Запустить
npm run dev
```

Фронтенд будет доступен на: http://localhost:5173

---

## API эндпоинты

| Метод  | Путь                   | Описание                         | Доступ         |
|--------|------------------------|----------------------------------|----------------|
| POST   | /auth/login            | Вход по email/password           | Публичный      |
| POST   | /users/register        | Регистрация пациента             | Публичный      |
| GET    | /users/:id             | Получить пользователя            | Auth           |
| PATCH  | /users/:id             | Обновить имя/email               | Auth (свой)    |
| PATCH  | /users/:id/profile     | Обновить профиль/диагноз         | Auth (свой)    |
| GET    | /users                 | Все пользователи                 | Admin/Doctor   |
| DELETE | /users/:id             | Удалить пользователя             | Admin          |
| POST   | /hads                  | Отправить тест HADS              | Auth           |
| GET    | /hads/my               | Мои результаты HADS              | Auth           |
| GET    | /hads                  | Все результаты HADS              | Admin/Doctor   |
| GET    | /hads/:id              | Один результат                   | Auth           |
| POST   | /symptoms              | Записать симптомы дня            | Auth           |
| GET    | /symptoms              | Мои симптомы (или все для врача) | Auth           |
| PATCH  | /symptoms/:id          | Обновить запись симптомов        | Auth           |
| DELETE | /symptoms/:id          | Удалить запись                   | Auth           |

---

## Роли пользователей

| Роль         | Доступ                                              |
|--------------|-----------------------------------------------------|
| PATIENT      | Dashboard, профиль, тесты, дневник, чат             |
| DOCTOR       | Панель врача, все симптомы, все HADS, аналитика     |
| PSYCHOLOGIST | То же что DOCTOR                                    |
| ADMIN        | Полный доступ + AdminPanel + управление пользователями |

После регистрации через /auth все пользователи получают роль PATIENT.  
Смена роли — через Swagger (/api) или напрямую в БД.

---

## Изменения в проекте (интеграция frontend ↔ backend)

### Backend:
- `src/auth/jwt-auth.guard.ts` — создан (был пустым)
- `src/auth/auth.module.ts` — JWT expiry 5m → 7d, секрет из env
- `src/main.ts` — добавлен `app.enableCors()`
- `src/hads/hads.service.ts` — исправлена логика подсчёта HADS
- `src/hads/hads.controller.ts` — добавлен `GET /hads/my`
- `src/hads/dto/create-hads.dto.ts` — исправлен баг `@Max(0)` → `@Max(3)`
- `src/symptoms/dto/create-symptom.dto.ts` — новые поля (pain/fatigue/appetite/nausea/sleep)
- `src/symptoms/entities/symptom.entity.ts` — обновлён
- `src/users/dto/create-profile.dto.ts` — добавлены phone/diagnosis/stage/treatmentPhase
- `src/users/entities/profile.entity.ts` — обновлён
- `src/users/users.service.ts` — `updateProfile` использует upsert
- `prisma/schema.prisma` — актуальная схема
- `prisma/migrations/20260401000000_symptom_fields/` — миграция новых полей
- `.env` — создан

### Frontend:
- `src/lib/api.ts` — fetch-based API клиент (JWT, все методы)
- `src/lib/authContext.tsx` — глобальный контекст авторизации
- `src/main.tsx` — обёрнут в AuthProvider
- `src/components/ProtectedRoute.tsx` — защита маршрутов по ролям
- `src/App.tsx` — все маршруты защищены
- `src/pages/Auth.tsx` — реальный login/register + редирект по роли
- `src/pages/PatientDashboard.tsx` — имя из токена, кнопка выхода
- `src/pages/PatientProfile.tsx` — загрузка и сохранение через API
- `src/pages/SymptomDiary.tsx` — реальное сохранение, график из БД
- `src/pages/TestInterface.tsx` — 14 вопросов HADS, отправка на API
- `src/pages/TestResults.tsx` — история HADS из БД
- `vite.config.ts` — прокси /api → localhost:3000
- `.env` — VITE_API_URL
