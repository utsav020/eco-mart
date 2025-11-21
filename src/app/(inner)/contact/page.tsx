"use client";

import HeaderThree from "@/components/header/HeaderThree";
import { Mail, MapPin, Phone } from "lucide-react";
import FooterTwo from "@/components/footer/FooterTwo";

export default function Home() {
  return (
    <div className="flex flex-col max-w-[1920px] mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="">
        <HeaderThree />
      </div>

      {/* Breadcrumb */}
      <div className="md:px-5 mt-[130px]">
        <div className="py-6">
          <div className="max-w-[1430px] mx-auto flex items-center text-[20px] text-gray-600">
            <a href="/" className="hover:text-blue-600 transition">
              Home
            </a>
            <span className="mx-2 text-gray-400">{"/"}</span>
            <span className="font-semibold text-gray-800">Blog Grid</span>
          </div>
        </div>

        <div className="max-w-[1430px] xl:h-[1016px] w-full bg-[#F5F5F5] rounded-[15px] lg:mx-auto">
          <div className="xl:flex lg:items-center">
            <div className="lg:w-[783px] h-[1016px] bg-[#077D40] rounded-[15px]">
              <div className="md:w-[680px] lg:w-[730px] mx-auto">
                <div className="w-[684px] h-[128px] md:px-[0] lg:mt-[52px]">
                  <p className="text-[30px] h-[65px] text-white font-bold leading-[76.5px]">
                    Get In Touch
                  </p>
                  <p className="text-[#A7F3D0] h-[77px] text-[20px]">
                    We are here for you! How can we help?
                  </p>
                </div>

                {/* Phone */}
                <div className="md:w-[200px] w-[250px] px-[20px] md:px-[0] flex gap-[15px] h-[90px] mt-[25px]">
                  <div className="mt-[28px] text-[#A7F3D0]">
                    <Phone />
                  </div>
                  <div className="mt-[26px]">
                    <p className="text-white text-[20px] font-bold">
                      Mobile
                      <br />
                      <span className="text-white text-[20px]">
                        +91 1234567890
                      </span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="w-[200px] px-[20px] md:px-[0] flex gap-[15px] h-[90px] mt-[25px]">
                  <div className="text-[#A7F3D0] mt-[28px]">
                    <Mail />
                  </div>
                  <div className="mt-[26px]">
                    <p className="text-white text-[20px] font-bold">
                      Email
                      <br />
                      <span className="text-white text-[20px]">
                        info@example.com
                      </span>{" "}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="w-[566px] h-[90px] text-[20px] md:text-[20px] mt-[25px]">
                  <div className="flex gap-[15px] items-center">
                    <div className="text-[#A7F3D0] mt-[26px]">
                      <MapPin />
                    </div>
                    <div className="font-bold mt-[25px] text-white">
                      <p>Address</p>
                    </div>
                  </div>
                  <div className="text-[#A7F3D0] w-[300px] md:w-full ml-[33px] mt-[5px]">
                    <p>CSC KALAVAD FARMER PRODUCER COMPANY LTD.</p>
                  </div>
                </div>

                {/* Google Map */}
                <div className="px-[0px] lg:pt-[0] pt-[20px]">
                  <div className="lg:col-span-2 h-[400px] lg:h-[428px] max-w-[730px] mx-auto mt-[28px] w-full rounded-2xl overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14602.288851207937!2d90.47855065!3d23.798243149999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1716725338558!5m2!1sen!2sbd"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="max-w-[550px] px-[20px] w-full h-[1016px] mx-auto">
              <div>
                <div className="w-[267px] h-[65px] mt-[52px] text-[30px] font-bold flex items-end">
                  <p>Send a Message</p>
                </div>

                <form className="text-[20px] max-w-[550px] mx-auto">
                  {/* Name */}
                  <div className="h-[131px] mt-[15px]">
                    <label className="text-[20px] mt-[10px] font-semibold">
                      Name
                    </label>
                    <br />
                    <div className="bg-white flex items-center mt-[27px] text-[#00000080] border-[#7D7D7D] h-[60px] border rounded-[8px]">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-[500px] h-[50px] rounded-[8px] mt-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Mail */}
                  <div className="h-[131px] mt-[15px]">
                    <label className="text-[20px] font-semibold mt-[15px]">
                      Email
                    </label>
                    <br />
                    <div className="bg-white text-[20px] flex items-center mt-[27px] text-[#00000080] border-[#7D7D7D] h-[60px] border rounded-[8px]">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-[500px] h-[50px] rounded-[8px] mt-[10px] px-4 py-3"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="h-[131px] mt-[15px]">
                    <label className="text-[20px] font-semibold mt-[15px]">
                      Phone{" "}
                      <span className="text-[#00000080] text-[20px]">
                        (Optional)
                      </span>
                    </label>
                    <br />
                    <div className="bg-white flex items-center mt-[27px] text-[#00000080] border-[#7D7D7D] h-[60px] border rounded-[8px]">
                      <input
                        type="phone"
                        placeholder="Enter Your Number"
                        className="rounded-[8px] px-4"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="h-[328px] mt-[20px]">
                    <label className="text-[20px] font-semibold mt-[15px]">
                      Message
                    </label>
                    <br />
                    <div className="bg-white text-[20px] mt-[27px] text-[#00000080] border-[#7D7D7D] h-[186px] border rounded-[8px]">
                      <textarea
                        rows={5}
                        placeholder="Your Massage here....."
                        className="w-[500px] px-4 py-4 text-[20px]"
                      ></textarea>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="md:w-[550px] xl:w-full h-[60px] text-[20px] flex items-center justify-center mt-[17px] bg-[#077D40] rounded-[8px] text-white font-bold">
                    <button className="">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-[100px]">
        <FooterTwo />
      </div>
    </div>
  );
}
