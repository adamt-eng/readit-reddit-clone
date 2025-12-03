// src/components/EditProfile/EditProfilePage.jsx
import { Link } from 'react-router-dom';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import './EditProfilePage.css';

export default function EditProfilePage({ isDark, toggleDarkMode }) {
  return (
    <>
      {/* Dark Mode Toggle Button — same as profile page */}
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
          <div className="edit-profile-container">
            {/* Header */}
            <div className="edit-profile-header">
              <h1>Edit Profile</h1>
              <Link to="/">
                <button className="cancel-btn">Cancel</button>
              </Link>
            </div>

            {/* Main Card */}
            <div className="edit-profile-card">
              {/* AVATAR + BUTTON — PERFECTLY CENTERED */}
              <div className="avatar-section">
                <div className="avatar-with-button">
                  <img
                    src="/default-avatar.png"
                    alt="User avatar"
                    className="current-avatar"
                  />
                  <button className="change-avatar-btn">Change Avatar</button>
                </div>
              </div>

              {/* Form */}
              <div className="form-section">
                <label>Display Name</label>
                <input type="text" defaultValue="Moist_Barber_9724" />

                <label>About (Bio)</label>
                <textarea rows="5" placeholder="Tell us about yourself..." />

                <div className="save-btn-wrapper">
                  <button className="save-btn">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



// // src/components/profile/EditProfilePage.jsx
// import { Link } from 'react-router-dom';
// import LeftSidebar from '../LeftSidebar';
// import './EditProfilePage.css';

// export default function EditProfilePage() {
//   return (
//     <div className="profile-page-wrapper">
//       <LeftSidebar />

//       <div className="profile-page">
//         <div className="edit-profile-container">
//           {/* Header */}
//           <div className="edit-profile-header">
//             <h1>Edit Profile</h1>
//             <Link to="/">
//               <button className="cancel-btn">Cancel</button>
//             </Link>
//           </div>

//           {/* Main Card */}
//           <div className="edit-profile-card">
//             {/* AVATAR + BUTTON — PERFECTLY CENTERED TOGETHER */}
//             <div className="avatar-section">
//               <div className="avatar-with-button">
//                 <img
//                   src="/default-avatar.png"
//                   alt="User avatar"
//                   className="current-avatar"
//                 />
//                 <button className="change-avatar-btn">Change Avatar</button>
//               </div>
//             </div>

//             {/* Form */}
//             <div className="form-section">
//               <label>Display Name</label>
//               <input type="text" defaultValue="Moist_Barber_9724" />

//               <label>About (Bio)</label>
//               <textarea rows="5" placeholder="Tell us about yourself..." />

//               <div className="save-btn-wrapper">
//                 <button className="save-btn">Save Changes</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }