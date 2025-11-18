// "use client"; // optional, for client-side code

// const MyComponent = () => (
//   <div>
//     <div className="category-feature-area rts-section-gap">
//       <div className="container-2">
//         <div className="row g-24">
//           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
//             <div className="single-feature-card ssthree style-three bg_image one">
//               <div className="content-area">
//                 <a
//                   href="shop-grid-top-filter.html"
//                   className="rts-btn btn-primary"
//                 >
//                   Weekend Discount
//                 </a>
//                 <h3 className="title">
//                   Drink Fresh Corn Juice <br />
//                   <span>Good Taste</span>
//                 </h3>
//                 <a href="/shop" className="shop-now-goshop-btn">
//                   <span className="text">Shop Now</span>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
//             <div className="single-feature-card ssthree style-three bg_image two">
//               <div className="content-area">
//                 <a
//                   href="shop-grid-top-filter.html"
//                   className="rts-btn btn-primary"
//                 >
//                   Weekend Discount
//                 </a>
//                 <h3 className="title">
//                   Organic Lemon Flavored
//                   <span>Banana Chips</span>
//                 </h3>
//                 <a href="/shop" className="shop-now-goshop-btn">
//                   <span className="text">Shop Now</span>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
//             <div className="single-feature-card ssthree style-three bg_image three">
//               <div className="content-area">
//                 <a
//                   href="shop-grid-top-filter.html"
//                   className="rts-btn btn-primary"
//                 >
//                   Weekend Discount
//                 </a>
//                 <h3 className="title">
//                   Nozes Pecanera Brasil
//                   <span>Chocolate Snacks</span>
//                 </h3>
//                 <a href="/shop" className="shop-now-goshop-btn">
//                   <span className="text">Shop Now</span>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                   <div className="plus-icon">
//                     <i className="fa-sharp fa-regular fa-plus" />
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default MyComponent;

"use client";

import React from "react";

export default function CategoryTop() {
  return (
    <div className="max-w-[1430px] mx-auto mt-16 px-4">
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        {/* Left Offer Banner */}
        <div className="relative max-w-[846px] mx-auto xl:w-1/2 rounded-lg overflow-hidden group">
          <img
            src="/assets/images/offer/off-1.png"
            alt="Organic Beans Offer"
            className="w-full h-[250px] md:h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/5 left-0 flex flex-col justify-center text-white">
            <div className="md:ml-[330px] lg:ml-[400px] ml-[120px] md:h-[115px]">
              <i className="text-[#077D40] text-[28px] md:text-[35px] font-semibold italic mb-2">
                Get 20% Off
              </i>
              <br />
              <i className="md:text-[35px] text-[20px] font-semibold italic">
                On All Organic Beans
              </i>
            </div>
            <div className="md:ml-[330px] lg:ml-[400px] mt-[10px] ml-[120px]">
              <p className="text-[18px] md:text-[20px] text-gray-100">
                Pure, natural, and packed <br /> with goodness
              </p>
            </div>
          </div>
        </div>

        {/* Right Offer Banner */}
        <div className="relative max-w-[846px] mx-auto xl:w-1/2 rounded-lg overflow-hidden group">
          <img
            src="/assets/images/offer/off-2.png"
            alt="Explore More Products"
            className="w-full h-[250px] md:h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-10 text-white">
            <div className="md:ml-[355px] lg:ml-[480px] ml-[80px] w-[230px] md:w-[400px] overflow-hidden border-black">
              <div className="">
                <i className="text-[28px] md:text-[35px] font-semibold italic mb-2">
                  Explore More <br /> Of Our Products
                </i>
              </div>
              <div className="w-[220px]">
                <p className="text-[20px] md:text-[20px] text-gray-100">
                  Pure, natural, and packed with goodness
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
