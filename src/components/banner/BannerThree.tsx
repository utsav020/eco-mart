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
  const [clicked, setClicked] = useState(false); // NEW STATE
  const router = useRouter();

  const handleShopClick = () => {
    setClicked(true);           // BUTTON ACTIVE
    router.push("/shop");
  };

  const buttonClasses = `
    cursor-pointer hover:bg-[#A3C526] hover:text-white flex items-center justify-center
    w-[180px] md:w-[207px] h-[55px] md:h-[62px]
    border border-[#CDCBC0] transition-all

    ${clicked ? "bg-[#A3C526] text-white" : "bg-transparent text-black"}
  `;

  return (
    <div className="relative w-full 2xl:mt-[140px] mt-[110px] md:mt-[150px] max-w-[1920px] mx-auto h-[90vh] md:h-[120vh] lg:h-[130vh] xl:h-[165vh] 2xl:h-[1027px] overflow-hidden bg-white">
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
        {/* SLIDE 1 */}
        <SwiperSlide>
          <div
            className="w-full h-full flex items-center bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/banner/banner-2.png')" }}
          >
            <div className="px-6 md:px-16 lg:px-28 max-w-[900px]">

              <div className="lg:w-[760px]">
                <p className="text-[#2D2D2D] text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight mb-4">
                  Carefully Selected Beans Pure Nutrition
                  <span className="text-[#A3C526]"> In Every Bite.</span>
                </p>
              </div>

              <p className="text-[#575757] text-sm sm:text-base md:text-[20px] max-w-[750px] mb-8">
                Pure, natural, and packed with goodness—that’s the power of
                organic beans!
              </p>

              {/* UPDATED BUTTON */}
              <div onClick={handleShopClick} className={buttonClasses}>
                <span className="text-[14px]">Explore More</span>
                <i className="fa-light fa-arrow-right ml-3 text-[18px]"></i>
              </div>

              {/* PAGINATION */}
              <div className="absolute bottom-17 md:bottom-30 left-1/2 transform -translate-x-1/2 w-[180px] md:w-[220px] flex justify-between">
                <div className={`h-[5px] w-[45%] ${activeIndex === 0 ? "bg-[#A3C526]" : "bg-black/30"}`}></div>
                <div className={`h-[5px] w-[45%] ${activeIndex === 1 ? "bg-[#A3C526]" : "bg-black/30"}`}></div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 2 */}
        <SwiperSlide>
          <div
            className="w-full h-full flex items-center bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
          >
            <div className="px-6 md:px-16 lg:px-28 max-w-[900px]">

              <div className="lg:w-[760px]">
                <p className="text-[#2D2D2D] text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-bold leading-tight mb-4">
                  Carefully Selected Beans Pure Nutrition
                  <span className="text-[#A3C526]"> In Every Bite.</span>
                </p>
              </div>

              <p className="text-[#575757] text-sm sm:text-base md:text-[20px] max-w-[750px] mb-8">
                Pure, natural, and packed with goodness—that’s the power of
                organic beans!
              </p>

              {/* UPDATED BUTTON */}
              <div onClick={handleShopClick} className={buttonClasses}>
                <span className="text-[14px]">Explore More</span>
                <i className="fa-light fa-arrow-right ml-3 text-[18px]"></i>
              </div>

              {/* PAGINATION */}
              <div className="absolute bottom-17 md:bottom-31 left-1/2 transform -translate-x-1/2 w-[180px] md:w-[220px] flex justify-between">
                <div className={`h-[5px] w-[45%] ${activeIndex === 0 ? "bg-[#A3C526]" : "bg-black/30"}`}></div>
                <div className={`h-[5px] w-[45%] ${activeIndex === 1 ? "bg-[#A3C526]" : "bg-black/30"}`}></div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerThreeSwiper;
