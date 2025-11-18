"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heart } from "lucide-react";

interface BlogGridMainProps {
  Slug: string;
  ProductImage: string;
  ProductTitle?: string;
  Price?: string;
  regularPrice?: string;
}

// interface BlogGridMainProps {
//   Slug: string;
//   ProductImage: string;
//   ProductTitle?: string;
//   Price?: string | number;
//   regularPrice?: string | number;
// }

interface ProductType {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  active: boolean;
  regularPrice: number | string;
  productImage: string;
  productName: string;
}

const BlogGridMain: React.FC<BlogGridMainProps & ProductType> = ({
  Slug,
  ProductImage,
  ProductTitle,
  Price,
  regularPrice,
}) => {
  type ModalType = "one" | "two" | "three" | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [wishlist, setWishlist] = useState<(string | number)[]>([]);

  const [added, setAdded] = useState(false);

  // ✅ Toast helper
  const notify = (
    message: string,
    type: "success" | "info" | "warning" | "error" = "success"
  ) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const handleAdd = (product?: any, index?: any) => {
    addToCart({
      id: Date.now(),
      image: `/assets/images/grocery/${ProductImage}`,
      title: ProductTitle ?? "Default Product Title",
      price: parseFloat(Price ?? "0"),
      quantity: 1,
      active: true,
      regularPrice: regularPrice ?? "0",
      productImage: "",
      productName: "",
    });
    setAdded(true);
    notify("🛒 Added to Cart!", "success");
  };

  const handleWishlist = (p0: any) => {
    addToWishlist({
      id: Date.now(),
      image: `/assets/images/grocery/${ProductImage}`,
      title: ProductTitle ?? "Default Product Title",
      price: parseFloat(Price ?? "0"),
      quantity: 1,
    });
    notify("❤️ Added to Wishlist!", "success");
  };

  const toggleWishlist = (id: string | number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
    toast("Wishlist updated!");
  };

  // const handleCompare = () => {
  //   addToCompare({
  //     image: `/assets/images/grocery/${ProductImage}`,
  //     name: ProductTitle ?? "Default Product Title",
  //     price: Price ?? "0",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  //     rating: 5,
  //     ratingCount: 25,
  //     weight: "500g",
  //     inStock: true,
  //   });
  //   notify("📊 Added to Compare!", "success");
  // };

  useEffect(() => {
    const handleQuantityClick = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      const parent = button.closest(".quantity-edit") as HTMLElement | null;
      if (!parent) return;

      const input = parent.querySelector(".input") as HTMLInputElement | null;
      const addToCart = parent.querySelector(
        "a.add-to-cart"
      ) as HTMLElement | null;
      if (!input) return;

      let oldValue = parseInt(input.value || "1", 10);
      let newVal = oldValue;

      if (button.classList.contains("plus")) newVal = oldValue + 1;
      else if (button.classList.contains("minus"))
        newVal = Math.max(1, oldValue - 1);

      input.value = newVal.toString();
      if (addToCart) addToCart.setAttribute("data-quantity", newVal.toString());
    };

    const buttons = document.querySelectorAll(".quantity-edit .button");
    buttons.forEach((button) => {
      button.removeEventListener("click", handleQuantityClick);
      button.addEventListener("click", handleQuantityClick);
    });

    return () => {
      buttons.forEach((button) =>
        button.removeEventListener("click", handleQuantityClick)
      );
    };
  }, []);

  return (
    <div className="">
      <div className="group w-[332px] h-[450px] relative bg-white">
        {/* Product Image */}
        <div className="relative">
          <a
            href={`/shop/${Slug}`}
            className="block "
          >
            <div className="absolute right-[10.91px] top-2.5 z-10 flex items-center justify-center bg-[#077D40] w-[100px] h-[33px] text-center text-white text-[15px] font-bold rounded-full">
              Save 20%
            </div>
            <div className="">
              <img
                src={`/assets/images/products/Oats.png`}
                alt="grocery"
                className="w-[331.5px] h-72 object-cover "
              />
            </div>

            {/* Wishlist icon (inside image, bottom-right) */}
            <div className="absolute bottom-3 right-3">
              <button onClick={() => handleWishlist(Slug)} className="">
                <Heart
                  className={`w-10 h-10 ${
                    wishlist.includes(Slug)
                      ? "fill-[#077D40] text-[#077D40]"
                      : "text-[#333333]"
                  }`}
                />
              </button>
            </div>
          </a>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div className="w-[332px] mt-[13px] h-[53px]">
            {/* Product Name & Rating */}
            <div className="flex h-6 items-center justify-between">
              <div className="">
                <p className="text-[14px] font-bold text-[#000000] truncate">
                  {ProductTitle || "Organic Product"}
                </p>
              </div>
              {/* Rating */}
              <div className="text-black mr-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span className="text-[16px]" key={i}>
                      ★
                    </span>
                  ))}
              </div>
            </div>

            {/* Price & Reviews */}
            <div className="flex items-center h-6 justify-between">
              <div className="leading-[23.8px]">
                <p className="text-gray-600 text-[14px]">
                  {Price ? `₹${regularPrice}` : "₹95.00"}
                </p>
              </div>
              <div className="mr-3">
                <p className="text-[14px] text-[#3333338C]">
                  4.86 (887k Reviews)
                </p>
              </div>
            </div>
          </div>

          {/* button */}
          <div className="mt-10 w-[332px] border-2 hover:text-white text-[14px] h-[51px]">
            <button
              className={`w-full h-[51px] border border-black rounded hover:bg-[#077D40] hover:text-white ${
                added ? "bg-[#077D40] text-white" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleAdd();
              }}
            >
              {added ? "Added ✅" : "Add to your Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="">
        {/* <CompareModal show={activeModal === "one"} handleClose={handleClose} />
      <ProductDetails
        show={activeModal === "two"}
        handleClose={handleClose}
        productImage={`/assets/images/grocery/${ProductImage}`}
        productTitle={ProductTitle ?? "Default Product Title"}
        productPrice={Price ?? "0"}
      /> */}
      </div>
    </div>
  );
};

export default BlogGridMain;
