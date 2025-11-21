"use client";

import React, { useState } from "react";
import BlogGridMain from "./BlogGridMain";
import Posts from "@/data/Posts.json";

import FooterTwo from "@/components/footer/FooterTwo";
// import HeaderOne from "@/components/header/HeaderFour";
import HeaderThree from "@/components/header/HeaderThree";

interface PostType {
  category?: string;
  slug: string;
  image: string;
  title?: string;
  author?: string;
  publishedDate?: string;
}

export default function BlogGridPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const totalPages = Math.ceil(Posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = Posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="text-gray-900">
      {/* Header */}
      <HeaderThree />

      {/* Breadcrumb */}
      <div className="py-6 mt-[130px]">
        <div className="max-w-[1430px] px-5 2xl:px-0 mx-auto flex items-center text-[20px] text-gray-600">
          <a href="/" className="hover:text-green-700 transition">
            Home
          </a>
          <span className="mx-2 text-gray-400">{"/"}</span>
          <span className="font-semibold text-gray-800">Blog Grid</span>
        </div>
      </div>

      {/* Hero Banner Section - 1 */}
      <section className="relative w-full max-w-[1430px] mx-auto px-4 md:px-6 lg:px-8 2xl:px-0 mb-12">
        {/* Background Image */}
        <div className="overflow-hidden rounded-[15px]">
          <img
            src="/assets/images/blog/Blog-1.png"
            alt="Blog Banner"
            className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[480px] object-cover rounded-[15px]"
          />
        </div>

        {/* Floating Card */}
        <div className="md:absolute md:right-0 mt-[30px] md:bottom-0 transform md:-translate-x-6 md:translate-y-1/2 w-full sm:w-[80%] h-[460px] md:h-[342px] lg:h-[332px] md:w-[70%] lg:w-[80%] xl:w-[1032px] bg-white shadow-md rounded-[15px] px-6 sm:px-8 md:px-10">
          <div className="xl:w-[948px] h-[234px] mx-auto mt-6 lg:mt-[49px]">
            <div className="w-full h-[18px] text-[#999999] text-[12px] font-medium leading-[150%] flex justify-end items-center">
              <p className="w-[105px]">13 March 2023</p>
            </div>
            <p className="text-[20px] leading-[31.99px] sm:text-3xl md:text-4xl lg:text-[20px] pt-[25px] font-bold text-[#333333] mb-2">
              How Dadu Fresh Ensures Quality in Every Organic Product
            </p>
            <div className="lg:w-[756px] h-[230px] md:h-[140px] lg:h-[95px] text-[16px] leading-[150%] mt-5 text-[#666666]">
              <p>
                At Dadu Fresh, we believe that food should nourish not only the
                body but also the planet. That's why every product we offer is
                more than just organic—it's a promise of purity, sustainability,
                and uncompromising quality. In a market flooded with labels and
                claims, we stand out by ensuring that our organic products meet
                the highest standards from farm to fork.
              </p>
            </div>
            <div className="w-[110px] h-[27px] text-[18px] font-bold leading-[150%] underline mt-5 text-[#7C4EE4]">
              <button className="underline text-[#7C4EE4]">Read More...</button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner Section - 2 */}
      <section className="relative w-full md:mt-[300px] max-w-[1430px] mx-auto px-4 2xl:px-0 md:px-6 lg:px-8 mb-12">
        {/* Background Image */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/assets/images/blog/Blog-2.png"
            alt="Blog Banner"
            className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[480px] object-cover rounded-[15px]"
          />
        </div>

        {/* Floating Card */}
        <div className="md:absolute md:right-0 mt-[30px] md:bottom-0 transform md:-translate-x-6 md:translate-y-1/2 w-full sm:w-[80%] h-[460px] md:h-[342px] lg:h-[332px] md:w-[70%] lg:w-[80%] xl:w-[1032px] bg-white shadow-md rounded-[15px] px-6 sm:px-8 md:px-10">
          <div className="xl:w-[948px] h-[234px] mx-auto mt-6 lg:mt-[49px]">
            <div className="w-full h-[18px] text-[#999999] text-[12px] font-medium leading-[150%] flex justify-end items-center">
              <p className="w-[105px]">13 March 2023</p>
            </div>
            <p className="text-[20px] leading-[31.99px] sm:text-3xl md:text-4xl lg:text-[20px] pt-[25px] font-bold text-[#333333] mb-2">
              How Dadu Fresh Ensures Quality in Every Organic Product
            </p>
            <div className="lg:w-[756px] h-[230px] md:h-[140px] lg:h-[95px] text-[16px] leading-[150%] mt-5 text-[#666666]">
              <p>
                At Dadu Fresh, we believe that food should nourish not only the
                body but also the planet. That's why every product we offer is
                more than just organic—it's a promise of purity, sustainability,
                and uncompromising quality. In a market flooded with labels and
                claims, we stand out by ensuring that our organic products meet
                the highest standards from farm to fork.
              </p>
            </div>
            <div className="w-[110px] h-[27px] text-[18px] font-bold leading-[150%] underline mt-5 text-[#7C4EE4]">
              <button className="underline text-[#7C4EE4]">Read More...</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-[300px]">
        <FooterTwo />
      </div>
    </div>
  );
}
