"use client";

import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function FooterTwo() {
  return (
    <footer className="bg-[#E5E6E6]">
      <div className="max-w-[1730px] mx-auto justify-between px-6 py-12 flex">
        {/* Logo + Description */}
        <div className="w-[352px]">
          <div className="flex items-center space-x-2 mb-4">
            <img
              src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
              alt="Dadu Fresh Logo"
              className="w-[86.54] h-[72.56px] object-contain"
            />
          </div>
          <div className="">
            <p className="text-[18px] font-bold leading-relaxed">
              Dadu Fresh Organic Products is on a mission to power your journey
              towards a healthier lifestyle because we believe true wellness
              begins with freshness.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="decoration-none ">
          <h3 className="text-[#077D40] font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-green-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Information */}
        <div className="w-[200px] text-[18px]">
          <h3 className="text-[#077D40] font-semibold mb-4">Information</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-green-600">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600">
                Refund Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="w-[362px]">
          <div className="">
            <h3 className="text-[#077D40] font-semibold mb-4">Contact Us</h3>
            <p className="text-[18px] font-bold mb-1">Your Email</p>
            <div className="flex mb-4 border rounded-r-2xl border-[#077D40]">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-l-md border border-green-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="bg-[#077D40] w-[169px] flex items-center justify-center h-[50px] rounded-r-2xl">
                <button className="bg-green-700 text-white transition">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 mb-6">
              <a
                href="#"
                className="bg-[#018F45] w-5 flex items-center justify-center h-[20.12px] text-white hover:text-green-800"
              >
                <Facebook size={16} className="" />
              </a>
              <a
                href="#"
                className="bg-[#018F45] w-5 flex items-center justify-center h-[20.12px] text-white hover:text-green-800"
              >
                <Instagram size={16} className="" />
              </a>
              <a
                href="#"
                className="bg-[#018F45] w-5 flex items-center justify-center h-[20.12px] text-white hover:text-green-800"
              >
                <Twitter size={16} className="" />
              </a>
              <a
                href="#"
                className="bg-[#018F45] w-5 flex items-center justify-center h-[20.12px] text-white hover:text-green-800"
              >
                <Linkedin size={16} className="" />
              </a>
              <a
                href="#"
                className="bg-[#018F45] w-5 flex items-center justify-center h-[20.12px] text-white hover:text-green-800"
              >
                <Youtube size={16} className="" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3 w-[245.4px] h-[147px] text-[18px]">
          <div className="flex items-start space-x-4">
            <MapPin size={20} className="text-green-600 mt-2" />
            <span>8819 Ohio St. South Gate, CA 90280</span>
          </div>
          <div className="flex items-start space-x-4">
            <div className="">
              <Mail size={16} className="text-green-600 mt-2" />
            </div>
            <div className="">
              <a href="mailto:Ourstudio@hello.com">Ourstudio@hello.com</a>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone size={16} className="text-green-600 mt-2" />
            <span>+1 386-688-3295</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#077D40] mt-8">
        <div className="ml-[65px] px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="text-[16px] text-[#283646]">© 2025 Dadu Fresh. Powered by Shopify</p>
          {/* <div className="flex items-center space-x-2">
            <span>Payment Accepts:</span>
            <img
              src="/images/payment.png"
              alt="payment methods"
              className="h-6 object-contain"
            />
          </div> */}
        </div>
      </div>
    </footer>
  );
}
