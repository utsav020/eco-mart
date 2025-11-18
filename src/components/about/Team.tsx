"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-auto mx-auto px-4 relative">
       <div className="ml-[95px]">
         {/* Header */}
        <p className="text-[35px] md:text-[35px] font-bold text-[#2D2D2D] mb-2">
          What Our Customer Say
        </p>
        <p className="text-[#2D2D2D] text-[30px] mb-10">
          Naturally Grown, Carefully Selected Products
        </p>
       </div>

        {/* Navigation Buttons */}
        <div className="w-[50px] h-[50px] flex items-center justify-center absolute left-2 md:left-186 top-1/2 -translate-y-1/2 z-30 bg-gray-400 rounded-full text-white p-3 transition-all">
          <button onClick={() => swiperRef.current?.slidePrev()} className="">
            <ArrowLeft className="w-10 h-10" />
          </button>
        </div>

        <div className="absolute flex items-center justify-center right-2 md:right-180 w-[50px] h-[50px] top-1/2 -translate-y-1/2 z-30 bg-gray-400 text-white p-3 rounded-full shadow-md transition-all">
          <button onClick={() => swiperRef.current?.slideNext()} className="">
            <ArrowRight className="w-10 h-10" />
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1.2}
          centeredSlides={true}
          spaceBetween={40}
          loop={true}
          speed={800}
          className="mt-10"
          breakpoints={{
            768: { slidesPerView: 1.5, spaceBetween: 60 },
            1024: { slidesPerView: 2.2, spaceBetween: 80 },
          }}
        >
          {testimonials.map((t) => (
            <SwiperSlide className="" key={t.id}>
              <div className="h-[520px]">
                <div className="w-[781px] flex h-[490px] bg-white shadow-xl rounded-[30px]">
                  <div className="w-[432px] pl-[48px] pt-[56px] max-w-[432px] h-[490px]">
                    <div className="h-[30px] w-[30px]">
                      <p className="text-[70px] text-[#F39C33]">“</p>
                    </div>

                    <div className="w-[336px] mt-[40px] h-[243px]">
                      <p className="text-[20px] font-medium">{t.text}</p>
                    </div>

                    <div className="w-[336px] h-[38px]">
                      <p className="text-[16px] font-bold">
                        {t.name} <br />
                        <span className="text-[14px] font-semibold">
                          {t.role}, {t.company}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-[349px] h-[490px] rounded-r-[30px] overflow-hidden">
                    {/* Image Section  */}
                    <div className="">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
  