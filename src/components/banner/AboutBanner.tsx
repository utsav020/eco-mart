import React from "react";
import { ArrowLeft, Check } from "lucide-react";

export default function AboutBanner() {
  return (
    <>
      <div className="max-w-[1430px] border-2 w-full mx-auto">
        {/* Intro Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start xl:items-center px-6 xl:px-0">
          <div className="w-full lg:w-[957px]">
            <img
              src="/assets/images/about/about.png"
              alt="About DaduFresh"
              className="w-[957px] h-[613px] border-2"
            />
          </div>

          <div className="mt-6 lg:mt-0 w-full lg:ml-8 max-w-[712px]">
            <p className="leading-[56px] font-bold text-[#077D40] text-[28px] border-2 md:text-[35px]">
              Kalavad FPO – DaduFresh
            </p>

            <p className="text-[20px] mt-4 leading-[38px]">
              At{" "}
              <span className="text-[#077D40] font-bold">
                Kalavad Farmer Producer Company Limited
              </span>
              , we are more than just an agricultural collective – we are a
              movement dedicated to revolutionizing India's farming landscape
              through sustainable, organic practices. Founded and operated by a
              passionate group of 10 directors and over{" "}
              <span className="text-[#077D40] font-bold">
                300 farmer members in Gujarat,
              </span>{" "}
              we have built our brand DaduFresh on the principles of purity,
              fairness, and environmental stewardship.
            </p>

            <p className="mt-6 text-[20px] leading-[38px]">
              Our journey began with a{" "}
              <span className="text-[#077D40] font-bold">
                simple yet powerful vision:
              </span>{" "}
              to create a direct connection between India's hardworking farmers
              and health-conscious consumers. We recognized that while farmers
              struggle with unfair prices and chemical-dependent farming,
              families across the nation face the consequences of adulterated,
              nutrient-deficient food. DaduFresh was born to bridge this gap,
              offering authentic, chemical-free whole grains, traditional
              spices, and natural fruit products that are as good for the
              consumer as they are for the farmer.
            </p>
          </div>
        </div>

        {/* Our Farmer */}
        <div className="flex flex-col xl:flex-row justify-between items-center bg-[#077D40] mt-[100px] p-6 lg:p-0">
          <div className="text-white max-w-[921px] ml-[11px] p-4 lg:pl-[81px]">
            <p className="text-[35px] font-semibold mb-4">Our Farmer !</p>
            <p className="text-[20px] leading-[38px]">
              Beyond commerce, we are building a community — a movement rooted
              in trust, transparency, and togetherness. Our farmer members take
              pride in growing food that nourishes the nation, while our
              customers enjoy the satisfaction of supporting sustainable
              agriculture and conscious living. Every purchase of DaduFresh
              products contributes to a healthier India – one where farmers
              prosper, consumers thrive, and the environment is protected for
              future generations.
            </p>
          </div>

          <img
            src="/assets/images/about/Farmer.png"
            alt="Our Farmer"
            className="w-[584px] h-[500px] object-cover"
          />
        </div>

        {/* Our Purpose and Promise */}
        <div className="mt-[100px] border-2">
          <p className="text-[#077D40] px-[20px] text-[35px] font-bold text-center leading-[76.5px]">
            Our Purpose and Promise
          </p>

          <div className="flex flex-col xl:flex-row items-start mt-10">
            {/* Left Text Section */}
            <div className="w-full px-[20px] justify-between lg:w-[640px]">
              {/* Vision */}
              <div>
                <div className="bg-[#A3C526] md:w-[218px] h-[60px] flex items-center justify-center text-white rounded-md">
                  <p className="text-[28px] font-bold">Our Vision</p>
                </div>

                <p className="text-[20px] text-[#077D40] mt-4 mb-2 leading-[38px]">
                  “Return to Roots – A Toxin-Free India!”
                </p>

                {[
                  {
                    title: "For Farmers",
                    desc: "A self-reliant community growing premium organic crops with pride.",
                  },
                  {
                    title: "For Families",
                    desc: "Every kitchen stocked with DaduFresh’s purity for healthier generations.",
                  },
                  {
                    title: "For Bharat",
                    desc: "A future where organic = affordable, accessible, and aspirational.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 w-[320px] md:w-[450px] mt-3">
                    <div className="bg-[#077D40] w-[25px] h-[25px] rounded-full flex items-center justify-center mt-1">
                      <Check className="text-white" />
                    </div>
                    <p className="text-[20px] text-[#077D40] leading-[32px]">
                      <span className="font-bold">{item.title}</span> –{" "}
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mission */}
              <div className="mt-10">
                <div className="bg-[#A3C526] md:w-[243px] h-[60px] flex items-center justify-center text-white rounded-md">
                  <p className="text-[28px] font-bold">Our Mission</p>
                </div>

                {[
                  {
                    title: "Empower Organic Farmers –",
                    desc: "Train and support farmers to shift to chemical-free farming. Guarantee fair prices by cutting middlemen, ensuring profits go directly to growers. Convert 100+ farmers yearly to organic practices.",
                  },
                  {
                    title: "Revitalize India’s Health –",
                    desc: "Fight lifestyle diseases with authentic, unadulterated whole grains and masalas. Deliver farm-fresh organic staples like millets, pulses, spices, and more to homes nationwide.",
                  },
                  {
                    title: "Preserve Tradition –",
                    desc: "Promote desi superfoods and age-old recipes for modern wellness.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 w-[340px] md:w-[500px] mt-4">
                    <div className="bg-[#077D40] w-[25px] h-[25px] rounded-full flex items-center justify-center mt-1">
                      <Check className="text-white" />
                    </div>
                    <p className="text-[20px] text-[#077D40] leading-[38px]">
                      <span className="font-bold">{item.title}</span><br></br> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Section (Millets, Dals, Beans, Whole Corn) */}
            <div className="max-w-[950.99px] mx-auto md:w-[750px] lg:w-[810px] border-2 w-[360px] mt-[100px] 2xl:h-[1088px]">
              <div className="flex gap-[10px] md:gap-[20px] lg:gap-[30px]">
                {/* Image one */}
                <div className="2xl:w-[262px]">
                  <div className="md:mt-[69px] hidden justify-between md:gap-[10px] md:flex h-[77px] md:-mr-8 2xl:w-[287.99px] text-end">
                    <div>
                      <p className="text-[#A3C526] md:text-[30px] xl:text-[35px] font-bold">Millets</p>
                    </div>

                    <div className="md:mt-9">
                      <img src={"/assets/images/about/Arrow 3.png"} alt="" />
                    </div>
                  </div>

                  <div className="md:mt-[0] mt-[100px]">
                    <img src={"/assets/images/about/one.png"} alt="" className="2xl:w-[262px] 2xl:h-[529px] md:mt-[100px]" />
                  </div>

                  <div className="2xl:w-[101px] hidden md:block 2xl:h-[249px] xl:ml-[81px]">
                    <div className="flex justify-center">
                      <img src={"/assets/images/about/Arrow 1.png"} alt="" />
                    </div>

                    <div className="h-[77px] 2xl:mt-[15px] flex items-center justify-center">
                      <p className="text-[#A3C526] text-[30px] 2xl:text-[35px] font-bold">Beans</p>
                    </div>
                  </div>
                </div>
                
                {/* Image two */}
                <div className="2xl:w-[262px]">
                  <img src={"/assets/images/about/two.png"} alt="" className="2xl:w-[262px] 2xl:h-[529px] "/>
                  <img src={"/assets/images/about/four.png"} alt="" className="2xl:w-[262px] 2xl:h-[529px] mt-[0px] md:mt-[30px]" />
                </div>

                {/* Image three */}
                <div className="2xl:w-[262px]">
                  <div className="w-[75px] hidden md:block 2xl:h-[249px] md:ml-[85px] xl:ml-[95px]">
                    <div className="h-[77px]">
                      <p className="text-[#A3C526] text-[35px] font-bold">Dals</p>
                    </div>
                    <div className="md:flex hidden items-center justify-center 2xl:mt-[14px]">
                      <img src={"/assets/images/about/Arrow 2.png"} alt="" />
                    </div>
                  </div>

                  <div className="mt-[100px] md:mt-[0]">
                    <img src={"/assets/images/about/three.png"} alt="" className="2xl:w-[262px] 2xl:h-[529px]"/>
                  </div>

                  <div className="2xl:w-[296.99px] hidden md:-ml-8 2xl:-ml-9 h-[70px] md:gap-[20px] md:flex justify-between md:mt-[70px] lg:mt-[126px]">
                    <div className="flex items-center justify-center">
                      <img src={"/assets/images/about/Arrow 4.png"} alt="" />
                    </div>

                    <div className="h-[77px] lg:w-[125px] lg:leading-[35px]">
                      <p className="text-[#A3C526] md:text-[30px] 2xl:text-[35px] font-bold">Whole Corn</p>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
