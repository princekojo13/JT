import { Link } from "react-router-dom";
import { useStoreSettings } from "@/lib/useStoreSettings";

const CONTENT = {
  privacy: {
    title: "Privacy notice",
    intro: "JT uses the details you provide to process orders, arrange delivery, answer enquiries and help you track purchases.",
    sections: [
      ["Information we use", "This may include your name, email address, phone number, delivery address and order details. The delivery pin is used to calculate the delivery fee and route your order."],
      ["Payments", "Mobile Money payment requests are handled by Moolre. JT does not ask you to share your Mobile Money PIN or one-time verification code with us."],
      ["Storage and access", "Order and product information is stored in the store database. Access to customer order details is limited to authorised store staff who need it to fulfil an order."],
      ["Your choices", "Contact JT to ask about the personal information connected to your order or to request a correction. Some order records may need to be retained for business or legal purposes."],
    ],
  },
  terms: {
    title: "Terms of use",
    intro: "These terms explain the basic rules for shopping with JT. Submitting an order means you agree to provide accurate contact and delivery information.",
    sections: [
      ["Products and prices", "Product availability and prices are shown on each product page. A product is not reserved until your order is submitted, and an order is not paid until the payment provider confirms it."],
      ["Payment", "JT currently accepts Moolre Mobile Money online. Never send a PIN or verification code to JT staff. If a payment is pending, wait for the payment provider to confirm before placing another order."],
      ["Delivery", "The delivery fee is calculated from the location selected at checkout and shown before you place the order. Keep your phone available so the delivery team can coordinate with you."],
      ["Help", "If there is an issue with an order, contact JT with the order number so the store can review it."],
    ],
  },
  returns: {
    title: "Returns and order issues",
    intro: "If your order arrives damaged, incomplete or different from what you ordered, please contact JT as soon as possible with your order number and clear photos where relevant.",
    sections: [
      ["How to contact us", "Use the Contact page or the WhatsApp button and include your order number, the product name and a short description of the issue."],
      ["Review and resolution", "JT will review the circumstances and discuss an appropriate resolution with you. Any resolution will follow applicable consumer protection requirements."],
      ["Before sending an item back", "Please contact JT first so the return route and handling can be agreed. Keep the product, accessories and packaging while your request is being reviewed."],
      ["Policy owner", "JT should publish any product-specific return conditions here before completing a sale. Nothing in this notice limits rights that cannot legally be excluded."],
    ],
  },
};

export default function Policies({ kind = "privacy" }) {
  const settings = useStoreSettings();
  const policy = CONTENT[kind] || CONTENT.privacy;
  return <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">JTPO_S · Customer information</p>
    <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{policy.title}</h1>
    <p className="mt-5 text-base leading-7 text-slate-600">{policy.intro}</p>
    <div className="mt-8 space-y-6">{policy.sections.map(([title, body]) => <section key={title}><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-2 leading-7 text-slate-600">{body}</p></section>)}</div>
    <p className="mt-8 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">Questions? <Link to="/contact" className="font-semibold text-blue-700 underline">Contact JT</Link>{settings.email ? ` at ${settings.email}` : " through the contact form"}.</p>
  </main>;
}
