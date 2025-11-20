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
      {/* MAIN FOOTER GRID */}
      <div className="max-w-[1730px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <img
              src="/assets/images/logo/Dadu_Fresh_Logo 1.png"
              alt="Dadu Fresh Logo"
              className="w-[90px] h-[75px] object-contain"
            />
          </div>
          <p className="text-[18px] font-bold leading-relaxed text-[#283646]">
            Dadu Fresh Organic Products is on a mission to power your journey
            towards a healthier lifestyle because we believe true wellness
            begins with freshness.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex justify-around">
          <div>
            <h3 className="text-[#077D40] font-semibold mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-[17px]">
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
          <div>
            <h3 className="text-[#077D40] font-semibold mb-4 text-lg">
              Information
            </h3>
            <ul className="space-y-2 text-[17px]">
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
        </div>

        {/* Contact Us - Email + Social Icons */}
        <div className="space-y-4">
          <h3 className="text-[#077D40] font-semibold mb-2 text-lg">
            Contact Us
          </h3>

          <p className="text-[18px] font-bold">Your Email</p>

          {/* Email Subscribe */}
          <div className="flex rounded-2xl overflow-hidden border border-[#077D40] h-[50px]">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-[#077D40] text-white px-6 text-sm font-semibold">
              Subscribe
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-3">
            {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-[#018F45] w-8 h-8 flex items-center justify-center rounded-md text-white hover:bg-green-700 transition"
                >
                  <Icon size={16} />
                </a>
              )
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4 text-[17px]">
          <div className="flex items-start space-x-3">
            <MapPin size={22} className="text-green-600 mt-1" />
            <span>8819 Ohio St. South Gate, CA 90280</span>
          </div>
          <div className="flex items-start space-x-3">
            <Mail size={20} className="text-green-600 mt-1" />
            <a
              href="mailto:Ourstudio@hello.com"
              className="hover:text-green-700"
            >
              Ourstudio@hello.com
            </a>
          </div>
          <div className="flex items-start space-x-3">
            <Phone size={20} className="text-green-600 mt-1" />
            <span>+1 386-688-3295</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#077D40] mt-8">
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="text-[16px] text-[#283646]">
            © 2025 Dadu Fresh. Powered by Shopify
          </p>
        </div>
      </div>
    </footer>
  );
}
