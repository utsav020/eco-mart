import React from "react";
import ApexChartOne from "./ApexChartOne";
import ApexChartTwo from "./ApexChartTwo";
import TopProductCountries from "./TopProductCountries";
import OtherBestSeller from "./OtherBestSeller";

function DemoContent() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
            Overview
          </h3>

          <div>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-2xl font-bold text-gray-900">$1280</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-600 text-sm">
                  <i className="fa-light fa-arrow-up mr-1" />
                  <span>50.8%</span>
                </div>
                <img
                  src="/assets/images-dashboard/avatar/04.png"
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-2xl font-bold text-gray-900">158</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-600 text-sm">
                  <i className="fa-light fa-arrow-up mr-1" />
                  <span>50.8%</span>
                </div>
                <img
                  src="/assets/images-dashboard/avatar/05.png"
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-2xl font-bold text-gray-900">358</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-600 text-sm">
                  <i className="fa-light fa-arrow-up mr-1" />
                  <span>50.8%</span>
                </div>
                <img
                  src="/assets/images-dashboard/avatar/06.png"
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-2xl font-bold text-gray-900">$89k</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-600 text-sm">
                  <i className="fa-light fa-arrow-up mr-1" />
                  <span>50.8%</span>
                </div>
                <img
                  src="/assets/images-dashboard/avatar/07.png"
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Charts & Other Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <ApexChartOne />
          <ApexChartTwo />
          <TopProductCountries />
          <OtherBestSeller />
        </div>

        {/* Footer */}
        <div className="mt-10 py-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p>Copyright © 2025 All Rights Reserved.</p>
          <ul className="flex space-x-5 mt-3 sm:mt-0">
            <li><a href="#" className="hover:text-blue-600">Terms</a></li>
            <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
            <li><a href="#" className="hover:text-blue-600">Help</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default DemoContent;
