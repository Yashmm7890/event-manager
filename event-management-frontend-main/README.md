# Event Management System Frontend

Next.js 16 frontend for the Event Management System. This app provides the user interface for authentication, event creation, event editing, and dashboard-based event management against the Laravel backend API.

## Overview

The frontend includes:

- registration and login flows
- authenticated dashboard with paginated event listings
- create, edit, and delete event actions
- shared UI components for forms, panels, notices, and layout
- light and dark theme support
- API integration with token-based authentication

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Geist fonts

## Project Location

In this workspace, the frontend lives at:

```text
event-management-frontend-main/
```

If you are starting from the repo root, move into the frontend with:

```bash
cd event-management-frontend-main
```

## Prerequisites

Make sure these are installed locally:

- Node.js 18 or newer
- npm
- the Laravel backend running locally

By default, this frontend expects the backend API at:

```text
http://localhost:8000/api
```

## Local Setup

1. Install dependencies.

```bash
cd event-management-frontend-main
npm install
```

2. Configure the backend API URL if needed.

The app uses:

```text
NEXT_PUBLIC_API_BASE_URL
```

If you do not set it, the frontend defaults to:

```text
http://localhost:8000/api
```

To override it, create an `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

3. Start the development server.

```bash
npm run dev
```

4. Open the app in your browser.

```text
http://localhost:3000
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Redirects to login or dashboard depending on auth state |
| `/login` | Log in to an existing account |
| `/register` | Create a new account |
| `/dashboard` | View paginated events and account actions |
| `/events/new` | Create a new event |
| `/events/[id]/edit` | Edit an existing event |

## Authentication Flow

- the app stores the API token in local storage
- authenticated requests send `Authorization: Bearer <token>`
- unauthorized API responses can trigger logout and redirect to login
- the root route redirects users to the appropriate page based on auth state

## API Configuration

API requests are handled through:

```text
lib/api.ts
```

Default API base URL:

```text
http://localhost:8000/api
```

You can override it with:

```text
NEXT_PUBLIC_API_BASE_URL
```

## Project Structure

```text
app/
  dashboard/           Dashboard page
  events/              Event create and edit pages
  login/               Login page
  register/            Registration page
  globals.css          Global styles
  layout.tsx           Root app layout
components/
  EventForm.tsx        Shared event form
  ui.tsx               Shared UI building blocks
contexts/
  AuthContext.tsx      Authentication state
  ThemeContext.tsx     Theme state
hooks/
  useAuth.ts           Auth helper hook
lib/
  api.ts               API client and error handling
types/
  event.ts             Shared event types
```

## User Experience Notes

- event listings are paginated using the backend pagination response
- form validation errors are surfaced from API responses
- dashboard actions include edit and delete flows
- the UI supports theme switching through the theme context

## Related Project

This frontend is designed to work with the Laravel backend in:

```text
event-management-backend-main/
```

If you change the backend host or port, update `NEXT_PUBLIC_API_BASE_URL` to match.
