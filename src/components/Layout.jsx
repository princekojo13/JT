
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";
import WhatsAppFloat from "./WhatsAppFloat";

const PAGE_TITLES = {
  "/": "Tech for the life you’re building",
  "/shop": "Shop",
  "/cart": "Your Cart",
  "/checkout": "Checkout",
  "/about": "About Us",
  "/contact": "Contact Us",
  "/special-offers": "Special Offers",
  "/wholesale": "Wholesale Enquiries",
  "/delivery": "Delivery Information",
  "/track-order": "Track Your Order",
  "/my-orders": "My Orders",
  "/wishlist": "Saved for Later",
};

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle =
      PAGE_TITLES[pathname] ||
      (pathname.startsWith("/product/") ? "Product Details" : "Page Not Found");
    document.title = pathname === "/"
      ? `JTPO_S | ${pageTitle}`
      : `${pageTitle} | JTPO_S`;
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
}
