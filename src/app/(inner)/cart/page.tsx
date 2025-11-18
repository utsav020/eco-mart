"use client";

import ShortService from "@/components/service/ShortService";
import CartMain from "./CartMain";
import FooterTwo from "@/components/footer/FooterTwo";
import HeaderThree from "@/components/header/HeaderThree";

export default function Home() {
  return (
    <div className="demo-one bg-white min-h-screen flex flex-col">
      {/* Header */}
      <HeaderThree />

      {/* Breadcrumb Section */}
      <div className="max-w-[1430px] mx-auto w-full px-4 mt-8">
        <nav className="flex items-center text-[20px] text-gray-700 gap-2 flex-wrap">
          {/* Home */}
          <span
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer hover:text-[#018F45] transition"
          >
            Home
          </span>

          {/* Arrow */}
          <i className="fa-regular fa-chevron-right ml-3 text-gray-500"></i>

          {/* Current Page */}
          <span className="text-[#018F45] font-medium ml-3">My Cart</span>
        </nav>
      </div>

      {/* Cart Main Section */}
      <div className="max-w-[1730px] mx-auto w-full px-4 mt-10">
        <CartMain />
      </div>

      {/* Footer */}
      <div className="mt-20">
        <FooterTwo />
      </div>
    </div>
  );
}
