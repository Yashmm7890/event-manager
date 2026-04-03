
---

### Backend README

```markdown
# Event Management System - Backend

This is the backend repository for a Mini Event Management System built with **Laravel**. It provides a RESTful API for user authentication and event management, secured with Laravel Sanctum.

## Features
- **Authentication**: Register and login endpoints issuing Sanctum tokens.
- **Event Management**: CRUD operations for events (list, create, update, delete).
- **Validation**: Ensures all event fields are required and `start_time` is before `end_time`.
- **Security**: Routes protected with `auth:sanctum` middleware; only event owners can modify their events.
- **Pagination**: Event listing supports pagination (10 per page).

## Tech Stack
- **Laravel**: PHP framework for API development.
- **Sanctum**: API token authentication.
- **MySQL**: Database (configurable).

## Prerequisites
- PHP (>= 8.1)
- Composer
- MySQL (or another supported database)
- A frontend client (e.g., [Frontend Repo](https://github.com/ixmsanto/event-management-system-frontend.git)).

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ixmsanto/event-management-system-backend.git
   cd event-management-backend
### 2. Install Dependencies

    ```bash
    composer install

## 2. Configure Environment

    Copy the example environment file and update it:
        ```bash
        cp .env.example .env
    Update .env with your database credentials:
        ```bash
        DB_CONNECTION=mysql  
        DB_HOST=127.0.0.1  
        DB_PORT=3306  
        DB_DATABASE=event_management  
        DB_USERNAME=root  
        DB_PASSWORD=

## 3. Generate Application Key

    ```bash
    php artisan key:generate

## 4. Run Migrations
    ```bash
    php artisan migrate

    This sets up the required users and events tables (assuming migrations are present).

## 5. Start the Development Server

    ```bash
    php artisan serve

    API is now accessible at: http://localhost:8000

## API Endpoints

    Method	Endpoint	Description	Auth Required
    POST	/api/register	Register a new user	No
    POST	/api/login	Login and get token	No
    GET	/api/events	List user’s events	Yes
    POST	/api/events	Create a new event	Yes
    PUT	/api/events/{id}	Update an event	Yes
    DELETE	/api/events/{id}	Delete an event	Yes

## Event Fields

    title (string, required)

    description (string, required)

    start_time (datetime, required)

    end_time (datetime, required)

    location (string, required)

    category (string, required)

## Pagination

    Use ?page=2 or similar to paginate event listings, e.g., /api/events?page=2.

## Project Structure

    ├── app/
│   ├── Http/
│   │   ├── Controllers/      # API Controllers (AuthController, EventController)
│   │   ├── Middleware/       # Custom Middleware (Authenticate.php)
│   ├── Models/               # Eloquent Models (User, Event)
├── config/                   # Configuration files (e.g., session.php, sanctum.php)
├── routes/
│   ├── api.php               # API Routes
│   ├── web.php               # Web Routes (minimal)
├── database/
│   ├── migrations/           # Database Migrations

## Notes

Sanctum: Authentication is handled via Laravel Sanctum. Tokens are returned on register/login and should be sent as:

Authorization: Bearer <token>

Ownership: Only the user who created an event (user_id) can update or delete it.

Error Handling: All responses use proper HTTP status codes:

401 for unauthenticated access

403 for unauthorized actions
