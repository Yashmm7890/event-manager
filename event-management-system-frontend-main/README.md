# 🎉 Event Management System - Frontend

This is the **frontend** of a Mini Event Management System built with **Next.js**, **React**, and **Tailwind CSS**. It provides a seamless user interface to register, log in, and manage events (create, edit, delete, and list) via a Laravel API backend.

---

## 🚀 Features

- 🔐 **Authentication**: Register and log in via Laravel API
- 📋 **Dashboard**: Paginated list of events with full CRUD functionality
- 📝 **Event Management**: Create and edit events with client-side validation
- ⚛️ **State Management**: React Context (`AuthContext`) to manage authentication
- 💡 **UX Enhancements**: Loading indicators, error handling, session timeout, logout

---

## 🛠 Tech Stack

- **Next.js** – React framework for SSR and routing  
- **React** – Component-based UI library  
- **Tailwind CSS** – Utility-first CSS framework  
- **TypeScript** – Strongly-typed JavaScript

---

## 📦 Prerequisites

- **Node.js** (v18.x or higher)  
- **Backend API** running at [`http://localhost:8000`](http://localhost:8000)  
  👉 [Backend Repository](https://github.com/ixmsanto/event-management-system-backend.git)

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ixmsanto/event-management-system-frontend.git
   cd event-management-frontend
2. **Install Dependencies**
   ```bash
   npm install
### 3. Configure Environment

- The frontend assumes your backend API is running at:  
  `http://localhost:8000`
- If your backend is hosted elsewhere, update the API URLs in the code accordingly.

---

### 4. Run the Development Server

```bash
npm run dev
### 5. Open in Browser
Navigate to http://localhost:3000 to view the app


---

## 📱 Usage

| Page         | Path              | Description                               |
|--------------|-------------------|-------------------------------------------|
| Register     | `/register`       | Create a new account                      |
| Login        | `/login`          | Log in with your credentials              |
| Dashboard    | `/dashboard`      | View and manage your events               |
| Create Event | `/events/create`  | Add a new event                           |
| Edit Event   | `/events/edit/:id`| Edit an existing event                    |

- ✅ **Validation**: `start_time` must be before `end_time` when creating or editing events  
- 🗑 **Delete**: Remove events directly from the dashboard  
- 🔐 **Logout**: Clears session and redirects to login  
- ⚠️ **Session Expiry**: Automatically logs out on 401 Unauthorized

---

## 📁 Project Structure

```plaintext
event-management-frontend/
├── app/                # Next.js routes and pages
│   ├── dashboard/      # Dashboard page
│   ├── events/         # Create/Edit event pages
│   ├── login/          # Login page
│   └── register/       # Registration page
├── components/         # Reusable React components (e.g., EventForm)
├── contexts/           # AuthContext for managing auth state
├── hooks/              # Custom hooks (e.g., useAuth)
├── public/             # Static assets
├── styles/             # Tailwind and global CSS

## 🔄 Pagination
Events are displayed 10 per page

Uses the backend API’s ?page= query parameter for pagination

## 🙌 Contributing
Contributions are welcome!
Feel free to fork, open issues, or submit pull requests.