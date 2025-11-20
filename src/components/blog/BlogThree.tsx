"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import rajma from "../../../public/assets/images/products/Channa-daal.png";
import chawli from "../../../public/assets/images/products/Channa-daal.png";
import moong from "../../../public/assets/images/products/Channa-daal.png";
import chanaDal from "../../../public/assets/images/products/Channa-daal.png";

const ProductCirclePage = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [centerImage, setCenterImage] = useState(rajma);

  // ⚙️ Choose animation timing style
  const animationStyle = "A"; // or "B"

  const timings =
    animationStyle === "A"
      ? { phase1: 2000, phase2: 2000, phase3: 3000, changeDelay: 0 }
      : { phase1: 3000, phase2: 3000, phase3: 4000, changeDelay: 1500 };

  useEffect(() => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const sequence = async () => {
      // 🟢 Phase 1: Left↔Right swap
      setAnimationPhase(1);
      setCenterImage(chawli);
      await delay(timings.phase1);

      // 🟢 Phase 2: Top↔Bottom swap
      setAnimationPhase(2);
      setCenterImage(moong);
      await delay(timings.phase2);

      // 🟢 Phase 3: All together swap
      setAnimationPhase(3);
      setCenterImage(chanaDal);
      await delay(timings.phase3);

      // 🔁 Reset to original positions
      setAnimationPhase(0);
      setCenterImage(rajma);
      await delay(1000);
      sequence(); // loop
    };

    sequence();
  }, []);

  // Animation class mapping
  const getLeftImageClass = () => {
    switch (animationPhase) {
      case 1:
        return "animate-leftToRightSwap";
      case 3:
        return "animate-leftToRightSwapPhase3";
      default:
        return "";
    }
  };

  const getRightImageClass = () => {
    switch (animationPhase) {
      case 1:
        return "animate-rightToLeftSwap";
      case 3:
        return "animate-rightToLeftSwapPhase3";
      default:
        return "";
    }
  };

  const getTopImageClass = () => {
    switch (animationPhase) {
      case 2:
        return "animate-topToBottomSwap";
      case 3:
        return "animate-topToBottomSwapPhase3";
      default:
        return "";
    }
  };

  const getBottomImageClass = () => {
    switch (animationPhase) {
      case 2:
        return "animate-bottomToTopSwap";
      case 3:
        return "animate-bottomToTopSwapPhase3";
      default:
        return "";
    }
  };

  const getCenterImageClass = () =>
    animationPhase >= 1 ? "animate-pulseScale" : "";

  return (
    <div className="2xl:flex hidden flex-col max-w-[1430px] border-2 mt-[100px] mx-auto max-h-[1125px] items-center justify-center min-h-screen bg-white p-8">
      {/* Circle Layout */}
      <div className="relative w-[400px] h-[400px] md:w-[650px] md:h-[650px] flex items-center justify-center">
        {/* Central Product */}
        <div className="absolute flex flex-col items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center bg-gray-300 md:w-[280px] -mt-10 md:h-[280px] transition-all duration-500 ${getCenterImageClass()}`}
          >
            <Image
              src={centerImage}
              alt="Center"
              className="w-[250px] border-2 mt-[25px] h-[250px]"
              objectFit="contain"
            />
          </div>
        </div>

        {/* Outer Circle Line */}
        <div className="absolute w-full h-full rounded-full border-2 border-gray-200"></div>

        {/* Top */}
        <div
          className={`absolute -top-50 left-1/2 transform -translate-x-1/2 flex flex-col items-center ${getTopImageClass()}`}
        >
          <div className="w-24 h-24 md:w-[215px] md:h-[215px]">
            <Image src={chawli} alt="Chawli" objectFit="contain" />
          </div>
        </div>

        {/* Right */}
        <div
          className={`absolute -right-50 top-1/2 transform -translate-y-1/2 flex flex-col items-center ${getRightImageClass()}`}
        >
          <div className="w-24 h-24 md:w-[215px] md:h-[215px]">
            <Image src={chanaDal} alt="Chana Dal" objectFit="contain" />
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`absolute -bottom-40 left-1/2 transform -translate-x-1/2 flex flex-col items-center ${getBottomImageClass()}`}
        >
          <div className="w-24 h-24 md:w-[215px] md:h-[215px]">
            <Image src={moong} alt="Moong" objectFit="contain" />
          </div>
        </div>

        {/* Left */}
        <div
          className={`absolute -left-40 top-1/2 transform -translate-y-1/2 flex flex-col items-center ${getLeftImageClass()}`}
        >
          <div className="w-24 h-24 md:w-[215px] md:h-[215px]">
            <Image src={rajma} alt="Rajma" objectFit="contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCirclePage;
