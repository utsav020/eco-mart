"use client";

import React, { useState } from "react";
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

  const CSCText = [
    "CSC kalavad farmer producer company limited",
    "CSC kalavad farmer producer company limited",
    "CSC kalavad farmer producer company limited",
    "CSC kalavad farmer producer company limited",
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-999 bg-white">
      <div className="">
        {/* ---------------- TOP GREEN MARQUEE ---------------- */}
        <div className="w-full bg-[#018F45] text-white text-[15px] py-2">
          <div className="marquee-wrapper">
            {/* Track (repeated twice = infinite loop) */}
            <div className="marquee-track">
              {CSCText.map((t, i) => (
                <span key={`a-${i}`} className="px-10">
                  {t}
                </span>
              ))}

              {/* Duplicate to avoid gap */}
              {CSCText.map((t, i) => (
                <span key={`b-${i}`} className="px-10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN HEADER ---------------- */}
        <div className="max-w-[1430px] mx-auto px-4 lg:px-0 py-4">
          <div className="flex justify-between items-center bg-white">
            {/* Logo */}
            <div
              className="hidden lg:flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick("/index-three")}
            >
              <img
                src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
                alt="logo"
                className="h-[65px] w-auto"
              />
            </div>

            {/* Desktop Navbar */}
            <nav className="hidden lg:flex items-center font-semibold text-[18px] gap-10">
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
            </nav>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center gap-6">
              <img
                src="/assets/images/navbar/User.png"
                className="w-[26px] cursor-pointer"
                onClick={() => handleNavClick("/account")}
              />
              <img
                src="/assets/images/navbar/Heart.png"
                className="w-[26px] cursor-pointer"
                onClick={() => handleNavClick("/wishlist")}
              />
              <img
                src="/assets/images/navbar/Bag.png"
                className="w-[26px] cursor-pointer"
                onClick={() => handleNavClick("/cart")}
              />
            </div>

            {/* Mobile Header */}
            <div className="flex items-center lg:hidden justify-between w-full">
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

              <button onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* ---------------- MOBILE MENU ---------------- */}
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

              {/* Mobile Icons */}
              <div className="flex items-center gap-6 border-t pt-4">
                <img
                  src="/assets/images/navbar/User.png"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/account")}
                />
                <img
                  src="/assets/images/navbar/Heart.png"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/wishlist")}
                />
                <img
                  src="/assets/images/navbar/Bag.png"
                  className="w-[26px] cursor-pointer"
                  onClick={() => handleNavClick("/cart")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
