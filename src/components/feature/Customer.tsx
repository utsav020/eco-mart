"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Marketing Director",
    company: "Creative Co.",
    text: "We've had the pleasure of partnering with Zennial Pro through their subsidiary Smart Recruitz, and it’s been a game-changer for our recruitment. We couldn’t be happier with the results.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Emily Patel",
    role: "Talent Acquisition Manager",
    company: "GlobalTech Solutions",
    text: "Zennial Pro has transformed how we approach hiring. Their team is professional, proactive, and truly understands our needs. Highly recommended!",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Liam Brown",
    role: "HR Lead",
    company: "FutureWorks Inc.",
    text: "Working with Zennial Pro made recruitment seamless and efficient. Their Smart Recruitz platform saved us countless hours and delivered excellent candidates.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Sophia Johnson",
    role: "Operations Head",
    company: "InnovateX",
    text: "The professionalism and quality provided by Zennial Pro are unmatched. Their recruitment solutions helped us scale effortlessly.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Customer() {
  const swiperRef = useRef<any>(null);

  return (
    <section className="relative py-16 overflow-hidden px-4">
      <div className="max-w-[1430px] mx-auto relative">
        {/* ✅ HEADER */}
        <div className="text-center md:text-left mb-12">
          <p className="text-[26px] md:text-[35px] font-bold text-[#2D2D2D] mb-2">
            What Our Customer Say
          </p>
          <p className="text-[#2D2D2D] text-[18px] md:text-[24px]">
            Naturally Grown, Carefully Selected Products
          </p>
        </div>

        {/* ✅ LEFT ARROW */}
        <div className="hidden md:flex w-[45px] h-[45px] items-center justify-center absolute xl:left-78.5 left-0 md:left-20 lg:left-52 2xl:left-80 top-90 -translate-y-1/2 z-30 bg-gray-400 rounded-full text-white">
          <button onClick={() => swiperRef.current?.slidePrev()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* ✅ RIGHT ARROW */}
        <div className="hidden md:flex w-[45px] h-[45px] items-center justify-center absolute xl:right-78.5 right-0 md:right-20 lg:right-50 2xl:right-80 top-90 -translate-y-1/2 z-30 bg-gray-400 text-white rounded-full">
          <button onClick={() => swiperRef.current?.slideNext()}>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* ✅ SWIPER */}
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={20}
          loop={true}
          speed={800}
          className="mt-10"
          breakpoints={{
            640: { slidesPerView: 1.1 },
            768: { slidesPerView: 1.5, spaceBetween: 60 },
            1024: { slidesPerView: 2, spaceBetween: 60 },
          }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-3xl overflow-hidden max-w-full mx-auto">
                
                {/* ✅ TEXT SECTION */}
                <div className="w-full md:w-[60%] p-6 md:p-10 flex flex-col justify-between">
                  <p className="text-[50px] md:text-[60px] text-[#F39C33] leading-none">“</p>

                  <p className="text-[16px] md:text-[18px] font-medium leading-relaxed mt-4">
                    {t.text}
                  </p>

                  <div className="mt-6">
                    <p className="text-[16px] font-bold">{t.name}</p>
                    <p className="text-[14px] font-semibold text-gray-600">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>

                {/* ✅ IMAGE SECTION */}
                <div className="w-full md:w-[40%] h-[260px] md:h-auto">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ✅ MOBILE NAV BUTTONS */}
        <div className="flex md:hidden justify-center gap-6 mt-10">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
