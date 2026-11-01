import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useStoreSettings, whatsappLink } from "@/lib/useStoreSettings";

export default function Contact() {
  const settings = useStoreSettings();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product") || "";
  const productName = searchParams.get("name") || "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: productName ? `I’m interested in ${productName}. Please let me know when it will be available.` : "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.message.trim().length < 5) return setError("Please add a short message.");
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("product_enquiries").insert({
        product_id: productId || null,
        product_name: productName || null,
        customer_name: form.name.trim().slice(0, 100),
        email: form.email.trim().toLowerCase().slice(0, 254),
        phone: form.phone.trim().slice(0, 30) || null,
        message: form.message.trim().slice(0, 2000),
      });
      if (insertError) throw insertError;
      setSent(true);
    } catch (submitError) {
      console.error("Could not save JT enquiry:", submitError);
      setError("We couldn’t send that just now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <section className="bg-carbon py-14 text-white sm:py-20"><div className="mx-auto max-w-4xl px-4 text-center"><p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-pink">We’re here to help</p><h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">Talk to JT.</h1><p className="mx-auto mt-4 max-w-xl text-white/65">Ask about a product, check availability or leave a note for the brand.</p></div></section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_.7fr] lg:px-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-9">
          {sent ? <div className="py-12 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-4 font-heading text-2xl font-bold text-carbon">Message sent to JT</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Thanks for reaching out. Your enquiry has been saved and the JT team can follow up with you.</p></div> : <>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-pink">{productName ? "Product enquiry" : "Send a message"}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-carbon">{productName ? `Ask about ${productName}` : "What can we help you with?"}</h2>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-carbon">Your name<input required maxLength={100} value={form.name} onChange={update("name")} className="admin-input mt-2" placeholder="Name" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-carbon">Email<input required type="email" maxLength={254} value={form.email} onChange={update("email")} className="admin-input mt-2" placeholder="you@example.com" /></label><label className="block text-sm font-semibold text-carbon">Phone <span className="font-normal text-muted-foreground">(optional)</span><input type="tel" maxLength={30} value={form.phone} onChange={update("phone")} className="admin-input mt-2" placeholder="Mobile number" /></label></div>
              <label className="block text-sm font-semibold text-carbon">Message<textarea required maxLength={2000} value={form.message} onChange={update("message")} className="admin-input mt-2 min-h-32 resize-y" placeholder="Tell us what you’re looking for..." /></label>
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-carbon px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-pink hover:text-carbon disabled:opacity-60"><Send className="h-4 w-4" />{submitting ? "Sending…" : "Send enquiry"}</button>
              <p className="text-center text-xs text-muted-foreground">Your details are used to respond to this enquiry.</p>
            </form>
          </>}
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl bg-carbon p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[.22em] text-pink">JTPO_S</p><h2 className="mt-3 font-heading text-2xl font-bold">Looking for something specific?</h2><p className="mt-3 text-sm leading-6 text-white/60">Tell us the device, model or accessory you have in mind. We can also hear from you about products that are currently out of stock.</p></div>
          {settings.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 text-sm font-semibold text-carbon"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FF] text-blue-700"><Mail className="h-5 w-5" /></span>{settings.email}</a>}
          {settings.phone && <a href={`tel:${settings.phone}`} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 text-sm font-semibold text-carbon"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FF] text-blue-700"><Phone className="h-5 w-5" /></span>{settings.phone}</a>}
          {settings.whatsapp && <a href={whatsappLink(settings.whatsapp, `Hi JT, I have an enquiry${productName ? ` about ${productName}` : ""}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 text-sm font-semibold text-carbon"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FF] text-blue-700"><MessageCircle className="h-5 w-5" /></span>Chat with JT on WhatsApp</a>}
        </aside>
      </section>
    </div>
  );
}
