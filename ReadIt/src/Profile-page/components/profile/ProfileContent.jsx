import React from 'react';
import EmptyState from './EmptyState';

export default function ProfileContent() {
  const hasPosts = false;

  return (
    <div className="card profile-content">
      {hasPosts ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
          Posts will appear here
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}