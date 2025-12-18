# Readit – Full Stack Reddit Clone

Readit is a feature-rich social platform inspired by Reddit, where users can create accounts, join communities, publish posts, comment, vote, and interact with others in real-time. Built with a modern tech stack featuring real-time socket communication, AI-powered post summaries, and a fully responsive React frontend.

**🌐 Live Demo:** [https://readit-reddit-clone.vercel.app](https://readit-reddit-clone.vercel.app)

---

## 🚀 Features

### User & Authentication
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- User profiles with avatars, bios, and karma tracking
- Edit profile functionality with image uploads

### Communities
- Create and browse communities
- Community headers with banners and icons
- Join/leave communities (membership management)
- Community discovery and popular communities
- Edit community details (for creators)

### Posts & Content
- Create text, link, and image posts
- Image uploading to dedicated Uploads directory
- Vote on posts (upvote/downvote)
- View trending and recent posts
- Post sorting and filtering
- AI-generated summaries for posts using HuggingFace

### Interactions
- Comment on posts with nested discussions
- Vote on comments (upvote/downvote)
- Like posts and comments
- Karma system based on community engagement
- Contribution tracking

### Real-Time Features (Socket.io)
- Direct Messaging (DM) with real-time chat
- Floating DM widget for quick access
- Real-time notifications for activities (upvotes, comments, messages)
- Online user tracking
- Live notification delivery

### Discovery
- Full-text search across posts, users, and communities
- Search results with categorized content
- Explore page for discovering new content
- Trending posts section

### User Interface
- Guest and authenticated home feed views
- Responsive design optimized for all devices
- Theme support (light/dark mode ready)
- Intuitive navigation with sidebar
- Post tabs and sorting options

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.2
- **Database:** MongoDB with Mongoose 9.0
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **Real-Time:** Socket.io 4.8
- **AI Integration:** HuggingFace Inference API
- **File Handling:** Multer for image uploads
- **Middleware:** CORS, Cookie Parser, Auth Middleware
- **Development:** Nodemon

### Frontend
- **Framework:** React 19
- **Bundler:** Vite 7
- **Routing:** React Router DOM 7.10
- **HTTP Client:** Axios
- **Real-Time:** Socket.io-client 4.8
- **UI Icons:** React Icons 5.5
- **Styling:** CSS with theme support
- **Build Tool:** Vite with React plugin

---

## 📁 Project Structure

```
readit-reddit-clone/
├── backend/
│   ├── Controllers/          # Request handlers for all features
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── PostController.js
│   │   ├── CommentController.js
│   │   ├── CommunityController.js
│   │   ├── VoteController.js
│   │   ├── DMController.js
│   │   ├── NotificationController.js
│   │   ├── MembershipController.js
│   │   └── AiSummaryController.js
│   ├── Models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Community.js
│   │   ├── Votes.js
│   │   ├── Membership.js
│   │   ├── DMConversation.js
│   │   ├── DMMessage.js
│   │   ├── Notification.js
│   │   └── Ai_Summary.js
│   ├── Routers/              # API route definitions
│   ├── Middleware/           # Auth and custom middleware
│   ├── Uploads/              # User uploaded files (avatars, posts, communities)
│   ├── server.js             # Main server entry point
│   └── package.json
├── frontend/
│   ├── components/           # Reusable React components
│   │   ├── Navbar/
│   │   ├── LeftSidebar/
│   │   ├── Posts/
│   │   ├── Community/
│   │   ├── Comment/
│   │   ├── FloatingDM/
│   │   ├── NotificationItem/
│   │   └── SearchItem/
│   ├── pages/                # Page-level components
│   │   ├── Authentication/
│   │   ├── HomePage/
│   │   ├── ProfilePage/
│   │   ├── CommunityPage/
│   │   ├── PostPage/
│   │   ├── ExplorePage/
│   │   ├── SearchResults/
│   │   ├── Notifications/
│   │   └── Direct Messages/
│   ├── context/              # React Context (Theme, Socket)
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── routes.jsx        # Route configuration
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ▶️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas connection string)
- HuggingFace API token (for AI summaries)

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/readit

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key

# HuggingFace AI
HF_TOKEN=your_huggingface_api_token

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Installation & Setup

#### Backend Setup
```bash
cd backend
npm install
npm start        # Production mode
# OR
npm run dev      # Development mode with hot reload
```

The backend will start on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend
npm install
npm start        # Production mode
# OR
npm run dev      # Development mode with hot reload
```

The frontend will start on `http://localhost:5173`

### Build for Production

**Backend:** Backend is deployment-ready as-is

**Frontend:**
```bash
cd frontend
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build
```

---

## 🔌 API Routes Overview

### Authentication
- `POST /authentication/signup` - Register new user
- `POST /authentication/login` - Login user
- `POST /authentication/logout` - Logout user

### Users
- `GET /users/me` - Get current user profile
- `GET /users/:userId` - Get user profile by ID
- `PUT /users/:userId` - Update user profile
- `GET /users/:userId/posts` - Get user's posts

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:postId` - Get post details
- `POST /posts` - Create new post
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post

### Communities
- `GET /communities` - Get all communities
- `GET /communities/:communityId` - Get community details
- `POST /communities` - Create new community
- `PUT /communities/:communityId` - Update community
- `DELETE /communities/:communityId` - Delete community

### Comments
- `GET /comments/:postId` - Get comments for post
- `POST /comments` - Create comment
- `PUT /comments/:commentId` - Update comment
- `DELETE /comments/:commentId` - Delete comment

### Votes
- `POST /votes` - Vote on post/comment (upvote/downvote)

### Direct Messages
- `GET /dm/conversations` - Get all DM conversations
- `POST /dm/messages` - Send message
- `GET /dm/messages/:conversationId` - Get conversation messages

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:notificationId/read` - Mark notification as read

### AI Summaries
- `POST /ai-summary/generate` - Generate AI summary for post

### Search
- `GET /search?q=query` - Search across posts, users, communities

---

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed with bcrypt and stored in MongoDB
3. Upon login, credentials are verified and JWT token is issued
4. JWT is stored in HTTP-only cookie for security
5. Protected routes check JWT validity via Auth Middleware
6. User context is maintained throughout the session

---

## 💬 Real-Time Features

### Socket Events
- `register` - Register user as online
- `send-message` - Send DM message
- `receive-message` - Receive DM message
- `notify` - Send notification
- `receive-notification` - Receive notification

The Socket.io server handles real-time communication for:
- Direct messaging between users
- Push notifications for activities
- Online user tracking

---

## 🤖 AI Post Summaries

Powered by HuggingFace's BART summarization model:
- Automatic post summary generation
- Truncates long content to 4000 characters
- Fallback to alternative summarization models if needed
- Stores summaries in database for caching

---

## 📱 File Uploads

Uploaded files are stored in `/backend/Uploads/`:
- **Avatars:** User profile pictures
- **Posts:** Images in posts
- **Communities:** Community banners and icons

Files are served statically via `/uploads` route.

---

## 🎨 Styling & Theme

- CSS modules and regular CSS files
- Theme support with Context API
- Dark/Light mode ready
- Responsive design (mobile, tablet, desktop)
- Component-level styling

---

## 🤝 Key Components & Their Roles

### Backend Components
- **Controllers:** Handle business logic for each feature
- **Models:** Define MongoDB schema structure
- **Routers:** Map endpoints to controller functions
- **Middleware:** Handle authentication and request processing

### Frontend Components
- **Pages:** Full-screen views for each section
- **Components:** Reusable UI elements
- **Context:** Global state management (Theme, Socket)
- **Routes:** Client-side routing with React Router

---

## 📊 Database Models

- **User:** Stores user profiles, authentication, karma
- **Post:** Stores posts with title, content, images
- **Comment:** Stores comments on posts
- **Community:** Stores community information
- **Votes:** Tracks user votes on posts/comments
- **Membership:** Tracks user-community relationships
- **DMConversation:** Stores DM conversation metadata
- **DMMessage:** Stores individual messages
- **Notification:** Stores user notifications
- **Ai_Summary:** Caches AI-generated summaries

---

## 🚀 Deployment

### Live Deployment
- **Frontend:** [readit-reddit-clone.vercel.app](https://readit-reddit-clone.vercel.app) (Vercel)
- **Backend:** Deployed on Render

### Deploy Backend (Node.js)
- Successfully deployed to Render
- Environment variables configured on Render platform
- Connected to MongoDB Atlas for cloud database
- CORS configured for production frontend URL

### Deploy Frontend (Vite)
- Successfully deployed to Vercel
- Auto-deploys on git push
- Set `VITE_API_URL` to production backend URL (Render)
- Build: `npm run build`
- Preview: `npm run preview`

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running locally or update MONGO_URI with Atlas connection string
- Check HF_TOKEN is set for AI features (can be optional)

### CORS errors in browser
- Verify backend `allowedOrigins` includes frontend URL
- Check frontend `VITE_API_URL` matches backend URL

### Socket.io connection issues
- Ensure backend and frontend are using same Socket.io version
- Check browser console for connection errors
- Verify CORS is properly configured