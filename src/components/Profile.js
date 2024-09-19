import React from "react";

const Profile = ({ profile }) => {
  if (!profile) {
    return <div>Loading...</div>; // Handle the case where the profile is not available yet
  }

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      <div style={styles.infoRow}>
        <strong>Username:</strong> <span>{profile.username}</span>
      </div>
      <div style={styles.infoRow}>
        <strong>Free Minutes:</strong> <span>{profile.free_minutes}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
    width: "300px",
    margin: "20px auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  infoRow: {
    margin: "8px 0",
  },
};

export default Profile;
