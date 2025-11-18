"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import { ChevronDown, ChevronRight, ChevronUp, Trash2, X } from "lucide-react";
import Cart from "@/components/header/Cart";
import CheckOutMain from "../checkout/CheckOutMain";

interface CartItem {
  regularPrice: any;
  productImage: string;
  id: string | number;
  image: string;
  title: string;
  productName: string;
  price: number;
  quantity: number;
  active: boolean;
}

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false); // ✅ modal control

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price;
      const quantity = item.quantity || 1;
      return acc + (isNaN(price) ? 0 : price * quantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon === "12345") {
      setDiscount(0.25);
      setCouponMessage("Coupon applied -25% successfully");
      localStorage.setItem("coupon", coupon);
      localStorage.setItem("discount", "0.25");
    } else {
      setDiscount(0);
      setCouponMessage("Coupon code is incorrect");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
  };

  const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
    setCoupon("");
    setDiscount(0);
    setCouponMessage("");
    cartItems.forEach((item) => removeFromCart(item.id));
  };

  const finalTotal = subtotal - subtotal * discount;

  const newLocal = (
    <div className="text-gray-700 font-medium hidden md:block">
      Rs. {finalTotal.toFixed(2)}
    </div>
  );
  function setSpecialInstructions(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-full max-w-[1430px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex justify-between gap-[30px] lg:flex-row flex-col">
          {/* CART ITEMS SECTION */}
          <div className="lg:col-span-2 bg-white p-6">
            <div className="flex items-center gap-[13px]">
              <div className="text-[#333333]">
                <Cart />
              </div>

              <div className="text-[30px] font-medium">
                <p>
                  Shopping cart
                  <br />
                </p>
              </div>
            </div>

            <div className="ml-[48px] mb-[66px] mt-[7px]">
              <span className="text-[14px] font-normal text-[#1E1E1E]">
                You have {cartItems.length} item in your cart
              </span>
            </div>

            {/* CART ITEMS */}
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 w-[655px] h-[100px] shadow-md rounded-[15px] md:grid-cols-4 items-center gap-4 mb-[30px] pl-[13px]"
                >
                  <div className="w-[635px] h-[82.29px] mx-auto flex items-center justify-between">
                    {/* Product */}
                    <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                      <div className="">
                        <img
                          src={"/assets/images/products/Oats.png"}
                          alt="product"
                          className="w-[103.82px] h-[82.29px] object-cover rounded-lg"
                        />
                      </div>
                      <div className="w-[206.56px] ml-[24px] h-[49px]">
                        <p className="font-medium border-2 text-[#1E1E1E] text-[18px]">
                          {item.productName} <br />
                          <span className="font-normal text-[#1E1E1E] text-[14px]">
                            Product Details
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="w-[50px] h-[20px]">
                      <div className="flex items-center h-[20px] justify-between">
                        <div className="w-[17.57px]">
                          <input
                            type="text"
                            readOnly
                            value={item.quantity}
                            className="text-gray-800"
                          />
                        </div>

                        <div className="">
                          <div className="w-[20.95px] h-[8px]">
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              className="text-gray-600"
                            >
                              <ChevronUp />
                            </button>
                          </div>

                          <div className="mt-[4px]">
                            <button
                              onClick={() =>
                                item.quantity > 1 &&
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              className="text-gray-600"
                            >
                              <ChevronDown className="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-[96.03px] h-[21px] text-end text-[14px]">
                      {newLocal}
                    </div>

                    {/* delete icon */}
                    <div className="hover:text-red-500">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 pr-[10.62px]"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    {/* Subtotal */}
                    {/* <div className="text-gray-800 font-semibold text-right md:text-left">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div> */}
                  </div>
                </div>
              ))
            )}

            {/* Coupon Section */}
            {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
              <form
                onSubmit={applyCoupon}
                className="flex items-center w-full sm:w-auto gap-2"
              >
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponMessage("");
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-56 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p
                  className={`text-sm ${
                    coupon === "12345" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition sm:ml-auto"
              >
                Clear All
              </button>
            </div> */}

            {/* Buttons */}
            <div className="flex gap-[24px]">
              <div className="w-[332px] h-[51px] flex items-center hover:text-white text-[14px] border border-[#00000080] bg-[#D9D9D900]">
                <button className="text-black  hover:bg-[#077D40] h-[51px] transition">
                  Continue Shopping
                </button>
              </div>

              <div className="w-[332px] h-[51px] flex items-center hover:text-white text-[14px] border border-[#00000080] bg-[#077D40]">
                <button className="text-white h-[51px] transition">
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* SUMMARY SECTION */}
          <div className="w-[660px]">
            <div className="text-center text-[30px] font-bold">
              {/* Empty div for spacing */}
              <p>Order Summary</p>
            </div>
            <div className="bg-white w-[660px] h-[700px]">
              {/* SUB TOTAL */}
              <div className="flex justify-between text-[20px] w-[660px] h-[65px] items-center mb-4">
                <span className="text-[#00000080] font-bold">Subtotal :</span>
                <span className="text-[#000000] font-bold w-[156px]">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>

              {/* Special instructions for seller */}
              <div className="h-[264px]">
                <div className="h-[51x]">
                  <p className="h-[51px] text-[20px] flex items-end">
                    Special instructions for seller
                  </p>
                </div>

                <div
                  className="h-[186px] mt-[20px]"
                  style={{ border: "1px solid #018F45", borderRadius: "8px" }}
                >
                  <textarea
                    className="h-[186px] p-2"
                    placeholder=""
                    rows={6}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="w-[585px] h-[55px] flex items-center justify-center text-[20px] text-[#00000080] mt-[10px]">
                <p>
                  Shipping, taxes, and discounts will be calculated at checkout.
                </p>
              </div>

              {/* BUTTON */}
              <div className="w-[660px] h-[51px] text-[14px] border-2 bg-[#018F45] shadow-md text-white flex items-center justify-center mt-[20px]">
                <button
                  className="text-[14px] flex items-center justify-center"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Country & State */}
              <div className="mt-[20px] flex gap-[47px]">
                {/* Country */}
                <div className="w-[170px] h-[90px] text-[20px]">
                  <div className="h-[39px]">
                    <p>Country</p>
                  </div>

                  <div className="border-2 flex border-[#D2D0D0] rounded-[10px] items-center text-[12px] h-[50px]">
                    <div className="ml-[22px] text-[#6B6B6B]">
                      <select className="w-[170px] text-[12px] appearance-none h-[50px] mt-[10px]">
                        <option value="">Select Country</option>
                        <option value="india">India</option>
                        <option value="usa">USA</option>
                        <option value="uk">UK</option>
                      </select>
                    </div>
                    <div className="ml-[30px] w-[20px] h-[20px]">
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>

                {/* State */}
                <div className="w-[170px] h-[90px] text-[20px]">
                  <div className="h-[39px]">
                    <p>State</p>
                  </div>

                  <div className="border-2 flex border-[#D2D0D0] rounded-[10px] items-center text-[12px] h-[50px]">
                    <div className="ml-[22px] text-[#6B6B6B]">
                      <select className="w-[170px] text-[12px] appearance-none h-[50px] mt-[10px]">
                        <option value="">Select State</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="california">California</option>
                        <option value="texas">Texas</option>
                        <option value="ontario">Ontario</option>
                      </select>
                    </div>
                    <div className="ml-[30px] w-[20px] h-[20px]">
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Zip/Postal Code */}
              <div className="w-[660px] h-[99px] mt-[30px]">
                <div className="h-[39px]">
                  <p className="mt-[20px] text-[20px]">Zip/Postal Code</p>
                </div>

                <div className="h-[50px] text-[#6B6B6B] text-[12px] border border-[#D2D0D0] rounded-[8px] mt-[10px]">
                  <input
                    type="text"
                    placeholder="Enter Zip Code"
                    className="w-[680px] h-[50px] px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ CHECKOUT MODAL OVERLAY */}
      {showCheckout && (
        <div className="fixed inset-0 border-2 bg-black/70 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full max-w-[570px] h-[881px] overflow-y-auto scrollbar-hide">
            {/* Close Button */}
            <div className="absolute top-4 right-3">
              <button
              onClick={() => setShowCheckout(false)}
              className=" text-gray-500 hover:text-gray-800"
            >
              <X size={28} />
            </button>
            </div>

            <div className="mb-[20px]">
              <CheckOutMain />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartMain;
