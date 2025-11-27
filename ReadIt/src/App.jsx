// // src/App.jsx
// import { Routes, Route } from 'react-router-dom';
// import UserProfilePage from './components/profile/UserProfilePage';        // profile folder
// import EditProfilePage from './components/EditProfile/EditProfilePage';      // EditProfile folder

// function App() {
//   return (
//     <Routes>
//       {/* Profile Page */}
//       <Route path="/" element={<UserProfilePage />} />
      
//       {/* Edit Profile Page */}
//       <Route path="/edit" element={<EditProfilePage />} />
      
//       {/* Optional: you can add username in URL like real Reddit */}
//       {/* <Route path="/u/:username" element={<UserProfilePage />} /> */}
//       {/* <Route path="/u/:username/edit" element={<EditProfilePage />} /> */}
//     </Routes>
//   );
// }

// export default App;
// src/App.jsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserProfilePage from './components/profile/UserProfilePage';
import EditProfilePage from './components/EditProfile/EditProfilePage';
import { useState, useEffect } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  // Auto-detect system preference on first load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return (
    <div className={isDark ? 'dark-mode' : ''}>
      {/* Pass toggle function to both pages */}
      <Routes>
        <Route path="/" element={<UserProfilePage toggleDarkMode={toggleDarkMode} isDark={isDark} />} />
        <Route path="/edit" element={<EditProfilePage toggleDarkMode={toggleDarkMode} isDark={isDark} />} />
      </Routes>
    </div>
  );
}

export default App;