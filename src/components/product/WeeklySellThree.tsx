// components/AboutPage.tsx
import React from "react";

const AboutPage: React.FC = () => {
  const features = [
    {
      title: "Superme Beans",
      description: "Beans that provides great taste",
      image: "Supreme.png",
    },
    {
      title: "High Quality",
      description: "We provide the highest quality",
      image: "Quality.png",
    },
    {
      title: "Extraordinary",
      description: "Organic like you have never tasted",
      image: "Extraordinary.png",
    },
    {
      title: "Affordable Price",
      description: "Our Products prices are easy to afford",
      image: "Affordable-price.png",
    },
  ];

  return (
    <div className="max-w-[1920px] mx-auto m-0 p-0 flex">
      <div className="hidden lg:block w-[300px] mt-0">
        <img
          src={"/assets/images/why/Bg-1.png"}
          alt=""
          className="w-[500px] h-[500px]"
        />
      </div>
      <div className="mx-auto max-w-[1430px] mt-[100px]">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-[5px] md:text-6xl font-bold text-[#077D40] mb-6">
            Why are we different?
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 w-full justify-between lg:w-[600px] xl:w-[1130px] max-w-[1380px] gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#F5F5F5] h-[284px] w-[280px] rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 flex items-center justify-center transition-transform duration-300">
                <img
                  src={`/assets/images/why/${feature.image}`}
                  alt={feature.title}
                />
              </div>
              <h3 className="text-[20px] font-bold text-[#000000] mb-3">
                {feature.title}
              </h3>
              <div className="w-full flex items-center justify-center">
                <p className="text-[#707070] flex items-center justify-between text-[20px] w-[214px] h-[54px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block mt-[220px] h-[200px] w-[300px] ">
        <img
          src={"/assets/images/why/Bg-2.png"}
          alt=""
          className="w-[500px] h-[500px] overflow-hidden"
        />
      </div>
    </div>
  );
};

export default AboutPage;
