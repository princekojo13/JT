import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Cable,
  Check,
  Gamepad2,
  Headphones,
  Laptop,
  PackageOpen,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Watch,
} from "lucide-react";
import heroArt from "@/assets/jt-device-art.svg";
import storyArt from "@/assets/jt-story-art.svg";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/useProducts";
import { CATEGORIES } from "@/lib/siteConfig";
import { useStoreSettings } from "@/lib/useStoreSettings";

const CATEGORY_ICONS = {
  "Phones & Tablets": Smartphone,
  Audio: Headphones,
  Smartwatches: Watch,
  Gaming: Gamepad2,
  Accessories: Cable,
  Computing: Laptop,
  "Smart Home": Smartphone,
  "JT Exclusives": Sparkles,
};

function SectionHeading({ kicker, title, copy, to = "/shop" }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-pink">{kicker}</p>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-carbon sm:text-4xl">{title}</h2>
        {copy && <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{copy}</p>}
      </div>
      <Link to={to} className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-carbon transition hover:text-pink">
        Explore the store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ProductGrid({ products, loading, emptyTitle, emptyCopy }) {
  if (loading) {
    return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[3/4] animate-pulse rounded-2xl bg-london" />)}</div>;
  }
  if (!products.length) {
    return <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-10 text-center"><p className="font-heading text-lg font-bold text-carbon">{emptyTitle}</p><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{emptyCopy}</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pink">Ask JT about a device <ArrowRight className="h-4 w-4" /></Link></div>;
  }
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export default function Home() {
  const { brand_name: brandName } = useStoreSettings();
  const originals = useProducts({ collectionType: "jt_original", limit: 8 });
  const curated = useProducts({ collectionType: "curated", limit: 8 });
  const featured = useProducts({ featured: true, limit: 8 });
  const arrivals = useProducts({ newArrival: true, limit: 8 });
  const offers = useProducts({ specialOffer: true, limit: 8 });

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-carbon text-white">
        <div className="absolute -left-36 top-12 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[660px] lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-16">
          <div className="relative z-10 max-w-2xl py-6 lg:py-10">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/80"><span className="h-2 w-2 rounded-full bg-pink shadow-[0_0_16px_#68c5ff]" />{brandName} <span className="text-white/30">/</span> JTPO_S</div>
            <h1 className="max-w-2xl font-heading text-5xl font-bold leading-[.99] tracking-[-.05em] text-balance sm:text-6xl lg:text-7xl">Tech for the life <span className="text-pink">you’re building.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">Your next device, your next idea, your next move. Discover standout electronics selected for the way you live, work and create.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-pink px-7 text-sm font-extrabold uppercase tracking-[.12em] text-carbon transition hover:bg-white">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/about" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/20 px-7 text-sm font-bold text-white transition hover:border-white/70">Discover JT <ArrowDownRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-white/60">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-pink" />Secure Moolre</span>
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-pink" />Ghana delivery</span>
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-pink" />Curated tech</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0">
            <div className="absolute inset-10 rounded-full bg-blue-400/10 blur-3xl" />
            <img src={heroArt} alt="JT devices against a deep obsidian blue backdrop" className="relative w-full rounded-[2rem] shadow-2xl shadow-black/40" />
            <div className="absolute -bottom-2 left-4 rounded-xl border border-white/15 bg-carbon/80 px-4 py-3 shadow-xl backdrop-blur sm:bottom-8 sm:-left-8"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">The JT point of view</p><p className="mt-1 font-heading text-sm font-bold">Personal tech. Personal style.</p></div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300" />
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-4 py-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[[Check, "A considered collection", "Choose with confidence"], [ShieldCheck, "Secure checkout", "Pay with Moolre Mobile Money"], [Truck, "Delivery across Ghana", "Clear fees before you pay"]].map(([Icon, title, copy]) => <div key={title} className="flex items-center gap-3 py-4 sm:px-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-london text-pink"><Icon className="h-5 w-5" /></span><span><strong className="block text-sm text-carbon">{title}</strong><span className="text-xs text-muted-foreground">{copy}</span></span></div>)}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="Find your next favourite" title="Shop by category" copy="From everyday essentials to the little upgrades that make your setup yours." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {CATEGORIES.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.name] || Smartphone;
              return <Link key={category.slug} to={`/shop?category=${encodeURIComponent(category.slug)}`} className="group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-london/65 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-carbon sm:min-h-40 sm:p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-pink shadow-sm transition group-hover:bg-white/10"><Icon className="h-5 w-5" /></span><span className="mt-6 flex items-end justify-between gap-2"><span className="font-heading text-base font-bold text-carbon transition group-hover:text-white sm:text-lg">{category.name}</span><span className="text-xs font-semibold text-muted-foreground group-hover:text-white/45">0{index + 1}</span></span><ArrowRight className="absolute right-5 top-5 h-4 w-4 text-pink opacity-0 transition group-hover:opacity-100" /></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F7FC] py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading kicker="Made in the JT spirit" title="JT Originals" copy="Products created for the brand, with the JT signature at the centre." to="/shop?collection=jt_original" /><ProductGrid products={originals.products} loading={originals.loading} emptyTitle="The first JT Originals are on the way." emptyCopy="Check back for products created just for the brand, or tell us what you would love to see next." /></div></section>

      <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading kicker="Good tech, chosen well" title="Curated for your everyday" copy="A handpicked edit of phones, audio, gaming and useful accessories." to="/shop?collection=curated" /><ProductGrid products={curated.products} loading={curated.loading} emptyTitle="The curated tech edit is being put together." emptyCopy="Need a phone or gadget before the collection is live? Send JT an enquiry and we’ll help you find it." /></div></section>

      {(featured.products.length > 0 || featured.loading) && <section className="bg-[#F4F7FC] py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading kicker="Picked for you" title="Featured now" /><ProductGrid products={featured.products} loading={featured.loading} emptyTitle="Featured products will be here soon." emptyCopy="We’re selecting the first products for the collection." /></div></section>}
      {(offers.products.length > 0 || offers.loading) && <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading kicker="A little extra" title="Offers & drops" to="/special-offers" /><ProductGrid products={offers.products} loading={offers.loading} emptyTitle="No offers are live right now." emptyCopy="When a JT offer drops, you’ll find it here for a limited time." /></div></section>}
      {(arrivals.products.length > 0 || arrivals.loading) && <section className="bg-[#F4F7FC] py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading kicker="Just landed" title="New arrivals" /><ProductGrid products={arrivals.products} loading={arrivals.loading} emptyTitle="Fresh arrivals are coming soon." emptyCopy="The latest additions will appear here as soon as they are ready." /></div></section>}

      <section className="bg-carbon py-16 text-white sm:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><img src={storyArt} alt="JT, a brand built around you" className="w-full rounded-[1.75rem] border border-white/10" /><div><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-pink">More than a store</p><h2 className="max-w-xl font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Technology meets your own story.</h2><p className="mt-5 max-w-xl leading-7 text-white/65">JT is a personal brand with room to grow. The products are part of it, but so are the ideas, style and energy behind JTPO_S. One place for the things you use, the things you create and what comes next.</p><Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold transition hover:border-pink hover:text-pink">Get to know JT <ArrowRight className="h-4 w-4" /></Link></div></div></section>

      <section className="border-y border-border bg-white py-10"><div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-london text-pink"><PackageOpen className="h-6 w-6" /></span><div><h2 className="font-heading text-xl font-bold text-carbon">Looking for a device that’s not listed?</h2><p className="mt-1 text-sm text-muted-foreground">Send an enquiry for out-of-stock items or a gadget you have in mind.</p></div></div><Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-carbon px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-pink hover:text-carbon">Ask JT <ArrowRight className="h-4 w-4" /></Link></div></section>

      <section className="bg-[#EAF2FF] py-16 sm:py-20"><div className="mx-auto max-w-4xl px-4 text-center"><p className="mb-4 text-xs font-extrabold uppercase tracking-[.25em] text-blue-700">JTPO_S</p><h2 className="font-heading text-3xl font-bold tracking-tight text-carbon text-balance sm:text-5xl">Make your next move a good one.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Explore the collection, discover the story and find tech that fits your life.</p><Link to="/shop" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-carbon px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-pink hover:text-carbon">Explore JT <ArrowRight className="h-4 w-4" /></Link></div></section>
    </div>
  );
}
