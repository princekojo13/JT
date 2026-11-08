import { Heart, Trash2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlistContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { items } = useWishlist();
  return <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">Your collection</p>
    <h1 className="mt-2 font-heading text-3xl font-bold">Saved for later</h1>
    {items.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      : <div className="mt-8 rounded-2xl border border-dashed p-10 text-center"><Heart className="mx-auto h-8 w-8 text-blue-600"/><p className="mt-3 text-sm text-black/60">Products you save will appear here on this device.</p><Link to="/shop" className="mt-5 inline-flex rounded-xl bg-[#07131e] px-5 py-3 text-sm font-bold text-white">Browse the shop</Link></div>}
  </main>;
}
