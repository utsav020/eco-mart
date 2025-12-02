"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  description: string;
  id: number; // product_id
  product_variant_id?: number | null;
  productName: string;
  price: number;
  regularPrice: any;
  productImage: string;
  image: string;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem, userId: number) => Promise<void>;
  addToWishlist: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart:", error);
        localStorage.removeItem("cart");
      }
    }
    setIsCartLoaded(true);
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  // ✅ ADD TO CART (Backend + Local)
  const addToCart = async (item: CartItem, userId: number) => {
    try {
      const response = await fetch(
        "https://ekomart-backend.onrender.com/api/cart/addcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            items: [
              {
                product_id: item.id,
                product_variant_id: item.product_variant_id || null,
                quantity: item.quantity,
              },
            ],
          }),
        }
      );  

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend Cart Error:", data);
        return;
      }

      console.log("✅ Backend Cart Updated:", data);

      // ✅ Update local cart
      setCartItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.id === item.id &&
            i.product_variant_id === item.product_variant_id &&
            i.active === true
        );

        if (existing) {
          return prev.map((i) =>
            i.id === item.id &&
            i.product_variant_id === item.product_variant_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          return [...prev, item];
        }
      });
    } catch (error) {
      console.error("❌ Add to cart failed:", error);
    }
  };

  // ✅ ADD TO WISHLIST
  const addToWishlist = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.active === false);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.active === false
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ UPDATE QUANTITY
  const updateItemQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addToWishlist,
        removeFromCart,
        updateItemQuantity,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
