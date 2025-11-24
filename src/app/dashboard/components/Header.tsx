// components/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Bell, Languages, Search, ChevronDown, X } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLInputElement)
      ) {
        setActivePopup(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePopup = (popupName: string) =>
    setActivePopup((prev) => (prev === popupName ? null : popupName));

  const notifications = [
    {
      id: 1,
      avatar: "/assets/images/avatar/user.svg",
      name: "MR.Crow Kader",
      time: "1.3 hrs ago",
      message: "Lorem ipsum dolor amet cosec...",
    },
  ];

  const languages = ["English", "Bangla", "Hindi", "Latin"];
  const profileMenu = [
    {
      icon: "profile",
      text: "Profile Setting",
      href: "/dashboard/profile-setting",
    },
    { icon: "settings", text: "Settings", href: "#" },
  ];

  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex items-center mx-auto max-w-[1430px] w-[1430px] justify-between h-16">
          {/* Left: Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <div className="">
              <button
                onClick={onToggleSidebar}
                aria-label="Toggle sidebar"
                className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
              >
                {/* use your icon */}
                <Image
                  src="/assets/images-dashboard/icons/10.svg"
                  alt="toggle sidebar"
                  width={20}
                  height={20}
                  priority
                />
              </button>
            </div>

            {/* Optional: small title or breadcrumb (kept minimal) */}
            <div className="hidden sm:block">
              {/* can place page title here */}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-3" ref={popupRef}>
            {/* Search */}
            <div className="relative">
              <div className="">
                <button
                  onClick={() => togglePopup("search")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md focus:outline-none ${
                    activePopup === "search"
                      ? "bg-[#629d23] text-white"
                      : "hover:bg-[#629d23] hover:text-white"
                  }`}
                  aria-expanded={activePopup === "search"}
                  aria-haspopup="true"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Search dropdown */}
              <div className="">
                {activePopup === "search" && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-[260px] bg-white rounded-sm shadow-lg z-50 p-3"
                  >
                    <input
                      ref={searchInputRef}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                      placeholder="Search"
                      type="text"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <div className="">
                <button
                  onClick={() => togglePopup("notification")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md focus:outline-none ${
                    activePopup === "notification"
                      ? "bg-[#629d23] text-white"
                      : "hover:bg-[#629d23] hover:text-white"
                  }`}
                  aria-expanded={activePopup === "notification"}
                  aria-haspopup="true"
                >
                  <Bell size={18} />
                </button>
              </div>

              <div className="">
                {activePopup === "notification" && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-[420px] max-h-[480px] scrollbar-hide overflow-auto bg-white border rounded-md shadow-lg z-50"
                  >
                    <div className="p-4 border-b">
                      <div className="flex items-center h-15 justify-between">
                        <div className="h-21">
                          <h3 className="text-sm font-medium">Notification</h3>
                        </div>
                        <div className="">
                          <p className="text-md text-gray-500">5</p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const item = notifications[0];
                        return (
                          <div key={idx} className="p-3 hover:bg-gray-50">
                            <a className="flex items-start gap-3" href="#">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                <Image
                                  src={item.avatar}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">
                                    {item.name}
                                  </h4>
                                  <span className="text-[12px] text-gray-400">
                                    {item.time}
                                  </span>
                                </div>
                                <p className="text-[12px] text-gray-500 mt-1">
                                  {item.message}
                                </p>
                              </div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Language */}
            <div className="relative">
              <div className="">
                <button
                  onClick={() => togglePopup("language")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md focus:outline-none ${
                    activePopup === "language"
                      ? "bg-[#629d23] text-white"
                      : "hover:bg-[#629d23] hover:text-white"
                  }`}
                  aria-expanded={activePopup === "language"}
                  aria-haspopup="true"
                >
                  <Languages size={18} />
                </button>
              </div>

              <div className="">
                {activePopup === "language" && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-50 bg-white border rounded-md shadow-lg z-50 p-2"
                  >
                    <div className="text-[16px]">
                      {languages.map((lang) => (
                        <div key={lang}>
                          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-50">
                            {lang}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile */}
            <div className="relative">
              <div className="">
                <button
                  onClick={() => togglePopup("profile")}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md focus:outline-none ${
                    activePopup === "profile"
                      ? "bg-[#629d23] text-white"
                      : "hover:bg-[#629d23] hover:text-white"
                  }`}
                  aria-expanded={activePopup === "profile"}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100">
                    {/* example avatar; replace with your path or uploaded image path */}
                    <Image
                      src="/assets/images/avatar/01.png"
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </div>
                </button>
              </div>

              <div className="">
                {activePopup === "profile" && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-12 w-146 bg-white rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4 border-b">
                      <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src="/assets/images/avatar/user-2.svg"
                          alt="User"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="h-20">
                          <div className="">
                            <p className="text-[30px] font-medium">MR.Crow Kader</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            CEO, Valo How Masud
                          </p>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="">
                        {profileMenu.map((item, idx) => (
                          <div key={idx} className="w-full flex hover:bg-[#629d23] rounded-md hover:text-white items-center h-[50px]">
                            <a
                              href={item.href}
                              className="block px-3 py-2 text-[18px] text-gray-700 hover:text-white"
                            >
                              {item.text}
                            </a>
                          </div>
                        ))}
                        <div className="w-full h-[50px] flex items-center">
                          <a
                            href="#"
                            className="block px-3 py-2 text-[18px] text-red-600"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
