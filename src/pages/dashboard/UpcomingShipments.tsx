import { useState, useEffect } from "react";
import { api, type Shipment, type ShipmentsResponse } from "../../services/api";
import { useApp } from "../../store/appContext";

const WA_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "+233 59 864 3872";

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  "Delayed": "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
};

const statusLabel: Record<string, string> = {
  on_time: "On Time",
  delayed: "Delayed",
  in_transit: "In Transit",
};

function displayStatus(raw: string) {
  return statusLabel[raw] ?? raw;
}

function TrackingEmailBanner({ email, hasWhatsApp }: { email: string; hasWhatsApp: boolean }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  }
  function copyWa() {
    navigator.clipboard.writeText(WA_NUMBER).then(() => {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    });
  }

  return (
    <div className="bg-[#052698]/5 border border-[#052698]/20 px-5 py-4 flex flex-col gap-3">
      <div>
        <p className="text-[#052698] font-heading font-bold text-[16.6px]">Add a shipment</p>
        <p className="text-black/85 text-[14.6px] mt-0.5">
          Forward or CC your shipment confirmation email to your tracking address — we'll pick it up and it will appear here automatically.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Email */}
        <div className="flex-1 flex items-center justify-between gap-3 bg-white border border-[#052698]/15 px-3 py-2">
          <span className="text-[#052698] font-medium text-[14.6px] truncate">{email}</span>
          <button
            onClick={copyEmail}
            className="shrink-0 text-[#052698]/70 hover:text-[#052698] text-[14.6px] transition-colors cursor-pointer"
          >
            {copiedEmail ? "Copied!" : "Copy"}
          </button>
        </div>
        {/* WhatsApp — Growth / Pro / Custom only */}
        {hasWhatsApp && (
          <div className="flex-1 flex items-center justify-between gap-3 bg-green-50 border border-green-200 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-600 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.531 5.855L.057 23.886a.5.5 0 00.611.61l6.101-1.525A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.187-1.38l-.372-.214-3.853.963.978-3.773-.232-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span className="text-green-700 font-medium text-[14.6px] truncate">{WA_NUMBER}</span>
            </div>
            <button
              onClick={copyWa}
              className="shrink-0 text-green-600 hover:text-green-700 text-[14.6px] transition-colors cursor-pointer"
            >
              {copiedWa ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingShipments() {
  const { trackingEmail } = useApp();
  const [plan, setPlan] = useState<string | null>(null);
  const hasWhatsApp = plan === null || plan === "growth" || plan === "pro" || plan === "custom";

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getPlan()
      .then((d) => { if (d?.plan) setPlan(d.plan); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.getShipments()
      .then((res: ShipmentsResponse) => setShipments(res?.active ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.vessel.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Upcoming Shipments</h2>
          <p className="text-black/85 text-[18.6px] mt-0.5">
            {loading ? "Loading…" : `${shipments.length} active container${shipments.length !== 1 ? "s" : ""} arriving within 30 days`}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[16.6px] px-4 py-3">{error}</div>
      )}

      {/* Tracking email info */}
      {trackingEmail && <TrackingEmailBanner email={trackingEmail} hasWhatsApp={hasWhatsApp} />}

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 border border-[#052698]/25 flex items-center px-3 gap-2 bg-[#FCFDFF]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="2" opacity="0.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by container ID, vessel or route…"
            className="flex-1 py-2.5 text-[16.6px] text-black bg-transparent placeholder-[#545454]/40"
          />
        </div>
      </div>

      {/* Shipment cards */}
      {loading ? (
        <div className="text-[16.6px] text-black/85 text-center py-12">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-[16.6px] text-black/85 text-center py-12">
          {search ? "No results match your search." : "No active shipments found."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const label = displayStatus(s.status);
            return (
              <div key={s.id} className="bg-[#FCFDFF] border border-[#052698]/20 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">

                  {/* Left: ID + vessel */}
                  <div className="shrink-0 md:w-56 md:mr-8">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#052698] font-medium text-[16.6px]">{s.id}</span>
                      <span className={`text-[14.6px] px-2 py-0.5 ${statusStyles[label] ?? "bg-black/5 text-black/80"}`}>{label}</span>
                    </div>
                    <p className="text-black text-[16.6px] mt-1">{s.vessel} · {s.line}</p>
                    <p className="text-black/80 text-[16.6px] mt-0.5">{s.origin} → {s.destination}</p>
                  </div>

                  {/* Center: progress bar */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[14.6px] text-black/80">
                      <span>Origin</span>
                      <span>Destination</span>
                    </div>
                    <div className="h-1.5 bg-[#052698]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#052698] rounded-full transition-all"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <div className="text-[14.6px] text-black/85 text-center">{s.progress}% in transit</div>
                  </div>

                  {/* Right: ETA */}
                  <div className="shrink-0 md:w-36 md:text-right md:ml-8">
                    <p className="text-[#052698] font-heading font-medium text-[16.6px]">{s.eta}</p>
                    <p className="text-black/80 text-[16.6px] mt-0.5">{s.days_left} days remaining</p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UpcomingShipments;
