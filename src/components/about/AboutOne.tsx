import React from "react";
import { Check } from "lucide-react";

export default function AboutFeatures() {
  const features = [
    {
      image: "M-back.png",
      title: "Money Back Guarantee",
      desc: "Shop with confidence! We offer a risk-free money back guarantee to ensure your complete satisfaction.",
    },
    {
      image: "Heigh Quality.png",
      title: "High Quality",
      desc: "We offer fast and free shipping across India. Shop now and get your order delivered without any hidden fees!",
    },
    {
      image: "A-Extraordinary.png",
      title: "Extraordinary",
      desc: "We’re here for you anytime. Our 24/7 customer support team is always ready to help you with your queries.",
    },
  ];

  return (
    <section className="max-w-[1430px] mx-auto px-6 py-[100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((item, i) => (
          <div
            key={i}
            className="flex flex-col h-[374px] w-[300px] max-w-[380px] mx-auto md:w-[380px] items-center bg-[#F5F5F5]"
          >
            <div className="w-[220px] mt-[77px] h-[139px]">
              <div className="w-[88px] h-[88px] flex items-center justify-center ml-[66px]">
                <img
                  src={`/assets/images/about/${item.image}`}
                  alt={item.title}
                  className="w-[61.6px] h-[70.4px] object-contain mx-auto"
                />
              </div>
              <div className="text-center w-[220px] mt-[17px]">
                <p className="text-[18px] font-bold">
                  {item.title}
                </p>
              </div>
            </div>

            <div className="text-[#00000080] text-[16px] font-bold leading-[100%] w-[214px] mt-[10px] h-[84px]">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
