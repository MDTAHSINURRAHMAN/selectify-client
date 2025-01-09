import React from "react";
import logo from "../../assets/logo-cropped.png";

const Logo = () => {
  return (
    <div className="h-[100px] flex items-center justify-center bg-background-color">
      <img className="h-[75px]" src={logo} alt="Logo" />
    </div>
  );
};

export default Logo;
