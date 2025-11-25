import React, { useState } from 'react';
import LeftSidebar from '../LeftSidebar';
import ProfileBanner from './ProfileBanner';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfileContent from './ProfileContent';
import ProfileSidebar from './ProfileSidebar';

import './styles/profile.css';
import './styles/header.css';
import './styles/tabs.css';
import './styles/content.css';
import './styles/sidebar.css';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const user = {
    username: 'Moist_Barber_9724',
    karma: 1,
    cakeDay: 'November 2024',
    followers: 0,
    contributions: 0,
    redditAge: '0 d',
    gold: 0,
    activeIn: 0,
  };

  return (
    <div className="profile-page-wrapper">
      <LeftSidebar />
      
      <div className="profile-page">
        <ProfileBanner />
        <div className="profile-container">
          <div className="profile-main">
            <ProfileHeader user={user} />
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <ProfileContent activeTab={activeTab} />
          </div>
          <aside className="profile-aside">
            <ProfileSidebar user={user} />
          </aside>
        </div>
      </div>
    </div>
  );
}