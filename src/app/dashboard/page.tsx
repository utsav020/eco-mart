"use client";

import { useState } from "react";
import SideLeft from "./components/SideLeft";
import Header from "./components/Header";
import DemoContent from "../dashboard/components/DemoContent";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex items-start min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideLeft collapsed={sidebarCollapsed} />

      {/* Right Content */}
      <div
        className={`
          min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "ml-0 w-full" : "ml-[273px] w-[calc(100%-273px)]"}
          
          md:max-lg:w-full md:max-lg:ml-0
          max-md:w-full max-md:ml-0

          ${sidebarCollapsed ? "md:max-lg:-mr-[273px] max-md:-mr-[273px]" : ""}
        `}
      >
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-4 md:p-6">
          <DemoContent />
        </main>
      </div>
    </div>
  );
}
