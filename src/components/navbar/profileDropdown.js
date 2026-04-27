import ProfileImage from "../../assets/profile.png";
import ProfileMenu from "../profileMenu/profileMenu";
import React, { useState, useEffect, useRef } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        imageRef.current &&
        !menuRef.current.contains(event.target) &&
        !imageRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <img
        ref={imageRef}
        src={ProfileImage}
        alt="Profile"
        className="profile-image"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div ref={menuRef}>
          <ProfileMenu />
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
