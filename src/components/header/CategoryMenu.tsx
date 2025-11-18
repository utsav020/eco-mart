"use client";

import React, { useState, useEffect, MouseEvent } from "react";
import axios from "axios";

type MenuItem = {
  id: string; // MongoDB _id
  icon: string;
  label: string;
  submenu: string[] | null;
};

const CategoryMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle submenu open/close
  const toggleMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/getallcategory`
        );

        const mappedData: MenuItem[] = response.data.map((cat: any) => ({
          id: cat._id,
          icon: cat.icon || "default.svg",
          label: cat.categoryName,
          submenu: cat.subcategories || null,
        }));

        setMenuItems(mappedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav>
      <ul className="category-sub-menu" id="category-active-four">
        {menuItems.map((item, index) => (
          <li key={item.id}>
            <a
              href="#"
              className="menu-item flex items-center justify-between"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (item.submenu) toggleMenu(index);
              }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={`/assets/images/icons/${item.icon}`}
                  alt={`${item.label} icon`}
                  className="w-5 h-5 object-contain"
                />
                <span>{item.label}</span>
              </div>
              {item.submenu && (
                <i
                  className={`fa-regular ${
                    openIndex === index ? "fa-minus" : "fa-plus"
                  }`}
                />
              )}
            </a>

            {item.submenu && (
              <ul
                className={`submenu mm-collapse mt-2 ml-6 ${
                  openIndex === index ? "mm-show" : ""
                }`}
              >
                {item.submenu.map((subItem, subIdx) => (
                  <li key={subIdx}>
                    <a className="mobile-menu-link block py-1" href="/shop">
                      {subItem}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryMenu;
