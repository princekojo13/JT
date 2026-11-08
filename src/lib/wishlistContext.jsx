import { createContext, useCallback, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const KEY = "jt_wishlist_v1";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);
  const toggle = useCallback((product) => setItems((current) => current.some((item) => item.id === product.id)
    ? current.filter((item) => item.id !== product.id)
    : [...current, product]), []);
  const contains = useCallback((id) => items.some((item) => item.id === id), [items]);
  const remove = useCallback((id) => setItems((current) => current.filter((item) => item.id !== id)), []);
  return <WishlistContext.Provider value={{ items, toggle, contains, remove }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used within WishlistProvider");
  return value;
}
