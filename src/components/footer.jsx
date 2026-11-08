import { Link } from "react-router-dom";
import {
  Ghost,
  Instagram,
  Mail,
  Music2,
  Phone,
  ShieldCheck,
  Twitter,
} from "lucide-react";
import Logo from "./Logo";
import WhatsAppIcon from "./WhatsAppIcon";
import {
  snapchatLink,
  useStoreSettings,
  whatsappLink,
} from "@/lib/useStoreSettings";

const SHOP_LINKS = [
  { label: "Shop All", path: "/shop" },
  { label: "JT Originals", path: "/shop?collection=jt_original" },
  { label: "Curated Tech", path: "/shop?collection=curated" },
  { label: "New Arrivals", path: "/shop?filter=new_arrival" },
  { label: "Special Offers", path: "/special-offers" },
  { label: "Wholesale", path: "/wholesale" },
];

const HELP_LINKS = [
  { label: "Delivery", path: "/delivery" },
  { label: "Track Order", path: "/track-order" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Saved items", path: "/wishlist" },
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
  { label: "Returns", path: "/returns" },
];

function FooterLinks({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </h4>

      <ul className="space-y-2.5 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="transition-colors hover:text-pink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const settings = useStoreSettings();

  const socialLinks = [
    {
      platform: "Snapchat",
      handle: settings.snapchat,
      icon: Ghost,
      url: settings.snapchat && snapchatLink(settings.snapchat),
    },
    {
      platform: "Instagram",
      handle: settings.instagram,
      icon: Instagram,
      url: settings.instagram.startsWith("http")
        ? settings.instagram
        : `https://instagram.com/${settings.instagram.replace("@", "")}`,
    },
    {
      platform: "TikTok",
      handle: settings.tiktok,
      icon: Music2,
      url: settings.tiktok.startsWith("http")
        ? settings.tiktok
        : `https://tiktok.com/@${settings.tiktok.replace("@", "")}`,
    },
    {
      platform: "X",
      handle: settings.x,
      icon: Twitter,
      url: settings.x.startsWith("http")
        ? settings.x
        : `https://x.com/${settings.x.replace("@", "")}`,
    },
  ].filter((social) => social.handle);

  return (
    <footer className="bg-carbon text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Logo />

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {settings.tagline}
            </p>

            <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
              <ShieldCheck className="h-4 w-4 text-pink" />
              Tech for the life you’re building
            </p>
          </div>

          <FooterLinks title="Shop" links={SHOP_LINKS} />
          <FooterLinks title="Help" links={HELP_LINKS} />

          {/* Contact + Social */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Get In Touch
            </h4>

            <ul className="space-y-3 text-sm text-white/70">
              {settings.whatsapp && <li>
                <a
                  href={whatsappLink(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-pink"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp: {settings.whatsapp}
                </a>
              </li>}

              {settings.phone && <li>
                <a href={settings.whatsapp ? whatsappLink(settings.whatsapp, "Hi JT, I’m contacting you about phone support.") : "/contact"} target={settings.whatsapp ? "_blank" : undefined} rel={settings.whatsapp ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 transition-colors hover:text-pink">
                  <Phone className="h-4 w-4" />
                  WhatsApp about phone support · {settings.phone}
                </a>
              </li>}

              {settings.email && <li>
                <a href={settings.whatsapp ? whatsappLink(settings.whatsapp, "Hi JT, I’m contacting you about customer support.") : "/contact"} target={settings.whatsapp ? "_blank" : undefined} rel={settings.whatsapp ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 break-all transition-colors hover:text-pink">
                  <Mail className="h-4 w-4 shrink-0" />
                  WhatsApp about email support · {settings.email}
                </a>
              </li>}
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
                  Follow Us
                </p>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-pink"
                        aria-label={`${social.platform} ${social.handle}`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                          <Icon className="h-4 w-4" />
                        </span>

                        {social.handle.startsWith("@") ||
                        social.handle.startsWith("http")
                          ? social.handle
                          : `@${social.handle}`}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {settings.brand_name}. All
            rights reserved.
          </p>

          {settings.domain && (
            <p className="text-xs text-white/50">
              {settings.domain}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
