# ReadIt – Full Stack Reddit Clone

ReadIt is a Reddit-like social platform where users can create accounts, join communities, publish posts, comment, and interact with others.  
This project includes:

- A **Node.js + Express** backend
- A **React + Vite** frontend

---

## 🚀 Features

- User authentication (Login / Signup)
- Home feed (guest + authenticated versions)
- Create and browse communities
- Create text, link & image posts
- Vote, comment, join/leave communities
- Direct Messaging
- Notifications
- Search (posts, users, communities)
- Light / Dark mode theme

---

## 📂 Project Structure

```

/backend   → Server-side API (Express)
/frontend  → Client UI (React, Vite)

```

Backend and frontend are separated to make deployment easier and development cleaner.

---

## 📌 Requirements

Make sure you have these installed:

- Node.js (v16+ recommended)
- npm package manager

Then install dependencies:

```

npm install
npm install react-icons

````

You must run these inside the `frontend` folder.

Example:

```bash
cd frontend
npm install
npm install react-icons
````

---

## ▶️ How to Run

### Start Backend

```bash
cd backend
npm install
npm start
```

Server will run on:
`http://localhost:5000` (or whichever port you configure)

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on:
`http://localhost:5173` by default (Vite)

---

## 🛠️ Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React, Vite, CSS Modules     |
| Routing  | React Router                 |
| Backend  | Node.js, Express.js          |
| Database | MongoDB (future integration) |

---

## 📌 Status

✔ UI pages merged
✔ Project structure organized
⚙ Routing integration in progress
⚙ API connections and authentication upcoming

---
