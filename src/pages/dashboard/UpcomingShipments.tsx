import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { api, type Shipment, type ShipmentsResponse } from "../../services/api";
import { useApp } from "../../store/appContext";

const WA_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "+233 59 864 3872";

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  "Delayed": "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
  "Arrived": "bg-green-50 text-green-700 border border-green-200",
  "Delivered": "bg-green-50 text-green-700 border border-green-200",
  "Discharged": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
  "Tracking Started": "bg-black/5 text-black/60 border border-black/10",
  "Pending Approval": "bg-amber-50 text-amber-700 border border-amber-200",
};

const statusLabel: Record<string, string> = {
  on_time: "On Time",
  delayed: "Delayed",
  in_transit: "In Transit",
  // ShipsGo v2 statuses (uppercase)
  IN_TRANSIT: "In Transit",
  ARRIVED: "Arrived",
  DELIVERED: "Delivered",
  DISCHARGED: "Discharged",
  LOADED: "In Transit",
  // Backend internal statuses
  tracking_started: "Tracking Started",
  pending_approval: "Pending Approval",
};

function displayStatus(raw: string) {
  return statusLabel[raw] ?? raw;
}

// ── Demo shipment ──────────────────────────────────────────────────────────────

type DemoMilestone = {
  phase: string;
  event: string;
  location: string;
  date: string;
  done: boolean;
  current?: boolean;
  icon: "box" | "ship" | "anchor" | "crane" | "badge";
};

const DEMO_MILESTONES: DemoMilestone[] = [
  { phase: "Origin",          icon: "box",    event: "Container loaded onto vessel",                  location: "Shanghai, China",       date: "Mar 1 · 08:14", done: true },
  { phase: "Origin",          icon: "ship",   event: "Vessel departed port",                          location: "Port of Shanghai",      date: "Mar 3 · 14:30", done: true },
  { phase: "At Sea",          icon: "ship",   event: "Crossed international dateline — on schedule",  location: "Pacific Ocean",         date: "Mar 9 · 09:05", done: true },
  { phase: "Transshipment",   icon: "anchor", event: "Vessel arrived at transshipment port",          location: "Port of Los Angeles",   date: "Mar 14 · 17:22", done: true },
  { phase: "Transshipment",   icon: "crane",  event: "Container transferred to feeder vessel",        location: "Port of Los Angeles",   date: "Mar 16 · 11:50", done: true, current: true },
  { phase: "Destination",     icon: "anchor", event: "Expected arrival at destination port",          location: "Tema Port, Ghana",      date: "Mar 22 · —",    done: false },
  { phase: "Destination",     icon: "badge",  event: "Customs clearance & release",                  location: "Tema Port, Ghana",      date: "Mar 24 · —",    done: false },
];

const PHASE_ORDER = ["Origin", "At Sea", "Transshipment", "Destination"];

const PHASE_ICONS: Record<string, ReactElement> = {
  "Origin": (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  "At Sea": (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1 2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1"/>
      <path d="M4 16l1-4h14l1 4"/>
      <path d="M12 4v8M8 8l4-4 4 4"/>
    </svg>
  ),
  "Transshipment": (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M16 6l4 4-4 4"/>
      <path d="M12 10a4 4 0 010 8"/>
    </svg>
  ),
  "Destination": (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
};

function MilestoneIcon({ type, done, current }: { type: DemoMilestone["icon"]; done: boolean; current?: boolean }) {
  const paths: Record<DemoMilestone["icon"], string> = {
    box:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM12 2.24L21 7.24M12 22V12M3 7.24l9 5",
    ship:   "M2 20a2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1 2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1M4 16l1-4h14l1 4M12 4v8M8 8l4-4 4 4",
    anchor: "M12 8a4 4 0 100-8 4 4 0 000 8zM12 8v13M4.93 10.93A10 10 0 0012 21a10 10 0 007.07-10.07M5 17l7 4 7-4",
    crane:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M21 15V5a2 2 0 00-2-2h-4M16 10H8M12 3v7",
    badge:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  };

  const color = current ? "text-white" : done ? "text-[#052698]" : "text-black/30";
  const bg = current
    ? "bg-[#052698]"
    : done
    ? "bg-[#052698]/10 border border-[#052698]/20"
    : "bg-black/5 border border-black/10";

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[type].split("M").filter(Boolean).map((d, i) => (
          <path key={i} d={`M${d}`} />
        ))}
      </svg>
    </div>
  );
}

function DemoShipment() {
  const [expanded, setExpanded] = useState(false);

  // Group milestones by phase in order
  const phases = PHASE_ORDER.map((phase) => ({
    phase,
    milestones: DEMO_MILESTONES.filter((m) => m.phase === phase),
  }));

  return (
    <div className="border border-dashed border-[#052698]/30 bg-[#FCFDFF]">
      {/* Demo label */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-0">
        <span className="text-[12.6px] px-2 py-0.5 bg-[#052698]/8 text-[#052698] border border-[#052698]/20 font-medium tracking-wide">
          DEMO SHIPMENT
        </span>
        <span className="text-[13px] text-black/55">A sample to show how tracking works</span>
      </div>

      {/* Card body */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="shrink-0 md:w-56 md:mr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#052698] font-medium text-[16.6px]">TCKU3456789</span>
              <span className="text-[14.6px] px-2 py-0.5 bg-[#052698]/8 text-[#052698] border border-[#052698]/20">In Transit</span>
            </div>
            <p className="text-black text-[16.6px] mt-1">MSC Accra · Maersk Line</p>
            <p className="text-black/80 text-[16.6px] mt-0.5">Shanghai → Tema</p>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[14.6px] text-black/80">
              <span>Shanghai</span>
              <span>Tema</span>
            </div>
            <div className="relative h-1.5 bg-[#052698]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#052698] rounded-full" style={{ width: "68%" }} />
            </div>
            <div className="text-[14.6px] text-black/85 text-center">68% in transit</div>
          </div>

          <div className="shrink-0 md:w-36 md:text-right md:ml-8">
            <p className="text-[#052698] font-heading font-medium text-[16.6px]">Mar 22, 2026</p>
            <p className="text-black/80 text-[16.6px] mt-0.5">6 days remaining</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 flex items-center gap-1.5 text-[14.6px] text-[#052698] hover:text-[#052698]/70 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expanded ? "Hide tracking updates" : "View tracking updates"}
        </button>
      </div>

      {/* Timeline */}
      {expanded && (
        <div className="border-t border-[#052698]/10 px-5 pb-6 pt-5 flex flex-col gap-6">
          {phases.map(({ phase, milestones }, pi) => {
            const phaseHasDone = milestones.some((m) => m.done);
            return (
              <div key={phase}>
                {/* Phase header */}
                <div className={`flex items-center gap-2 mb-3 ${phaseHasDone ? "text-[#052698]" : "text-black/35"}`}>
                  {PHASE_ICONS[phase]}
                  <span className="text-[13px] font-semibold uppercase tracking-widest">{phase}</span>
                  {/* Connector line to next phase */}
                  {pi < phases.length - 1 && (
                    <div className="flex-1 h-px bg-[#052698]/10 ml-1" />
                  )}
                </div>

                {/* Milestones */}
                <div className="flex flex-col">
                  {milestones.map((m, mi) => {
                    const isLast = mi === milestones.length - 1;
                    return (
                      <div key={mi} className="flex gap-3">
                        {/* Left: icon + connector */}
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <MilestoneIcon type={m.icon} done={m.done} current={m.current} />
                            {m.current && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white animate-pulse" />
                            )}
                          </div>
                          {!isLast && (
                            <div className={`w-px mt-1 mb-1 flex-1 ${m.done ? "bg-[#052698]/20" : "border-l border-dashed border-black/15"}`}
                              style={{ minHeight: 24 }} />
                          )}
                        </div>

                        {/* Right: content */}
                        <div className={`pb-4 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-[15.3px] font-medium leading-snug ${m.done ? "text-black" : "text-black/35"}`}>
                              {m.event}
                              {m.current && (
                                <span className="ml-2 text-[12.6px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 font-normal align-middle">
                                  Current
                                </span>
                              )}
                            </p>
                            <span className={`text-[13px] shrink-0 tabular-nums ${m.done ? "text-black/55" : "text-black/25"}`}>
                              {m.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                              className={m.done ? "text-[#052698]/50" : "text-black/25"}>
                              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span className={`text-[13px] ${m.done ? "text-black/55" : "text-black/30"}`}>{m.location}</span>
                          </div>
                          {m.current && (
                            <p className="text-[13px] text-[#052698]/70 mt-1.5 italic">
                              Tydline last received an update from this location
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Tracking email banner ──────────────────────────────────────────────────────

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
        <div className="flex-1 flex items-center justify-between gap-3 bg-white border border-[#052698]/15 px-3 py-2">
          <span className="text-[#052698] font-medium text-[14.6px] truncate">{email}</span>
          <button onClick={copyEmail} className="shrink-0 text-[#052698]/70 hover:text-[#052698] text-[14.6px] transition-colors cursor-pointer">
            {copiedEmail ? "Copied!" : "Copy"}
          </button>
        </div>
        {hasWhatsApp && (
          <div className="flex-1 flex items-center justify-between gap-3 bg-green-50 border border-green-200 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-600 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.531 5.855L.057 23.886a.5.5 0 00.611.61l6.101-1.525A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.187-1.38l-.372-.214-3.853.963.978-3.773-.232-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span className="text-green-700 font-medium text-[14.6px] truncate">{WA_NUMBER}</span>
            </div>
            <button onClick={copyWa} className="shrink-0 text-green-600 hover:text-green-700 text-[14.6px] transition-colors cursor-pointer">
              {copiedWa ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

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
      (s.vessel ?? "").toLowerCase().includes(q) ||
      (s.origin ?? "").toLowerCase().includes(q) ||
      (s.destination ?? "").toLowerCase().includes(q)
    );
  });

  const isEmpty = !loading && shipments.length === 0 && !search;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Upcoming Shipments</h2>
          <p className="text-black/85 text-[18.6px] mt-0.5">
            {loading
              ? "Loading…"
              : isEmpty
              ? "No active shipments yet — here's a preview of how tracking works"
              : `${shipments.length} active container${shipments.length !== 1 ? "s" : ""} arriving within 30 days`}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[16.6px] px-4 py-3">{error}</div>
      )}

      {/* Tracking email info */}
      {trackingEmail && <TrackingEmailBanner email={trackingEmail} hasWhatsApp={hasWhatsApp} />}

      {/* Search — only shown when there are real shipments */}
      {!isEmpty && (
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
      )}

      {/* Shipment cards */}
      {loading ? (
        <div className="text-[16.6px] text-black/85 text-center py-12">Loading…</div>
      ) : isEmpty ? (
        <DemoShipment />
      ) : filtered.length === 0 ? (
        <div className="text-[16.6px] text-black/85 text-center py-12">No results match your search.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const label = displayStatus(s.status);
            return (
              <div key={s.id} className="bg-[#FCFDFF] border border-[#052698]/20 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">

                  <div className="shrink-0 md:w-56 md:mr-8">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#052698] font-medium text-[16.6px]">{s.id}</span>
                      <span className={`text-[14.6px] px-2 py-0.5 ${statusStyles[label] ?? "bg-black/5 text-black/80"}`}>{label}</span>
                    </div>
                    <p className="text-black text-[16.6px] mt-1">{s.vessel} · {s.line}</p>
                    <p className="text-black/80 text-[16.6px] mt-0.5">{s.origin} → {s.destination}</p>
                  </div>

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
