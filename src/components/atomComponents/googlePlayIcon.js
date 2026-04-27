import React from "react";
import google_play from "../../assets/google_play.png";

export const GooglePlayIcon = ({ width, height }) => {
  return (
    <img
      src={google_play}
      alt="Google Play Icon"
      style={{ width: width, height: height }}
    />
  );
};
