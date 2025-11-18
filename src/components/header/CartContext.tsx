'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  regularPrice: any;
  productImage: string;
  id: number;
  image: string;
  title: string;
  productName: string;
  price: number;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

export interface CartItem1 {
  regularPrice: any;
  productImage: string;
  id: number;
  image: string;
  title: string;
  productName: string;
  price: number;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  addToWishlist: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  // ✅ Add item to cart (active: true) + call backend API
  const addToCart = async (item: CartItem) => {
    try {
      // 1️⃣ Make backend API call
      const response = await fetch('https://ekomart-backend.onrender.com/api/cart/addcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // optional if you use JWT
        },
        body: JSON.stringify({
          productId: item.id, // assuming 'id' is product ID
          quantity: item.quantity,
          price: item.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to add to backend cart:', data);
      } else {
        console.log('✅ Added to backend cart:', data);
      }

      // 2️⃣ Update local state
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id && i.active === true);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id && i.active === true
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          return [...prev, item];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Add item to wishlist (active: false)
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

  // Remove item by ID
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity (cart or wishlist)
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
