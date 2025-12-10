// "use client";

// import React from "react";

// type OrderItem = {
//   product_id: number;
//   product_variant_id: number | null;
//   productName: string;
//   productVariantName: string | null;
//   price: number;
//   quantity: number;
//   image_url: string;
//   subtotal: number;
// };

// type CheckoutProps = {
//   order_id: number;
//   total_amount: number;
//   payment_method: string;
//   items_count: number;
//   order_items: OrderItem[];
// };

// export default function CheckoutCard({ 
//   order_id, 
//   total_amount, 
//   payment_method, 
//   items_count, 
//   order_items 
// }: CheckoutProps) {
//   return (
//     <div className="max-w-4xl mx-auto p-4 mt-6">
//       <div className="bg-white shadow-md rounded-lg p-6">
        
//         {/* ORDER DETAILS HEADER */}
//         <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p className="text-gray-600">Order ID</p>
//             <p className="font-semibold">{order_id}</p>
//           </div>

//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p className="text-gray-600">Payment Method</p>
//             <p className="font-semibold">{payment_method}</p>
//           </div>

//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p className="text-gray-600">Total Items</p>
//             <p className="font-semibold">{items_count}</p>
//           </div>

//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p className="text-gray-600">Total Amount</p>
//             <p className="font-semibold">₹ {total_amount}</p>
//           </div>
//         </div>

//         {/* ORDER ITEMS LIST */}
//         <h3 className="text-xl font-semibold mb-3">Ordered Items</h3>

//         <div className="space-y-4">
//           {order_items.map((item, index) => (
//             <div
//               key={index}
//               className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 rounded-lg shadow-sm"
//             >
//               <img
//                 src={item.image_url}
//                 alt={item.productName}
//                 className="w-24 h-24 object-cover rounded-md border"
//               />

//               <div className="sm:ml-4 flex-1 mt-3 sm:mt-0">
//                 <h4 className="text-lg font-semibold">{item.productName}</h4>
//                 {item.productVariantName && (
//                   <p className="text-gray-600">{item.productVariantName}</p>
//                 )}
//                 <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
//                 <p className="font-semibold">₹ {item.subtotal}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }
