// // src/components/profile/UserProfilePage.jsx
// import React, { useState, useEffect } from 'react';
// import LeftSidebar from '../LeftSidebar';
// import ProfileBanner from './ProfileBanner';
// import ProfileHeader from './ProfileHeader';
// import ProfileTabs from './ProfileTabs';
// import ProfileContent from './ProfileContent';
// import ProfileSidebar from './ProfileSidebar';

// // Import all your modular styles
// import './styles/profile.css';
// import './styles/header.css';
// import './styles/tabs.css';
// import './styles/content.css';
// import './styles/sidebar.css';
// import './styles/dark.css';

// export default function UserProfilePage() {
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [isDark, setIsDark] = useState(false);

//   const user = {
//     username: 'Moist_Barber_9724',
//     karma: 1,
//     cakeDay: 'November 2024',
//     followers: 0,
//     contributions: 0,
//     redditAge: '0 d',
//     gold: 0,
//   };

//   // Auto-detect system dark mode
//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handler = (e) => setIsDark(e.matches);
//     mediaQuery.addEventListener('change', handler);
//     return () => mediaQuery.removeEventListener('change', handler);
//   }, []);

//   const toggleDarkMode = () => setIsDark(prev => !prev);

//   return (
//     <div className={isDark ? 'dark-mode' : ''}>
//       {/* Dark Mode Toggle Button */}
//       <button
//         onClick={toggleDarkMode}
//         aria-label="Toggle dark mode"
//         style={{
//           position: 'fixed',
//           top: '70px',
//           right: '20px',
//           zIndex: 10000,
//           padding: '10px 16px',
//           borderRadius: '999px',
//           background: isDark ? '#d7dadc' : '#1a1a1b',
//           color: isDark ? '#000' : '#fff',
//           border: 'none',
//           fontWeight: 'bold',
//           fontSize: '14px',
//           cursor: 'pointer',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//         }}
//       >
//         {isDark ? 'Light Mode' : 'Dark Mode'}
//       </button>

//       <div className="profile-page-wrapper">
//         <LeftSidebar />

//         <div className="profile-page">
//           <ProfileBanner />
          
//           <div className="profile-container">
//             <main className="profile-main">
//               <ProfileHeader user={user} />
//               <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
//               <ProfileContent activeTab={activeTab} />
//             </main>

//             <aside className="profile-aside">
//               <ProfileSidebar user={user} />
//             </aside>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/profile/UserProfilePage.jsx
import React from 'react';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import ProfileBanner from './ProfileBanner';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfileContent from './ProfileContent';
import ProfileSidebar from './ProfileSidebar';

// Import styles
import './styles/profile.css';
import './styles/header.css';
import './styles/tabs.css';
import './styles/content.css';
import './styles/sidebar.css';
import './styles/dark.css';

// Accept props from App.jsx
export default function UserProfilePage({ isDark, toggleDarkMode }) {
  const [activeTab, setActiveTab] = React.useState('Overview');

  const user = {
    username: 'Moist_Barber_9724',
    karma: 1,
    cakeDay: 'November 2024',
    followers: 0,
    contributions: 0,
    redditAge: '0 d',
    gold: 0,
  };

  return (
    <>
      {/* Dark Mode Toggle Button — same on every page */}
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          zIndex: 10000,
          padding: '10px 16px',
          borderRadius: '999px',
          background: isDark ? '#d7dadc' : '#1a1a1b',
          color: isDark ? '#000' : '#fff',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="profile-page-wrapper">
        <LeftSidebar />

        <div className="profile-page">
          <ProfileBanner />
          
          <div className="profile-container">
            <main className="profile-main">
              <ProfileHeader user={user} />
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <ProfileContent activeTab={activeTab} />
            </main>

            <aside className="profile-aside">
              <ProfileSidebar user={user} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}