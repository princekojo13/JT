import { useCallback, useEffect, useState } from "react";
import { Inbox, Loader2, Mail, Phone, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const STATUS_OPTIONS = ["new", "contacted", "resolved"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async (manual = false) => {
    manual ? setRefreshing(true) : setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase.from("product_enquiries").select("*").order("created_at", { ascending: false }).limit(200);
    if (queryError) setError(queryError.message || "Could not load enquiries.");
    else setEnquiries(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (enquiry, status) => {
    setSavingId(enquiry.id);
    setError("");
    const { error: updateError } = await supabase.from("product_enquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", enquiry.id);
    if (updateError) setError(updateError.message || "Could not update the enquiry.");
    else setEnquiries((current) => current.map((item) => item.id === enquiry.id ? { ...item, status } : item));
    setSavingId(null);
  };

  return <div className="min-h-screen bg-[#F4F7FC]"><AdminPageHeader title="Product enquiries" description="Availability requests and messages sent to JT." actions={<button type="button" onClick={() => void load(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold">{refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh</button>} /><main className="mx-auto max-w-6xl space-y-4 px-4 py-7 sm:px-6 lg:px-8">{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-pink" /></div> : enquiries.length === 0 ? <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center"><Inbox className="mx-auto h-10 w-10 text-pink" /><h2 className="mt-4 font-heading text-xl font-bold text-carbon">No enquiries yet</h2><p className="mt-2 text-sm text-muted-foreground">Product availability requests from the store will appear here.</p></div> : enquiries.map((enquiry) => <article key={enquiry.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-lg font-bold text-carbon">{enquiry.product_name || "General message"}</h2><span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800">{enquiry.status}</span></div><p className="mt-1 text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleString()}</p><p className="mt-4 whitespace-pre-line text-sm leading-6 text-carbon">{enquiry.message}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-2 hover:text-pink"><Mail className="h-4 w-4" />{enquiry.customer_name} · {enquiry.email}</a>{enquiry.phone && <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-2 hover:text-pink"><Phone className="h-4 w-4" />{enquiry.phone}</a>}</div></div><label className="shrink-0 text-xs font-semibold text-muted-foreground">Update status<select value={enquiry.status} disabled={savingId === enquiry.id} onChange={(event) => void updateStatus(enquiry, event.target.value)} className="admin-input mt-2 min-w-40">{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></label></div></article>)}</main></div>;
}
