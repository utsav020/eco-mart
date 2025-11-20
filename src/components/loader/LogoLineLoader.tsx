"use client";

import React from "react";
import Image from "next/image";

const LogoLineLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-40 mx-auto">
      {/* Logo */}
      <div className="logo-line-loader">
        <img
          src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
          alt="Dadu Fresh Logo" 
        //   className="logo-spin-loader"
        />
        <div className="loading-line"></div>
      </div>
    </div>
  );
};

export default LogoLineLoader;
