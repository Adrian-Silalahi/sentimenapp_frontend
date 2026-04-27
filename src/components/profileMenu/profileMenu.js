import React from "react";
import "./profileMenu.scss";

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18px"
    height="18px"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const ProfileMenu = () => {
  const username = localStorage.getItem("username");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "/login";
  };
  return (
    <div className="profile-menu-improved">
      <div className="user-info-section">
        <div className="username-display">{username}</div>
      </div>
      <button className="logout-button-improved" onClick={handleLogout}>
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileMenu;
