// // "use client";
// // import React, { useState } from "react";
// // import { useCart } from "@/components/header/CartContext";
// // import { CreditCard, Truck } from "lucide-react";

// // export default function CheckOutMain() {
// //   const { cartItems } = useCart();
// //   const [paymentMethod, setPaymentMethod] = useState("card");
// //   const [billingInfo, setBillingInfo] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     address: "",
// //     city: "",
// //     state: "",
// //     zip: "",
// //     phone: "",
// //   });

// //   const handleInputChange = (
// //     e: React.ChangeEvent<
// //       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// //     >
// //   ) => {
// //     const { id, value } = e.target;
// //     setBillingInfo({ ...billingInfo, [id]: value });
// //   };

// //   const handleOrderSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     alert("Order completed successfully!");
// //   };

// //   return (
// //     <div className="w-full min-h-screen flex items-center justify-center">
// //       <div className="w-full max-w-[570px] rounded-lg">
// //         <form onSubmit={handleOrderSubmit} className="space-y-8">
// //           {/* Billing Address */}
// //           <div className="max-w-[570px] h-[567px] rounded-sm p-4 sm:p-6 lg:p-8">
// //             <div>
// //               <h2 className="text-lg font-semibold mb-4 text-gray-800">
// //                 Billing Address
// //               </h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {/* Name */}
// //                 <div>
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     First Name
// //                   </label>
// //                   <div className="h-11 text-[15px] border border-[#B2BCCA] rounded-sm">
// //                     <input
// //                       id="firstName"
// //                       type="text"
// //                       value={billingInfo.firstName}
// //                       onChange={handleInputChange}
// //                       className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                       placeholder="Alex"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     Last Name
// //                   </label>
// //                   <div className="h-11 text-[15px] border border-[#B2BCCA] rounded-sm">
// //                     <input
// //                       id="lastName"
// //                       type="text"
// //                       value={billingInfo.lastName}
// //                       onChange={handleInputChange}
// //                       className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                       placeholder="Driver"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Mail */}
// //               <div className="mt-4">
// //                 <label className="block text-[12px] font-medium text-gray-700">
// //                   Email Address
// //                 </label>
// //                 <div className="h-11 text-[15px] border border-[#B2BCCA] rounded-sm">
// //                   <input
// //                     id="email"
// //                     type="email"
// //                     value={billingInfo.email}
// //                     onChange={handleInputChange}
// //                     className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                     placeholder="username@gmail.com"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Address */}
// //               <div className="mt-4">
// //                 <label className="block text-[12px] font-medium text-gray-700">
// //                   Street Address
// //                 </label>
// //                 <div className="h-11 text-[15px] border border-[#B2BCCA] rounded-sm">
// //                   <input
// //                     id="address"
// //                     type="text"
// //                     value={billingInfo.address}
// //                     onChange={handleInputChange}
// //                     className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                     placeholder="123 Street Name"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div className="h-11 mt-[15px] text-[15px] border border-[#B2BCCA] rounded-sm"></div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// //                 {/* State */}
// //                 <div>
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     State/Province
// //                   </label>
// //                   <div className="h-11 text-[15px] border border-[#B2BCCA] rounded-sm">
// //                     <select
// //                       id="state"
// //                       value={billingInfo.state}
// //                       onChange={handleInputChange}
// //                       className="w-full h-11 text-[15px] px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                     >
// //                       {/* <option value="">Select State</option> */}
// //                       <option value="California">California</option>
// //                       <option value="New York">New York</option>
// //                       <option value="Texas">Texas</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* City */}
// //                 <div>
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     City
// //                   </label>
// //                   <div className="h-11 text-[15px] flex items-center border border-[#B2BCCA] rounded-sm">
// //                     <input
// //                       id="city"
// //                       type="text"
// //                       value={billingInfo.city}
// //                       onChange={handleInputChange}
// //                       className="w-full  px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                       placeholder="San Diego"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Zip/Postal Code */}
// //                 <div>
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     Zip/Postal Code
// //                   </label>
// //                   <div className="h-11 flex items-center text-[15px] border border-[#B2BCCA] rounded-sm">
// //                     <input
// //                       id="zip"
// //                       type="text"
// //                       value={billingInfo.zip}
// //                       onChange={handleInputChange}
// //                       className="w-full h-11 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                       placeholder="22434"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Phone */}
// //                 <div className="">
// //                   <label className="block text-[12px] font-medium text-gray-700">
// //                     Phone Number
// //                   </label>
// //                   <div className="h-11 text-[15px] flex items-center border border-[#B2BCCA] rounded-sm">
// //                     <input
// //                       id="phone"
// //                       type="tel"
// //                       value={billingInfo.phone}
// //                       onChange={handleInputChange}
// //                       className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                       placeholder="+123 456 789 111"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="mt-4 flex flex-col gap-2">
// //                 <label className="inline-flex items-center">
// //                   <input
// //                     type="checkbox"
// //                     className="form-checkbox text-green-600"
// //                   />
// //                   <span className="ml-2 text-[12px] text-gray-600">
// //                     My billing and shipping address are the same
// //                   </span>
// //                 </label>
// //                 <label className="inline-flex items-center">
// //                   <input
// //                     type="checkbox"
// //                     className="form-checkbox text-green-600"
// //                   />
// //                   <span className="ml-2 text-[12px] text-gray-600">
// //                     Create an account for later use
// //                   </span>
// //                 </label>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="max-w-[570px] h-[395px] bg-white rounded-sm shadow-xl p-4 sm:p-6 lg:p-8">
// //             {/* Payment Method */}
// //             <div>
// //               <h2 className="text-lg font-semibold mb-4 text-gray-800">
// //                 Payment Method
// //               </h2>
// //               <div className="space-y-4">
// //                 {/* COD */}
// //                 <div className="">
// //                   <label
// //                     className={`p-4 border w-[528px] rounded-md cursor-pointer ${
// //                       paymentMethod === "cod"
// //                         ? "border-green-500 bg-green-50"
// //                         : "border-gray-300 hover:border-green-400"
// //                     }`}
// //                   >
// //                     <div className="h-5 flex items-center gap-2">
// //                       <input
// //                         type="radio"
// //                         name="payment"
// //                         value="cod"
// //                         checked={paymentMethod === "cod"}
// //                         onChange={() => setPaymentMethod("cod")}
// //                         className="form-radio text-green-600"
// //                       />
// //                       <p className="text-[16px] font-semibold">
// //                         Cash on Delivery (COD)
// //                       </p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 {/* Card */}
// //                 <div className="">
// //                   <label
// //                     className={`block p-4 border rounded-md ${
// //                       paymentMethod === "card"
// //                         ? "border-[#1660CF] bg-[#1660CF]/10"
// //                         : "border-gray-300 hover:border-green-400"
// //                     }`}
// //                   >
// //                     <div className="flex items-center gap-3">
// //                       <div className="flex items-center w-[189px] border-2 gap-2">
// //                         <div className="">
// //                           <input
// //                             type="radio"
// //                             name="payment"
// //                             value="card"
// //                             checked={paymentMethod === "card"}
// //                             onChange={() => setPaymentMethod("card")}
// //                             className="form-radio text-green-600"
// //                           />
// //                         </div>

// //                         <div className="">
// //                           <p className="text-[16px] font-medium">
// //                             Pay with Credit Card
// //                           </p>
// //                         </div>
// //                       </div>
// //                       <div className="flex ml-auto w-[185px] h-[30px] justify-between">
// //                         <img
// //                           src="/assets/images/shop/Credit card3.png"
// //                           alt="Visa"
// //                           className="w-[42.5px] h-[30px]"
// //                         />
// //                         <img
// //                           src="/assets/images/shop/Credit card2.png"
// //                           alt="Mastercard"
// //                           className="w-[42.5px] h-[30px]"
// //                         />
// //                         <img
// //                           src="/assets/images/shop/Credit card1.png"
// //                           alt="Amex"
// //                           className="w-[42.5px] h-[30px]"
// //                         />
// //                         <img
// //                           src="/assets/images/shop/Credit card.png"
// //                           alt="Accepted Payments"
// //                           className="w-[42.5px] h-[30px]"
// //                         />
// //                       </div>
// //                     </div>

// //                     {paymentMethod === "card" && (
// //                       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         <div>
// //                           <label className="block text-[12px] font-medium text-gray-700">
// //                             Card Number
// //                           </label>
// //                           <input
// //                             type="text"
// //                             placeholder="1234 5678 9101 3456"
// //                             className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                             required
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-[12px] font-medium text-gray-700">
// //                             Expiration Date
// //                           </label>
// //                           <input
// //                             type="text"
// //                             placeholder="MM/YY"
// //                             className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                             required
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-[12px] font-medium text-gray-700">
// //                             Card Security Code
// //                           </label>
// //                           <input
// //                             type="text"
// //                             placeholder="CVV"
// //                             className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                             required
// //                           />
// //                         </div>
// //                         <div>
// //                           <a
// //                             href="#"
// //                             className="text-[12px] text-green-600 underline mt-7 inline-block"
// //                           >
// //                             What is this?
// //                           </a>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Submit Button */}
// //           <div>
// //             <button
// //               type="submit"
// //               className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
// //             >
// //               Complete Order
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }




// "use client";

// import React, { useState, useEffect } from "react";
// import { useCart } from "@/components/header/CartContext";
// import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
// import Cart from "@/components/header/Cart";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface CartItem {
//   id: string | number;
//   image: string;
//   productName: string;
//   price: number;
//   quantity: number;
// }

// const CartMain = () => {
//   const { cartItems, removeFromCart, updateItemQuantity } = useCart();
//   const router = useRouter();

//   const [subtotal, setSubtotal] = useState(0);

//   // Subtotal Calculation
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setSubtotal(total);
//   }, [cartItems]);

//   // ===========================
//   //  FIX: SEND CART TO BACKEND
//   // ===========================

//   const uploadCartToBackend = async (user_id: any) => {
//     try {
//       for (const item of cartItems) {
//         await axios.post(
//           "https://ekomart-backend.onrender.com/api/cart/addcart",
//           {
//             user_id,
//             product_id: item.id,
//             quantity: item.quantity,
//           }
//         );
//       }
//       return true;
//     } catch (err) {
//       console.log("AddCart API Error:", err);
//       return false;
//     }
//   };

//   // ===========================
//   //  CHECKOUT API
//   // ===========================

//   const handleCheckout = async () => {
//     const token = localStorage.getItem("token");
//     const user_id = localStorage.getItem("user_id");

//     if (!token || !user_id) {
//        router.push("/cart-summary");
//       return;
//     }

//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     // STEP 1: Store cart in backend
//     const uploaded = await uploadCartToBackend(user_id);
//     if (!uploaded) {
//       alert("Failed to sync cart with server");
//       return;
//     }

//     try {
//       // STEP 2: Now call checkout API
//       const response = await axios.post(
//         "https://ekomart-backend.onrender.com/api/cart/checkoutcart",
//         {
//           user_id,
//           payment_method: "COD",
//         }
//       );

//       console.log("Checkout:", response.data);

//       // save data for checkout page
//       localStorage.setItem("checkoutData", JSON.stringify(response.data));

//       // clear frontend cart
//       // clearCart();

//       // redirect
//       router.push("/checkout");
//     } catch (err: any) {
//       console.log("Checkout Cart Error:", err.response?.data || err.message);
//       alert("Checkout failed. Try again.");
//     }
//   };

//     function setSpecialInstructions(value: string): void {
//         throw new Error("Function not implemented.");
//     }

//   return (
//     <div className="w-full max-w-[1430px] mx-auto py-12 px-4 sm:px-6 lg:px-8 xl:px-0">
//       <div className="flex flex-col xl:flex-row gap-10">
//         {/* ======================== CART SECTION ======================== */}
//         <div className="w-full xl:max-w-[800px] mx-auto bg-white p-6 rounded-lg">
//           {/* Header */}
//           <div className="flex items-center gap-4">
//             <Cart />
//             <h1 className="text-2xl md:text-3xl font-semibold">
//               Shopping Cart
//             </h1>
//           </div>

//           <p className="ml-1 mt-3 text-gray-600">
//             You have {cartItems.length} items in your cart
//           </p>

//           {/* ======================== CART ITEMS ======================== */}
//           {cartItems.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               Your cart is empty.
//             </div>
//           )}

//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white shadow-md rounded-lg mb-4 mt-3 p-4"
//             >
//               {/* MOBILE LAYOUT */}
//               <div className="md:hidden block">
//                 <img
//                   src="/assets/images/products/Oats.png"
//                   className="w-full h-72 object-cover rounded-md"
//                 />

//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="">
//                     <p className="text-lg font-semibold">
//                       {item.productName || "Product Name"}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {item.description || "Product Details"}
//                     </p>
//                   </div>

//                   <div className="">
//                     {/* Delete Button Mobile */}
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="mt-4 text-red-500 flex items-center gap-2"
//                     >
//                       <Trash2 size={18} /> Remove
//                     </button>
//                   </div>
//                 </div>

//                 {/* Quantity + Price */}
//                 <div className="flex justify-between items-center mt-4">
//                   {/* Quantity */}
//                   <div className="flex items-center gap-3">
//                     <div className="">
//                       <button
//                       onClick={() =>
//                         item.quantity > 1 &&
//                         updateItemQuantity(item.id, item.quantity - 1)
//                       }
//                       className="w-7 h-7 flex justify-center items-center border rounded-md"
//                     >
//                       <ChevronDown size={16} />
//                     </button>
//                     </div>

//                     <span className="font-medium">{item.quantity}</span>

//                     <div className="">
//                       <button
//                       onClick={() =>
//                         updateItemQuantity(item.id, item.quantity + 1)
//                       }
//                       className="w-7 h-7 flex justify-center items-center border rounded-md"
//                     >
//                       <ChevronUp size={16} />
//                     </button>
//                     </div>
//                   </div>

//                   <p className="font-semibold text-lg">
//                     Rs. {(item.price * item.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               {/* ================= DESKTOP/TABLET layout (Unchanged) ================= */}
//               <div className="hidden md:grid grid-cols-4 gap-4 items-center">
//                 <img
//                   src="/assets/images/products/Oats.png"
//                   className="w-[110px] h-[90px] object-cover rounded-md"
//                 />

//                 <div>
//                   <p className="text-lg font-semibold">{item.productName}</p>
//                   <p className="text-sm text-gray-600">Product Details</p>
//                 </div>

//                 {/* Quantity */}
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() =>
//                       updateItemQuantity(item.id, item.quantity + 1)
//                     }
//                     className="text-gray-600"
//                   >
//                     <ChevronUp />
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() =>
//                       item.quantity > 1 &&
//                       updateItemQuantity(item.id, item.quantity - 1)
//                     }
//                     className="text-gray-600"
//                   >
//                     <ChevronDown />
//                   </button>
//                 </div>

//                 {/* Price + Delete */}
//                 <div className="flex items-center justify-end gap-4">
//                   <p className="font-semibold">
//                     Rs. {(item.price * item.quantity).toFixed(2)}
//                   </p>
//                   <button
//                     className="text-red-500"
//                     onClick={() => removeFromCart(item.id)}
//                   >
//                     <Trash2 />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button className="border border-black py-3 w-full hover:bg-gray-200">
//               Continue Shopping
//             </button>

//             <button className="bg-[#077D40] text-white py-3 w-full hover:bg-[#065d30]">
//               Update Cart
//             </button>
//           </div>
//         </div>

//         {/* ======================== ORDER SUMMARY ======================== */}
//         <div className="w-full xl:max-w-[660px] mx-auto bg-white p-6 rounded-lg">
//           <h2 className="text-center text-3xl font-bold mb-6">Order Summary</h2>

//           <div className="flex justify-between text-lg mb-4">
//             <span className="text-gray-600 font-bold">Subtotal :</span>
//             <span className="font-bold">Rs. {subtotal.toFixed(2)}</span>
//           </div>

//           {/* Instructions */}
//           <div className="mb-6">
//             <p className="text-lg font-medium">
//               Special instructions for seller
//             </p>

//             <textarea
//               className="w-full border border-green-600 rounded-lg p-3 mt-3 h-40"
//               placeholder=""
//               onChange={(e) => setSpecialInstructions(e.target.value)}
//             ></textarea>
//           </div>

//           <p className="text-center text-sm text-gray-500">
//             Shipping, taxes, and discounts will be calculated at checkout.
//           </p>

//           {/* Checkout Button */}
//           <div>
//             <button
//               onClick={handleCheckout}
//               className="w-full mt-6 bg-[#018F45] text-white py-3 text-lg rounded-md shadow-md"
//             >
//               Proceed to Checkout
//             </button>
//           </div>

//           {/* Country / State */}
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <p className="text-lg mb-2">Country</p>
//               <select className="w-full border rounded-lg py-3 px-3 text-sm">
//                 <option value="">Select Country</option>
//                 <option value="india">India</option>
//                 <option value="usa">USA</option>
//                 <option value="uk">UK</option>
//               </select>
//             </div>

//             <div>
//               <p className="text-lg mb-2">State</p>
//               <select className="w-full border rounded-lg py-3 px-3 text-sm">
//                 <option value="">Select State</option>
//                 <option value="maharashtra">Maharashtra</option>
//                 <option value="california">California</option>
//                 <option value="texas">Texas</option>
//               </select>
//             </div>
//           </div>

//           {/* ZIP */}
//           <div className="mt-6">
//             <p className="text-lg mb-2">Zip / Postal Code</p>
//             <input
//               type="text"
//               placeholder="Enter Zip Code"
//               className="w-full border rounded-lg px-3 py-3 text-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ======================== CHECKOUT MODAL ======================== */}
//       {/* {showCheckout && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="relative w-full scrollbar-hide max-w-[570px] max-h-[90vh] overflow-y-auto rounded-lg p-4">
//             <div className="fixed top-4 xl:top-9 right-26 xl:right-160">
//               <button
//                 onClick={() => setShowCheckout(false)}
//                 className="absolute top-4 md:right-3 right-7 text-gray-600"
//               >
//                 <X size={28} />
//               </button>
//             </div>

//             <CheckOutMain />
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default CartMain;
