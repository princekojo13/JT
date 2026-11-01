import { Link } from "react-router-dom";
import { Check, Package } from "lucide-react";

export default function Wholesale() {
  return (
    <div className="bg-white">
      <section className="bg-carbon text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-pink" />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-pink font-semibold mb-4">
            Wholesale
          </p>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Buy in Bulk
          </h1>

          <p className="text-white/70 max-w-xl mx-auto">
            Looking for several devices for a team, school or business?
            Wholesale is available — contact us directly for prices and
            availability.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-carbon mb-4">
                Wholesale with JT
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Tell us what devices you need and how many. JT will review the request and follow up with availability and pricing.
              </p>

              <div className="space-y-3">
                {[
                  "Phones and gadgets in larger quantities",
                  "Availability and pricing by request",
                  "Delivery across Ghana",
                  "Direct, personal support",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-pink mt-0.5 shrink-0" />
                    <span className="text-sm text-carbon">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-london/50 border border-border p-6 sm:p-8">
              <h3 className="font-heading text-xl font-bold text-carbon mb-2">
                Contact us for wholesale
              </h3>

              <p className="text-sm text-muted-foreground mb-6">
                To help us reply quickly, tell us which products you're
                interested in and roughly how many units you need.
              </p>

              <Link
                to="/contact"
                className="flex w-full items-center justify-center gap-2 bg-carbon py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-pink hover:text-carbon"
              >
                Send a wholesale enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
