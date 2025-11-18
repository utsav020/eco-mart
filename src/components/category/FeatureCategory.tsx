"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const FeaturedCategories = () => {
const router = useRouter();
  const handleShopClick = () => {
    router.push("/shop");
  };
  const categories = [
    { name: "Millets", image: "Catagory-1.png" },
    { name: "Beans", image: "Catagory-2.png" },
    { name: "Dals", image: "Catagory-3.png" },
    { name: "Whole Corn", image: "Catagory-4.png" },
    { name: "Rajma", image: "Catagory-5.png" },
  ];

  return (
    <div className="max-w-[1430px] mt-[100px] mx-auto">
      <div className="">
        <div className="md:flex justify-between item-center md:px-5">
          <div className="h-[129px] md:w-[613px] pl-5 md:p-0">
            <p className="font-bold text-[30px] lg:text-[35px]">
              Shop by Category <br />
              <span className="lg:text-[30px] text-[18px] font-normal">
                Naturally grown, carefully selected Products
              </span>
            </p>
          </div>
          <div className="group lg:mt-14 mt-5 ml-5">
            <div
              onClick={handleShopClick}
              className="cursor-pointer hover:bg-[#A3C526] hover:text-white flex items-center justify-center w-[207px] h-[62px] border border-[#CDCBC0]"
            >
              <div className="w-[127px] text-[14px]">View More</div>
              <div>
                <ArrowRight className="w-6 h-6 text-[20px] flex items-center justify-center" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5 mt-5 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="relative group max-w-[1430px] mx-auto overflow-hidden cursor-pointer"
            >
              <a href="">
                <img
                  src={`/assets/images/category/${cat.image}`}
                  alt={cat.name}
                  className="w-[331.78px] h-72 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />

                {/* Overlay with animation */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-[24px] font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    {cat.name}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
