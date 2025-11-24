import React from "react";

function MyComponent() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6">

        {/* ======================= LEFT SECTION ======================= */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5 max-h-[600px] overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h4 className="text-xl font-semibold text-gray-800">Top Products</h4>
              <p className="text-sm text-gray-500">Top Products List</p>
            </div>
          </div>

          {/* PRODUCT LIST ITEMS */}
          <div className="space-y-5">

            {/* ITEM */}
            {[
              { img: "08.jpg", brand: "01.png" },
              { img: "09.jpg", brand: "08.png" },
              { img: "10.jpg", brand: "01.png" },
              { img: "11.jpg", brand: "09.png" },
              { img: "11.jpg", brand: "10.png" },
            ].map((item, index) => (
              <div
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                key={index}
              >
                {/* Image + Name */}
                <div className="flex items-center space-x-3">
                  <img
                    src={`/assets/images-dashboard/grocery/${item.img}`}
                    className="w-14 h-14 rounded-md object-cover"
                    alt="product"
                  />
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Quaker Oats Healthy Meal...
                    </p>
                    <span className="text-sm text-gray-500">500 Items</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Coupon Code</p>
                  <span className="text-lg font-semibold">2415</span>
                </div>

                {/* Brand Logo */}
                <img
                  src={`/assets/images-dashboard/brand/${item.brand}`}
                  className="w-10 h-10 object-contain"
                  alt="brand"
                />

                {/* Price & Graph */}
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-green-600 font-semibold text-sm">5.29%</p>
                    <span className="text-gray-800 font-bold">$79.00</span>
                  </div>
                  <img
                    src="/assets/images-dashboard/brand/arrow-m.png"
                    className="w-5 h-5"
                    alt="arrow"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================= RIGHT SECTION ======================= */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5 max-h-[600px] overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-xl font-semibold text-gray-800">
                Top Countries Sales
              </h4>
              <p className="text-sm text-gray-500">Top Products List</p>
            </div>

            {/* Dropdown */}
            <div className="">
              <select className="border px-3 py-2 rounded-md text-sm">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
            </div>
          </div>

          {/* COUNTRY LIST */}
          <div className="space-y-4">

            {[
              { name: "USA", img: "02.png" },
              { name: "France", img: "02.png" },
              { name: "India", img: "03.png" },
              { name: "Italy", img: "04.png" },
              { name: "Japan", img: "05.png" },
              { name: "Koria", img: "06.png" },
              { name: "Indor", img: "07.png" },
              { name: "Vutan", img: "05.png" },
            ].map((country, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                {/* Flag + Name */}
                <div className="flex items-center space-x-3">
                  <img
                    src={`/assets/images-dashboard/brand/${country.img}`}
                    className="w-10 h-10"
                    alt={country.name}
                  />
                  <p className="font-semibold text-gray-700">{country.name}</p>
                </div>

                {/* Arrow */}
                <img
                  src="/assets/images-dashboard/brand/arrow-m.png"
                  className="w-5 h-5"
                  alt="arrow"
                />

                {/* Sales */}
                <p className="font-semibold text-gray-800">6,546</p>

                {/* Date */}
                <p className="text-gray-500 text-sm">04 Jul 2024</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyComponent;
