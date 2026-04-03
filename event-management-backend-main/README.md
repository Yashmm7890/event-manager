# Event Management System Backend

Laravel 11 API backend for the Event Management System. This service handles authentication, user profile lookup, and CRUD operations for events owned by the authenticated user.

## Overview

The backend provides:

- token-based authentication using Laravel Sanctum
- protected event management routes
- ownership checks so users can only manage their own events
- request validation for authentication and event payloads
- paginated event listings

## Tech Stack

- PHP 8.2+
- Laravel 11
- Laravel Sanctum
- MySQL or another Laravel-supported database

## Project Location

In this workspace, the backend lives at:

```text
event-management-backend-main/
```

If you are starting from the repo root, move into the backend with:

```bash
cd event-management-backend-main
```

## Prerequisites

Make sure these are installed locally:

- PHP 8.2 or newer
- Composer
- MySQL or another supported database
- Node.js and npm

## Local Setup

1. Install PHP dependencies.

```bash
cd event-management-backend-main
composer install
```

2. Install frontend build dependencies used by the Laravel app.

```bash
npm install
```

3. Create your environment file.

```bash
cp .env.example .env
```

4. Update `.env` with your local database settings.

Example:

```env
APP_NAME="Event Management System"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_management
DB_USERNAME=root
DB_PASSWORD=
```

5. Generate the application key.

```bash
php artisan key:generate
```

6. Run database migrations.

```bash
php artisan migrate
```

7. Start the backend server.

```bash
php artisan serve --host=localhost --port=8000
```

The API will be available at:

```text
http://localhost:8000
```

## Development Commands

Run the Laravel API server:

```bash
php artisan serve --host=localhost --port=8000
```

Run the backend asset dev server:

```bash
npm run dev
```

Run the combined Laravel development workflow defined in `composer.json`:

```bash
composer run dev
```

Run tests:

```bash
php artisan test
```

## Authentication

Authentication uses Laravel Sanctum personal access tokens.

After registering or logging in, the API returns a token. Send it in the `Authorization` header for protected routes:

```http
Authorization: Bearer <token>
```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Register a new user and return a token |
| `POST` | `/api/login` | Log in and return a token |

### Protected Routes

These routes require `auth:sanctum`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/me` | Return the authenticated user |
| `GET` | `/api/events` | Return the authenticated user's paginated events |
| `POST` | `/api/events` | Create a new event |
| `GET` | `/api/events/{id}` | Return a single event owned by the user |
| `PUT` | `/api/events/{id}` | Update an event owned by the user |
| `DELETE` | `/api/events/{id}` | Delete an event owned by the user |

## Request Payloads

### Register

`POST /api/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

### Login

`POST /api/login`

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Create or Update an Event

`POST /api/events` or `PUT /api/events/{id}`

```json
{
  "title": "Product Launch",
  "description": "Internal launch planning meeting",
  "start_time": "2026-04-03 10:00:00",
  "end_time": "2026-04-03 12:00:00",
  "location": "Mumbai HQ",
  "category": "Business"
}
```

## Validation Rules

Event requests require:

- `title`: required string, max 255 characters
- `description`: required string
- `start_time`: required valid date, must be before `end_time`
- `end_time`: required valid date, must be after `start_time`
- `location`: required string
- `category`: required string

Auth requests require:

- registration: `name`, `email`, `password`
- login: `email`, `password`

## Pagination

`GET /api/events` returns paginated results with 10 events per page.

Example:

```text
/api/events?page=2
```

## Authorization Rules

- users can only access their own events
- users can only update events they created
- users can only delete events they created

Unauthorized access returns the appropriate HTTP error response.

## Useful Paths

```text
app/Http/Controllers/AuthController.php
app/Http/Controllers/EventController.php
app/Models/Event.php
routes/api.php
database/migrations/
```

## Notes

- The backend is intended to work with the frontend app in `event-management-frontend-main/`.
- If you change the backend host or port, make sure the frontend API configuration is updated to match.
