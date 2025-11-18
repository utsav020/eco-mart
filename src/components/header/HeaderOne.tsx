"use client";

import React, { useState } from "react";
import Cart from "./Cart";
import Link from "next/link";

export default function HeaderThree() {
  const [activeMenu, setActiveMenu] = useState("Home");

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Top Green Bar */}
      <div className="max-w-[1920px] border-2 mx-auto h-[39.78px] text-[16px] flex items-center justify-evenly text-white w-full bg-[#018F45]">
        <span>CSC kalavad farmer producer company limited</span>
        <span>CSC kalavad farmer producer company limited</span>
        <span>CSC kalavad farmer producer company limited</span>
        <span>CSC kalavad farmer producer company limited</span>
        <span>CSC kalavad farmer producer company limited</span>
      </div>

      <div className="">
        {/* Main Header */}
        <div className="max-w-[1730px] flex items-center mx-auto h-20 mt-[20.22px]">
          <div className="flex justify-between max-w-[1430px] w-full items-center flex-row">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
                alt="logo-main"
                className="h-[72px]"
              />
            </div>

            {/* Navbar */}
            <div>
              <div className="flex justify-evenly text-black text-[18px] w-[409px]">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveMenu(item.name)}
                    className={`cursor-pointer transition-colors duration-300 ${
                      activeMenu === item.name
                        ? "text-[#018F45] font-semibold"
                        : "text-black hover:text-[#018F45]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User + Cart */}
            <div className="w-[115px] border">
              <div className="flex items-center border">
                <Link href={"/account"} className="cursor-pointer">
                  <img src="/assets/images/navbar/User.png" alt="User" />
                </Link>
                <img src="/assets/images/navbar/Heart.png" alt="Wishlist" />
                <Link className="cursor-pointer h-5 w-5" href={"/cart"}><Cart /></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {/* <div className="text-[20px] ml-[45px]  mt-2">
          <p className="text-black">
            Home <span className="text-gray-600">/ {activeMenu}</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
