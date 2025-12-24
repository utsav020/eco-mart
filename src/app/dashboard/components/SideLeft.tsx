// components/SideLeft.tsx
"use client";
import Image from 'next/image';
import SideMenu from "./SideMenu";

interface SideLeftProps {
  collapsed: boolean;
}

function SideLeft({ collapsed }: SideLeftProps) {
  return (
    <div className={`sidebar_left ${collapsed ? 'collapsed' : ''}`}>
      <div className="max-w-46 mx-auto">
        <a href="/dashboard" className="logo">
        <Image
          src="/assets/images-dashboard/logo/Dadu_Fresh_Logo 1.png"
          alt="logo"
          width={100}
          height={32}
        />
      </a>
      </div>
      <SideMenu />
    </div>
  );
}

export default SideLeft;