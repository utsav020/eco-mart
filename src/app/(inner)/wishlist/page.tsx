"use client";
import CartMain from "./CartMain";
import HeaderThree from "@/components/header/HeaderThree";
import FooterTwo from "@/components/footer/FooterTwo";
import { useRouter } from "next/navigation"; // ✅ Correct router

export default function Home() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <div className="wishlist-page min-h-screen bg-white">
      {/* Header */}
      <HeaderThree />

      {/* Breadcrumb */}
      <div className="mt-[50px] px-4">
        <div className="max-w-[1430px] mx-auto flex items-center gap-2 text-gray-700 text-[20px]">

          {/* Home */}
          <div
            onClick={handleHomeClick}
            className="cursor-pointer text-[#000000] hover:text-[#018F45] transition"
          >
            Home
          </div>

          {/* Slash */}
          <span className="text-gray-500">/</span>

          {/* Current Page */}
          <span className="text-black font-medium">Wishlist</span>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-[1730px] mx-auto mt-[80px] px-4">
        <CartMain />
      </div>

      {/* Footer */}
      <div className="mt-[150px]">
        <FooterTwo />
      </div>
    </div>
  );
}
