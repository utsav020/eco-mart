"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { useRouter } from "next/navigation";

const BannerThreeSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const handleShopClick = () => {
    router.push("/shop");
  };

  return (
    <div className="relative w-full max-w-[1920px] mx-auto h-[75vh] md:h-[90vh] lg:h-[1027px] overflow-hidden bg-white">
      <Swiper
        modules={[Navigation, EffectFade, Autoplay]}
        slidesPerView={1}
        loop
        speed={800}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {/* ======================================
              SLIDE 1
        ======================================= */}
        <SwiperSlide>
          <div
            className="w-full h-full flex items-center"
            style={{
              backgroundImage: "url('/assets/images/banner/banner-2.png')",
            }}
          >
            <div className="px-6 md:px-16 lg:px-28 max-w-[900px]">
              <div className="w-full">
                <div className="w-[760px]">
                  <p className="text-[#2D2D2D] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight mb-4">
                    Carefully Selected Beans Pure Nutrition
                    <span className="text-[#A3C526]"> In Every Bite.</span>
                  </p>
                </div>

                <p className="text-[#575757] text-sm sm:text-base md:text-[20px] max-w-[750px] mb-8">
                  Pure, natural, and packed with goodness—that’s the power of
                  organic beans! Fuel your day the natural way with organic
                  beans!
                </p>
              </div>

              <div className="group">
                <div
                  onClick={handleShopClick}
                  className="cursor-pointer hover:bg-[#A3C526] hover:text-white flex items-center justify-center w-[180px] md:w-[207px] h-[55px] md:h-[62px] border border-[#CDCBC0] transition-all"
                >
                  <span className="text-[14px]">Explore More</span>
                  <i className="fa-light fa-arrow-right ml-3 text-[18px]"></i>
                </div>
              </div>

              <div className="absolute bottom-36 md:bottom-50 left-1/2 transform -translate-x-1/5 w-[180px] md:w-[220px] flex justify-between">
                <div
                  className={`h-[5px] w-[45%] transition-all duration-500 ${
                    activeIndex === 0 ? "bg-[#A3C526]" : "bg-black/30"
                  }`}
                ></div>

                <div
                  className={`h-[5px] w-[45%] transition-all duration-500 ${
                    activeIndex === 1 ? "bg-[#A3C526]" : "bg-black/30"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* ======================================
              SLIDE 2
        ======================================= */}
        <SwiperSlide>
          <div
            className="w-full h-full flex items-center"
            style={{
              backgroundImage: "url('/assets/images/banner/banner-1.png')",
            }}
          >
            <div className="px-6 md:px-16 lg:px-28 max-w-[900px]">
              <div className="">
                <div className="w-[760px]">
                  <p className="text-[#2D2D2D] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight mb-4">
                Carefully Selected Beans Pure Nutrition
                <span className="text-[#A3C526]"> In Every Bite.</span>
              </p>
                </div>

              <p className="text-[#575757] text-sm sm:text-base md:text-[20px] max-w-[750px] mb-8">
                Pure, natural, and packed with goodness—that’s the power of
                organic beans! Fuel your day the natural way with organic beans!
              </p>
              </div>

              <div className="group">
                <div
                  onClick={handleShopClick}
                  className="cursor-pointer hover:bg-[#A3C526] hover:text-white flex items-center justify-center w-[180px] md:w-[207px] h-[55px] md:h-[62px] border border-[#CDCBC0] transition-all"
                >
                  <span className="text-[14px]">Explore More</span>
                  <i className="fa-light fa-arrow-right ml-3 text-[18px]"></i>
                </div>
              </div>

              <div className="absolute bottom-36 md:bottom-50 left-1/2 transform -translate-x-1/5 w-[180px] md:w-[220px] flex justify-between">
                <div
                  className={`h-[5px] w-[45%] transition-all duration-500 ${
                    activeIndex === 0 ? "bg-[#A3C526]" : "bg-black/30"
                  }`}
                ></div>

                <div
                  className={`h-[5px] w-[45%] transition-all duration-500 ${
                    activeIndex === 1 ? "bg-[#A3C526]" : "bg-black/30"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* ======================================
             CUSTOM PAGINATION LINES
      ======================================= */}
    </div>
  );
};

export default BannerThreeSwiper;
