import React from "react";

const Profile = ({ profile }) => {
  if (!profile) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="profile-card">
      <h3>Profile</h3>
      <div className="profile-info-row">
        <strong>Username:</strong> <span>{profile.username}</span>
      </div>
      <div className="profile-info-row">
        <strong>Free Minutes:</strong> <span>{profile.free_minutes}</span>
      </div>
    </div>
  );
};

export default Profile;
