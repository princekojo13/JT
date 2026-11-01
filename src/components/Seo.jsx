import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ORIGIN = "https://jt-qbpb.onrender.com";
const DEFAULT_TITLE = "JTPO_S | Phones, Electronics & Everyday Tech";
const DEFAULT_DESCRIPTION = "Shop phones, electronics and everyday tech at JTPO_S. Discover JT Originals and curated gadgets with secure Moolre checkout and delivery across Ghana.";

const PAGES = {
  "/": [DEFAULT_TITLE, DEFAULT_DESCRIPTION],
  "/shop": ["Shop Phones & Electronics in Ghana | JTPO_S", "Browse JT Originals and curated phones, electronics and gadgets. Shop online with secure Moolre checkout and delivery across Ghana."],
  "/about": ["About JTPO_S | Tech for the Life You’re Building", "Meet JT, a Ghanaian tech and lifestyle brand bringing phones, electronics and curated gadgets together in one place."],
  "/contact": ["Contact JTPO_S | Customer Support", "Get in touch with JTPO_S about phones, electronics, orders and product availability."],
  "/special-offers": ["Special Offers on Phones & Gadgets | JTPO_S", "Explore current deals on selected phones, electronics and gadgets at JTPO_S. Offers may change over time."],
  "/wholesale": ["Wholesale Electronics & Gadgets | JTPO_S", "Ask JTPO_S about wholesale phones, electronics and gadget orders across Ghana."],
  "/delivery": ["Delivery Information | JTPO_S Ghana", "Learn about delivery coverage, estimated delivery times and fees for JTPO_S orders across Ghana."],
  "/product": ["Phones, Electronics & Gadgets | JTPO_S", "Explore phones, electronics and gadgets from JT Originals and curated tech at JTPO_S."],
};

const PRIVATE_PREFIXES = ["/admin", "/assistant", "/cart", "/checkout", "/my-orders", "/track-order", "/admin-login", "/assistant-login", "/assistant-invite"];

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isProduct = pathname.startsWith("/product/");
    const [title, description] = PAGES[pathname] || (isProduct ? PAGES["/product"] : [DEFAULT_TITLE, DEFAULT_DESCRIPTION]);
    const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    const canonical = `${ORIGIN}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", isPrivate ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta("property", "og:type", isProduct ? "product" : "website");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.jtStructuredData = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ElectronicsStore",
      name: "JTPO_S",
      alternateName: "JT",
      url: ORIGIN,
      description: DEFAULT_DESCRIPTION,
      areaServed: { "@type": "Country", name: "Ghana" },
      paymentAccepted: "Mobile Money",
    });
    document.head.querySelectorAll('script[data-jt-structured-data="true"]').forEach((item) => item.remove());
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [pathname]);

  return null;
}
