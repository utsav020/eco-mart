import React from "react";

function MyComponent() {
  return (
    <div className="w-full px-4 md:px-6">
      <div className="grid grid-cols-1 gap-6 mt-0">

        {/* ================= LEFT: ORDERS LIST ================= */}
        <div className="bg-white rounded-lg shadow p-5 max-h-[600px] overflow-y-auto scrollbar-hide">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl font-semibold text-gray-800">Orders</h4>

            <div className="border px-3 py-2 rounded-md text-md bg-white">
              <select className="">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {[
              { img: "08.jpg", price: "$99.00", date: "5 June 2025" },
              { img: "09.jpg", price: "$86.00", date: "5 June 2024" },
              { img: "10.jpg", price: "$69.00", date: "5 Aug 2024" },
              { img: "11.jpg", price: "$49.00", date: "5 June 2023" },
              { img: "12.jpg", price: "$86.00", date: "5 June 2025" },
              { img: "13.jpg", price: "$88.00", date: "5 June 2024" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                {/* Image + Name */}
                <div className="flex items-center space-x-3">
                  <img
                    src={`/assets/images-dashboard/grocery/${item.img}`}
                    className="w-14 h-14 rounded-md object-cover"
                    alt="product"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">
                      Quaker Oats Healthy Meal...
                    </p>
                    <span className="text-md text-gray-500">500 Items</span>
                  </div>
                </div>

                {/* Price */}
                <p className="font-semibold text-gray-800">{item.price}</p>

                {/* Date */}
                <p className="text-md text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================ RIGHT: BEST SHOP SELLERS ================= */}
        <div className="bg-white rounded-lg shadow p-5 max-h-[600px] overflow-y-auto scrollbar-hide">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl font-semibold text-gray-800">Best Shop Sellers</h4>

            <div className="border px-3 py-2 rounded-md text-md bg-white">
              <select className="">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
            </div>
          </div>

          {/* Seller Items */}
          <div className="space-y-4">
            {[
              { img: "01.png", name: "Robert", category: "Food, Grocery", price: "$2,000" },
              { img: "03.png", name: "mark Henri", category: "Juice, Grocery", price: "$1,000" },
              { img: "04.png", name: "Krisob Kadri", category: "Food, Grocery", price: "$1,999" },
              { img: "05.png", name: "Koriana Joo", category: "Food, Grocery", price: "$1,25" },
              { img: "06.png", name: "Marlee", category: "Food, Grocery", price: "$5,653" },
              { img: "01.png", name: "John Brush", category: "Food, Grocery", price: "$2,600" },
              { img: "03.png", name: "Robert", category: "Food, Grocery", price: "$1,999" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                {/* Avatar + Name */}
                <div className="flex items-center space-x-3">
                  <img
                    src={`/assets/images-dashboard/grocery/${item.img}`}
                    className="w-14 h-14 rounded-md object-cover"
                    alt="seller"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{item.name}</p>
                    <span className="text-md text-gray-500">
                      75 Purchases
                    </span>
                  </div>
                </div>

                {/* Category */}
                <p className="text-md text-gray-700">{item.category}</p>

                {/* Price */}
                <p className="font-semibold text-gray-800">{item.price}</p>

                {/* Badge IMG */}
                <img
                  src="/assets/images-dashboard/grocery/02.png"
                  className="w-10 h-10 object-contain"
                  alt="badge"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyComponent;
