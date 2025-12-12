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
- Direct Messaging (using sockets!!)
- Notifications (using sockets!!)
- AI-generated summaries for posts!! (using hugging face!!)
- Search (posts, users, communities)
- Light / Dark mode theme

---

## 📌 Requirements

Make sure you have these installed:

- Node.js (v16+ recommended)
- npm package manager

Then install dependencies:

```bash
cd frontend
npm install
npm install react-icons
npm install multer
npm install @huggingface/inference
````

Example:

```bash
cd backend
npm install
npm install react-icons
npm install multer
npm install @huggingface/inference
````

---

## ▶️ How to Run

### Start Backend

```bash
npm start
```

Server will run on:
`http://localhost:5000` (or whichever port you configure)

---

### Start Frontend

```bash
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
| Database | MongoDB                      |
