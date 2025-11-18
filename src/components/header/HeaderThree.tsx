"use client";

import React, { useState } from "react";
import Cart from "./Cart";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function HeaderThree() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/index-three" },
    { label: "Shop", path: "/shop" },
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact Us", path: "/contact" },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <header className="w-full">
      {/* Top Green Bar */}
      <div className="w-full bg-[#018F45] text-white text-[15px] py-2">
        <div className="max-w-[1920px] mx-auto flex items-center justify-evenly overflow-hidden">
          <span className="w-[351px]">
            CSC kalavad farmer producer company limited
          </span>
          <span className="w-[351px]">
            CSC kalavad farmer producer company limited
          </span>
          <span className="w-[351px]">
            CSC kalavad farmer producer company limited
          </span>
          <span className="w-[351px]">
            CSC kalavad farmer producer company limited
          </span>
          <span className="w-[351px]">
            CSC kalavad farmer producer company limited
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1430px] border mx-auto px-4 lg:px-0 py-4">
        <div className="max-w-[1430px] bg-white mx-auto">
          <div className="flex justify-between">
            {/* Logo */}
            <div
              className="lg:flex hidden items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick("/index-three")}
            >
              <img
                src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
                alt="logo"
                className="h-[65px] w-auto"
              />
            </div>

            {/* Desktop Navbar */}
            <div className="hidden lg:flex items-center font-semibold justify-between text-[18px] w-[416px]">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`cursor-pointer transition ${
                    pathname === item.path
                      ? "text-[#018F45]"
                      : "text-black hover:text-[#077D40]"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* User + Icons */}
            <div className="hidden w-[117px] justify-evenly lg:flex border items-center">
              <div className="">
                <img
                  src="/assets/images/navbar/User.png"
                  alt="User"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/account")}
                />
              </div>

              <div className="">
                <img
                  src="/assets/images/navbar/Heart.png"
                  alt="Wishlist"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/wishlist")}
                />
              </div>

              <div className="">
                <img
                  src="/assets/images/navbar/Bag.png"
                  alt="Wishlist"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/cart")}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center lg:hidden justify-between max-w-full w-full">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick("/index-three")}
            >
              <img
                src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
                alt="logo"
                className="h-[65px] w-auto"
              />
            </div>

            <div className="">
              <button className="" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Responsive Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 bg-white border-t pt-4">
            <div className="flex flex-col gap-4 text-[18px] pb-4">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`cursor-pointer transition ${
                    pathname === item.path
                      ? "text-[#018F45]"
                      : "text-black hover:text-[#018F45]"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Mobile User Icons */}
            <div className="flex items-center gap-6 border-t pt-4">
              <img
                src="/assets/images/navbar/User.png"
                alt="User"
                className="w-[26px] cursor-pointer"
                onClick={() => handleNavClick("/account")}
              />

              <img
                src="/assets/images/navbar/Heart.png"
                alt="Wishlist"
                className="w-[26px] cursor-pointer"
                onClick={() => handleNavClick("/wishlist")}
              />

              <Cart />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
