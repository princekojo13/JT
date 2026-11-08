import { useEffect, useState } from "react";
import { Check, Loader2, Save, Settings } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { queryClientInstance } from "@/lib/query-client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { toast } from "@/components/ui/use-toast";

const DEFAULT_SETTINGS = {
  id: true,
  store_name: "JT",
  tagline: "Tech for the life you’re building.",
  email: "",
  phone: "027 786 9200",
  whatsapp: "+233 27 786 9200",
  domain: "",
  snapchat: "JTPO_S",
  instagram: "JTPO_S",
  facebook: "",
  tiktok: "JTPO_S",
  address: "",
  x: "JTPO_S",
  business_latitude: 5.603717,
  business_longitude: -0.186964,
  delivery_rate: 10,
  delivery_distance_unit: 7,
  distance_multiplier: 1,
  max_delivery_distance_km: "",
  low_stock_default: 5,
  moolre_enabled: true,
  store_open: true,
  maintenance_mode: false,
  hero_eyebrow: "Tech for the life you’re building",
  hero_title: "Technology meets your own story.",
  hero_copy: "Your next device, your next idea, your next move. Discover standout electronics selected for the way you live, work and create.",
  hero_image_url: "",
  promo_banner_text: "",
  promo_banner_link: "/special-offers",
};

const TEXT_FIELDS = [
  ["store_name", "Store name"],
  ["tagline", "Tagline"],
  ["email", "Customer support email", "email"],
  ["phone", "Phone number"],
  ["whatsapp", "WhatsApp number"],
  ["domain", "Website domain"],
  ["address", "Business address"],
  ["hero_eyebrow", "Homepage banner eyebrow"],
  ["hero_title", "Homepage banner headline"],
  ["hero_copy", "Homepage banner description"],
  ["hero_image_url", "Homepage banner image URL"],
  ["promo_banner_text", "Promotion announcement (optional)"],
  ["promo_banner_link", "Promotion link (optional)"],
];
const SOCIAL_FIELDS = [
  ["snapchat", "Snapchat"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["tiktok", "TikTok"],
  ["x", "X"],
];

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", true)
        .maybeSingle();
      if (!active) return;
      if (fetchError) {
        setError(fetchError.message || "Could not load store settings.");
      } else if (!data) {
        setError("The store settings row is missing in Supabase.");
      } else {
        const loadedSettings = { ...DEFAULT_SETTINGS, ...data };
        for (const field of ["phone", "whatsapp", "snapchat", "instagram", "tiktok", "x"]) {
          if (typeof data[field] !== "string" || !data[field].trim()) {
            loadedSettings[field] = DEFAULT_SETTINGS[field];
          }
        }
        setSettings(loadedSettings);
      }
      setLoading(false);
    }
    void loadSettings();
    return () => { active = false; };
  }, []);

  function updateField(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
    setSuccess("");
    setError("");
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const numberFields = [
      "business_latitude", "business_longitude", "delivery_rate",
      "delivery_distance_unit", "distance_multiplier", "low_stock_default",
    ];
    const payload = { updated_at: new Date().toISOString() };
    for (const [field] of TEXT_FIELDS) payload[field] = settings[field]?.trim() || null;
    for (const [field] of SOCIAL_FIELDS) payload[field] = settings[field]?.trim() || null;
    for (const field of numberFields) payload[field] = Number(settings[field]);
    payload.max_delivery_distance_km = settings.max_delivery_distance_km === "" || settings.max_delivery_distance_km === null || settings.max_delivery_distance_km === undefined
      ? null
      : Number(settings.max_delivery_distance_km);
    for (const field of [
      "moolre_enabled", "store_open", "maintenance_mode",
    ]) payload[field] = Boolean(settings[field]);

    if (!payload.store_name?.trim()) {
      setError("A store name is required.");
      setSaving(false);
      return;
    }

    if (!Number.isFinite(payload.business_latitude) || payload.business_latitude < -90 || payload.business_latitude > 90
      || !Number.isFinite(payload.business_longitude) || payload.business_longitude < -180 || payload.business_longitude > 180) {
      setError("Enter valid dispatch hub coordinates.");
      setSaving(false);
      return;
    }
    if (payload.delivery_rate < 0 || payload.delivery_distance_unit <= 0 || payload.distance_multiplier <= 0
      || payload.low_stock_default < 0
      || !Number.isSafeInteger(payload.low_stock_default)
      || (payload.max_delivery_distance_km !== null && payload.max_delivery_distance_km <= 0)) {
      setError("Check the delivery, stock, and order hold values.");
      setSaving(false);
      return;
    }

    try {
      const { data, error: saveError } = await supabase
        .from("store_settings")
        .update(payload)
        .eq("id", true)
        .select()
        .maybeSingle();
      if (saveError) throw saveError;
      if (!data) throw new Error("No settings row was updated. Check your admin access.");
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      await queryClientInstance.invalidateQueries({ queryKey: ["store_settings"] });
      setSuccess("Store settings saved.");
      toast({
        variant: "success",
        title: "Store settings saved",
        description: "Your business, delivery, and checkout settings are up to date.",
      });
      window.setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Store settings update failed:", err);
      setError(err?.message || "Could not save store settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FullPageLoading />;

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#111111]">
      <AdminPageHeader
        title="Store settings"
        description="Manage your business details, delivery, checkout, and store availability."
        width="max-w-6xl"
        actions={<Settings className="h-5 w-5 text-[#3578F6]" aria-hidden="true" />}
      />

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
        {success && <div role="status" className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"><Check className="h-5 w-5" />{success}</div>}
        {error && <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={saveSettings} className="space-y-6">
          <SettingsSection title="Business details" description="These details are shown around the customer-facing store.">
            <div className="grid gap-5 md:grid-cols-2">
              {TEXT_FIELDS.filter(([field]) => !field.startsWith("hero_") && !field.startsWith("promo_banner_")).map(([field, label, type]) => <Field key={field} label={label} type={type} value={settings[field] ?? ""} onChange={(value) => updateField(field, value)} />)}
            </div>
          </SettingsSection>

          <SettingsSection title="Social links" description="Add the social accounts customers should find.">
            <div className="grid gap-5 md:grid-cols-2">
              {SOCIAL_FIELDS.map(([field, label]) => <Field key={field} label={label} value={settings[field] ?? ""} onChange={(value) => updateField(field, value)} />)}
            </div>
          </SettingsSection>

          <SettingsSection title="Homepage promotions" description="Control the homepage hero and optional promotion strip.">
            <div className="grid gap-5 md:grid-cols-2">
              {TEXT_FIELDS.filter(([field]) => field.startsWith("hero_") || field.startsWith("promo_banner_")).map(([field, label]) => <Field key={field} label={label} value={settings[field] ?? ""} onChange={(value) => updateField(field, value)} />)}
            </div>
          </SettingsSection>

          <SettingsSection title="Dispatch and delivery" description="These values are used by the server when it calculates delivery distance and fees.">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <NumberField label="Hub latitude" value={settings.business_latitude} min="-90" max="90" step="any" onChange={(value) => updateField("business_latitude", value)} />
              <NumberField label="Hub longitude" value={settings.business_longitude} min="-180" max="180" step="any" onChange={(value) => updateField("business_longitude", value)} />
              <NumberField label="Delivery fee per unit (GHS)" value={settings.delivery_rate} min="0" step="0.01" onChange={(value) => updateField("delivery_rate", value)} />
              <NumberField label="Distance unit (km)" value={settings.delivery_distance_unit} min="0.1" step="0.1" onChange={(value) => updateField("delivery_distance_unit", value)} />
              <NumberField label="Distance multiplier" value={settings.distance_multiplier} min="0.1" step="0.01" onChange={(value) => updateField("distance_multiplier", value)} />
              <NumberField label="Max delivery distance (km, optional)" value={settings.max_delivery_distance_km ?? ""} min="0.1" step="0.1" optional onChange={(value) => updateField("max_delivery_distance_km", value)} />
            </div>
          </SettingsSection>

          <SettingsSection title="Checkout and inventory" description="JT accepts secure Moolre Mobile Money payments only. Cash on delivery is not offered.">
            <div className="grid gap-5 md:grid-cols-2">
              <Toggle label="Moolre Mobile Money" description="Allow customers to pay online through a Mobile Money request." checked={settings.moolre_enabled} onChange={(value) => updateField("moolre_enabled", value)} />
              <NumberField label="Low stock alert threshold" value={settings.low_stock_default} min="0" step="1" onChange={(value) => updateField("low_stock_default", value)} />
            </div>
          </SettingsSection>

          <SettingsSection title="Store availability" description="Control whether checkout is currently open.">
            <div className="grid gap-5 md:grid-cols-2">
              <Toggle label="Store open" description="Allow customers to place orders." checked={settings.store_open} onChange={(value) => updateField("store_open", value)} />
              <Toggle label="Maintenance mode" description="Show a maintenance message and pause checkout." checked={settings.maintenance_mode} onChange={(value) => updateField("maintenance_mode", value)} />
            </div>
          </SettingsSection>

          <div className="flex justify-end border-t border-black/[0.06] pt-5"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#3578F6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#2055C8] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save Changes</>}</button></div>
        </form>
      </main>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm sm:p-7"><div className="mb-6"><h2 className="font-heading text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-black/45">{description}</p></div>{children}</section>;
}

function Field({ label, value, onChange, type = "text" }) {
  return <label className="block text-sm font-medium text-black/70">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} maxLength={500} className="admin-input mt-2 w-full" /></label>;
}

function NumberField({ label, value, onChange, min = "0", max, step = "1", optional = false }) {
  return <label className="block text-sm font-medium text-black/70">{label}<input type="number" value={value ?? ""} onChange={(event) => onChange(event.target.value)} min={min} max={max} step={step} required={!optional} className="admin-input mt-2 w-full" /></label>;
}

function Toggle({ label, description, checked, onChange }) {
  return <label className="flex cursor-pointer items-start justify-between gap-5 rounded-xl border border-black/[0.07] p-4"><span><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs leading-5 text-black/45">{description}</span></span><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 accent-[#3578F6]" /></label>;
}

function FullPageLoading() {
  return <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC]"><Loader2 className="h-8 w-8 animate-spin text-[#3578F6]" /></div>;
}
