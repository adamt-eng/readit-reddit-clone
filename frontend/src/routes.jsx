import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import UserProfilePage from "../pages/ProfilePage/UserProfilePage.jsx";
import EditProfilePage from "../pages/EditProfile/EditProfilePage.jsx";
import DirectMessages from "../pages/Direct Messages/DirectMessages.jsx";
import Login from "../pages/Authentication/Login.jsx";
import Signup from "../pages/Authentication/Signup.jsx";
import SearchResults from "../pages/SearchResults/SearchResults.jsx";
import CommunityPage from "../pages/CommunityPage/CommunityPage.jsx";
import Notifications from "../pages/Notifications/Notifications.jsx";
import ExplorePage from "../pages/ExplorePage/ExplorePage.jsx";
import PostPage from "../pages/PostPage/PostPage.jsx";
import CreatePost from "../components/Posts/CreatePost/CreatePost.jsx";

export default function AppRoutes({
  currentUser,
  onLogin,
  setCurrentUser,
  setShowAuth,
}) {

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <HomePage/>
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/guest"
          element={
            !currentUser ? (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            ) : (
              <HomePage
                user={currentUser}
              />
            )
          }
        />

        <Route
          path="/user/:id"
          element={
            currentUser ? (
              <UserProfilePage />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/community/:communityName"
          element={
            currentUser ? (
              <CommunityPage />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            currentUser ? (
              <Notifications />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/edit-profile"
          element={
            currentUser ? (
              <EditProfilePage setCurrentUser={setCurrentUser} />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/popular"
          element={
            currentUser ? (
              <HomePage/>
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/create-post"
          element={
            currentUser ? (
              <CreatePost currentUser={currentUser} />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/messages"
          element={
            currentUser ? (
              <DirectMessages currentUser={currentUser} />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/login"
          element={
            !currentUser ? (
              <Login onLogin={onLogin} />
            ) : (
              <HomePage
                user={currentUser}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !currentUser ? (
              <Signup onSignup={onLogin} />
            ) : (
              <HomePage
                user={currentUser}
              />
            )
          }
        />

        <Route
          path="/search"
          element={
            currentUser ? (
              <SearchResults />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/explore"
          element={
            currentUser ? (
              <ExplorePage />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/posts/:postId"
          element={
            currentUser ? (
              <PostPage />
            ) : (
              <GuestHomePage setShowAuth={setShowAuth} onLogin={onLogin} />
            )
          }
        />
      </Routes>
    </>
  );
}