"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  icon: string;
  children?: { title: string; href: string }[];
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "/assets/images-dashboard/icons/01.svg",
    children: [
      { title: "Main Demo", href: "/dashboard" },
      { title: "Coming Soon", href: "#" },
    ],
  },
  {
    title: "Order",
    icon: "/assets/images-dashboard/icons/09.svg",
    href: "/dashboard/order",
    // children: [
    //   { title: "Order",  },
    //   { title: "Order Details", href: "/dashboard/order-details/{order_id}" },
    // ],
  },
  {
    title: "Product",
    icon: "/assets/images-dashboard/icons/02.svg",
    children: [
      { title: "Product List", href: "/dashboard/product-list" },
      { title: "Add Product", href: "/dashboard/add-product" },
    ],
  },
  {
    title: "Categories",
    icon: "/assets/images-dashboard/icons/02.svg",
    children: [
      { title: "Categories List", href: "/dashboard/category-list" },
      { title: "Add Categories", href: "/dashboard/category-add" },
    ],
  },
  {
    title: "Vendor",
    icon: "/assets/images-dashboard/icons/04.svg",
    children: [
      { title: "Vendor Grid", href: "/dashboard/vendor-grid" },
      { title: "Vendor List", href: "/dashboard/vendor-list" },
      { title: "Vendor Details", href: "/dashboard/vendor-details" },
      { title: "Create Vendors", href: "/dashboard/create-vendors" },
    ],
  },
  {
    title: "Transactions",
    icon: "/assets/images-dashboard/icons/06.svg",
    href: "/dashboard/transaction",
  },
  {
    title: "Reviews",
    icon: "/assets/images-dashboard/icons/07.svg",
    href: "/dashboard/review",
  },
  {
    title: "Brand",
    icon: "/assets/images-dashboard/icons/16.svg",
    href: "/dashboard/brand",
  },
  {
    title: "Payment",
    icon: "/assets/images-dashboard/icons/17.svg",
    href: "/dashboard/payment",
  },

  {
    title: "User Profile",
    icon: "/assets/images-dashboard/icons/05.svg",
    children: [
      { title: "Profile Setting", href: "/dashboard/profile-setting" },
      { title: "Log In", href: "/dashboard/log-in" },
      { title: "Registration", href: "/dashboard/registration" },
    ],
  },
];

export default function SidebarMenu() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const activeIndex = menuItems.findIndex((item) =>
      item.children?.some((child) => pathname === child.href)
    );
    if (activeIndex !== -1) setOpenIndex(activeIndex);
  }, [pathname]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="w-full">
      {menuItems.map((item, i) => {
        const hasSub = !!item.children?.length;
        const open = openIndex === i;

        return (
          <div key={i} className="">
            {/* Parent Menu */}
            {hasSub ? (
              <button
                onClick={() => toggle(i)}
                className={`flex items-center hover:bg-[#629d23] hover:text-white justify-between w-full h-[46px] px-6 text-[#2D3B29] transition-all`}
              >
                <div className="flex gap-4">
                  <div className="">
                    <img
                      src={item.icon}
                      className="w-8 mr-3 hover:text-white"
                    />
                  </div>
                  <div className="">
                    <p className="flex-1 text-left font-medium">{item.title}</p>
                  </div>
                </div>

                <div className="">
                  <i
                    className={`fa-solid fa-chevron-down text-sm transition-transform duration-300
                    ${open ? "rotate-180" : ""}
                `}
                  ></i>
                </div>
              </button>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center hover:bg-[#629d23] hover:text-white w-full gap-4 h-[46px] px-6 text-[#2D3B29] transition-all
                  ${pathname === item.href ? "text-black" : ""}
                `}
              >
                <div className="hover:text-white">
                  <img src={item.icon} className="w-8 mr-3 " />
                </div>

                <div className="">
                  <span className="text-left">{item.title}</span>
                </div>
              </Link>
            )}

            {/* Submenu */}
            {hasSub && (
              <div
                className={`overflow-hidden transition-all duration-300
                ${open ? "max-h-96" : "max-h-0"}
              `}
              >
                {item.children!.map((sub, j) => {
                  const active = pathname === sub.href;

                  return (
                    <div key={j} className="h-[50px]">
                      <Link
                        href={sub.href}
                        className={`py-2 h-[50px] w-[230px] items-center pl-10 flex ml-auto text-center text-[16px] transition-all
                          ${
                            active
                              ? "text-white bg-[#629d23] font-medium"
                              : "text-gray-600 hover:text-white hover:bg-[#629d23]"
                          }
                        `}
                      >
                        {sub.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
