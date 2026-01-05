// "use client";

// import React, { useState, useEffect } from "react";
// import { useCart } from "@/components/header/CartContext";
// import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
// // import Cart from "@/components/header/Cart";
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

//   return (
//     <div className="w-full max-w-[1400px] mx-auto py-10 px-4 lg:px-0">
//       <div className="flex flex-col lg:flex-row gap-10">

//         {/* CART SECTION */}
//         <div className="w-full lg:max-w-[800px] bg-white p-6 rounded-lg shadow-sm">
//           <div className="flex items-center gap-3">
//             {/* <Cart /> */}
//             <h1 className="text-3xl font-semibold">Shopping Cart</h1>
//           </div>

//           <p className="mt-2 text-gray-600">
//             You have {cartItems.length} items in your cart
//           </p>

//           {cartItems.length === 0 && (
//             <div className="text-center py-10 text-gray-500">
//               Your cart is empty.
//             </div>
//           )}

//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white border rounded-lg shadow-sm p-4 mt-4"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={item.image}
//                   className="w-24 h-24 rounded object-cover"
//                 />

//                 <div className="flex-1">
//                   <p className="text-lg font-semibold">{item.productName}</p>
//                   <p className="text-gray-600">₹ {item.price}</p>

//                   <div className="flex items-center gap-3 mt-3">
//                     <button
//                       onClick={() =>
//                         item.quantity > 1 &&
//                         updateItemQuantity(item.id, item.quantity - 1)
//                       }
//                       className="p-1 border rounded"
//                     >
//                       <ChevronDown size={16} />
//                     </button>

//                     <span>{item.quantity}</span>

//                     <button
//                       onClick={() =>
//                         updateItemQuantity(item.id, item.quantity + 1)
//                       }
//                       className="p-1 border rounded"
//                     >
//                       <ChevronUp size={16} />
//                     </button>

//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-500 ml-auto"
//                     >
//                       <Trash2 />
//                     </button>
//                   </div>
//                 </div>

//                 <p className="font-semibold">
//                   ₹ {(item.price * item.quantity).toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ORDER SUMMARY */}
//         <div className="w-full lg:max-w-[450px] bg-white p-6 rounded-lg shadow-sm">
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

//           <div className="flex justify-between text-lg">
//             <span>Subtotal:</span>
//             <span className="font-semibold">₹ {subtotal.toFixed(2)}</span>
//           </div>

//           <p className="text-sm text-gray-500 mt-2">
//             Shipping & taxes calculated at checkout.
//           </p>

//           <button
//             onClick={handleCheckout}
//             className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700"
//           >
//             Proceed to Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartMain;
