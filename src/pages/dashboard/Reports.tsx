import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { api, type ShipmentsResponse, type Shipment } from "../../services/api";
import { useApp } from "../../store/appContext";

const WA_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "+233 59 864 3872";

// ── Types & helpers ────────────────────────────────────────────────────────────

function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return s;
  }
}

type FilterKey = "all" | "active" | "completed" | "pending" | "on_time" | "delayed" | "in_transit";

const statusLabel: Record<string, string> = {
  on_time: "On Time",
  delayed: "Delayed",
  in_transit: "In Transit",
  pending_approval: "Pending",
};

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  "Delayed": "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
  "Pending": "bg-amber-50 text-amber-700 border border-amber-200",
};

function displayStatus(raw: string) {
  return statusLabel[raw] ?? raw;
}

const EMPTY: ShipmentsResponse = {
  pending_approval: [], active: [], completed: [],
  total_pending_approval: 0, total_active: 0, total_completed: 0,
};

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-2">
      <span className="text-[14.6px] text-black/80 uppercase tracking-widest">{label}</span>
      <span className="text-[32.6px] font-heading font-bold text-[#052698]">{value}</span>
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
        <p className="text-[#052698] font-heading font-bold text-[16.6px]">Start tracking a shipment</p>
        <p className="text-black/85 text-[14.6px] mt-0.5">
          Forward or CC your shipment confirmation email to your tracking address — we'll pick it up and start tracking automatically.
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

// ── Export ─────────────────────────────────────────────────────────────────────

async function exportToExcel(shipments: Shipment[]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Tydline";
  wb.created = new Date();

  const ws = wb.addWorksheet("Shipments");

  ws.columns = [
    { header: "Container ID", key: "id", width: 22 },
    { header: "Vessel", key: "vessel", width: 26 },
    { header: "Line", key: "line", width: 16 },
    { header: "Origin", key: "origin", width: 22 },
    { header: "Destination", key: "destination", width: 22 },
    { header: "ETA", key: "eta", width: 16 },
    { header: "Days Left", key: "days_left", width: 12 },
    { header: "Status", key: "status", width: 16 },
    { header: "Progress", key: "progress", width: 12 },
  ];

  // Style header row
  ws.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF052698" } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF052698" } },
    };
  });
  ws.getRow(1).height = 24;

  // Add data rows
  shipments.forEach((s, i) => {
    const row = ws.addRow({
      id: s.id,
      vessel: s.vessel,
      line: s.line,
      origin: s.origin,
      destination: s.destination,
      eta: s.eta,
      days_left: s.days_left,
      status: displayStatus(s.status),
      progress: `${s.progress}%`,
    });
    // Alternate row shading
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFF" } };
      });
    }
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tydline-shipments-${new Date().toISOString().split("T")[0]}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Filter pills ───────────────────────────────────────────────────────────────

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "on_time", label: "On Time" },
  { key: "delayed", label: "Delayed" },
  { key: "in_transit", label: "In Transit" },
  { key: "completed", label: "Completed" },
  { key: "pending", label: "Pending Approval" },
];

// ── Reports page ───────────────────────────────────────────────────────────────

function Reports() {
  const { trackingEmail } = useApp();
  const [plan, setPlan] = useState<string | null>(null);
  const hasWhatsApp = plan === null || plan === "growth" || plan === "pro" || plan === "custom";

  const [data, setData] = useState<ShipmentsResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  // Manual tracking input
  const [trackInput, setTrackInput] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackSuccess, setTrackSuccess] = useState<string | null>(null);
  const [submittedShipment, setSubmittedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    api.getPlan()
      .then((d) => { if (d?.plan) setPlan(d.plan); })
      .catch(() => {});
  }, []);

  function loadShipments() {
    return api.getShipments()
      .then((res) => {
        setData(res ?? EMPTY);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadShipments();
  }, []);

  async function handleTrackSubmit() {
    const val = trackInput.trim();
    if (!val) return;
    setTrackLoading(true);
    setTrackError(null);
    setTrackSuccess(null);
    setSubmittedShipment(null);
    try {
      const result = await api.submitShipment({ bill_of_lading: val });
      // Fetch full details for the submitted shipment
      const detail = await api.getShipment(result.id);
      setSubmittedShipment(detail);
      setTrackSuccess(`Shipment "${val}" submitted — tracking started.`);
      setTrackInput("");
      // Refresh the shipments list
      setLoading(true);
      loadShipments();
    } catch (e) {
      setTrackError((e as Error).message);
    } finally {
      setTrackLoading(false);
    }
  }

  const total = data.total_pending_approval + data.total_active + data.total_completed;

  const allShipments: Shipment[] = [
    ...data.pending_approval,
    ...data.active,
    ...data.completed,
  ];

  // Apply status filter
  const byFilter: Shipment[] = (() => {
    switch (filter) {
      case "active":    return data.active;
      case "completed": return data.completed;
      case "pending":   return data.pending_approval;
      case "on_time":   return allShipments.filter((s) => s.status === "on_time");
      case "delayed":   return allShipments.filter((s) => s.status === "delayed");
      case "in_transit":return allShipments.filter((s) => s.status === "in_transit");
      default:          return allShipments;
    }
  })();

  // Apply search
  const filtered = byFilter.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      (s.vessel ?? "").toLowerCase().includes(q) ||
      (s.origin ?? "").toLowerCase().includes(q) ||
      (s.destination ?? "").toLowerCase().includes(q)
    );
  });

  async function handleExport() {
    setExporting(true);
    try {
      await exportToExcel(filtered.length ? filtered : allShipments);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Reports</h2>
          <p className="text-black/85 text-[18.6px] mt-0.5">Overview</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading}
          className="border border-[#052698]/30 text-[#052698] text-[16.6px] px-4 py-2 hover:bg-[#052698]/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? "Exporting…" : "Export Excel"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[16.6px] px-4 py-3">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Shipments" value={loading ? "—" : total} />
        <StatCard label="Active" value={loading ? "—" : data.total_active} />
        <StatCard label="Completed" value={loading ? "—" : data.total_completed} />
        <StatCard label="Pending Approval" value={loading ? "—" : data.total_pending_approval} />
      </div>

      {/* Tracking email info */}
      {trackingEmail && <TrackingEmailBanner email={trackingEmail} hasWhatsApp={hasWhatsApp} />}

      {/* Manual tracking input */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 px-5 py-4 flex flex-col gap-3">
        <div>
          <p className="text-[#052698] font-heading font-bold text-[16.6px]">Track a shipment manually</p>
          <p className="text-black/85 text-[14.6px] mt-0.5">Enter a Bill of Lading or container number to start tracking it directly.</p>
        </div>
        {trackError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[14.6px] px-3 py-2">{trackError}</div>
        )}
        {trackSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[14.6px] px-3 py-2">{trackSuccess}</div>
        )}
        {submittedShipment && (
          <div className="border border-[#052698]/15 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-[14.6px]">
            <span className="text-[#052698] font-medium">{submittedShipment.bill_of_lading ?? submittedShipment.container_number}</span>
            {submittedShipment.vessel && <span className="text-black/80">· {submittedShipment.vessel}</span>}
            {submittedShipment.origin && submittedShipment.destination && (
              <span className="text-black/80">· {submittedShipment.origin} → {submittedShipment.destination}</span>
            )}
            {submittedShipment.eta && <span className="text-black/80">· ETA {fmtDate(submittedShipment.eta)}</span>}
            <span className="ml-auto text-[13px] px-2 py-0.5 bg-[#052698]/8 text-[#052698] border border-[#052698]/20">{submittedShipment.status}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={trackInput}
            onChange={(e) => { setTrackInput(e.target.value); setTrackError(null); setTrackSuccess(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleTrackSubmit()}
            placeholder="e.g. MSKU7234891 or COSU1234567"
            className="flex-1 border border-[#052698]/25 px-3 py-2.5 text-[15.6px] text-black placeholder-black/30 bg-white focus:outline-none focus:border-[#052698]/50"
          />
          <button
            onClick={handleTrackSubmit}
            disabled={trackLoading || !trackInput.trim()}
            className="bg-[#052698] text-white text-[15.6px] font-medium px-5 py-2.5 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {trackLoading ? "Submitting…" : "Track"}
          </button>
        </div>
      </div>

      {/* Shipments table with filters */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20">
        <div className="px-5 py-4 border-b border-[#052698]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[#052698] font-heading font-bold text-[18.6px]">Shipments</h3>
            {/* Search */}
            <div className="flex-1 max-w-xs border border-[#052698]/20 flex items-center px-3 gap-2 bg-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="2" opacity="0.4">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, vessel, route…"
                className="flex-1 py-2 text-[14.6px] text-black bg-transparent placeholder-black/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-black/85 hover:text-black/80 cursor-pointer text-[14.6px]">✕</button>
              )}
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-[14.6px] px-3 py-1 border transition-colors cursor-pointer ${
                  filter === key
                    ? "bg-[#052698] text-white border-[#052698]"
                    : "text-black/80 border-[#052698]/20 hover:border-[#052698]/40 hover:text-[#052698]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-[16.6px] text-black/85 text-center">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-[16.6px] text-black/85 text-center">
            {search || filter !== "all" ? "No shipments match your filters." : "No shipments yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[16.6px]">
              <thead>
                <tr className="border-b border-[#052698]/10">
                  <th className="text-left px-5 py-3 text-[14.6px] text-black/85 font-body font-normal uppercase tracking-wider">Bill of Lading</th>
                  <th className="text-left px-5 py-3 text-[14.6px] text-black/85 font-body font-normal uppercase tracking-wider hidden md:table-cell">Vessel</th>
                  <th className="text-left px-5 py-3 text-[14.6px] text-black/85 font-body font-normal uppercase tracking-wider hidden md:table-cell">Route</th>
                  <th className="text-left px-5 py-3 text-[14.6px] text-black/85 font-body font-normal uppercase tracking-wider">ETA</th>
                  <th className="text-left px-5 py-3 text-[14.6px] text-black/85 font-body font-normal uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#052698]/8">
                {filtered.map((row) => {
                  const label = displayStatus(row.status);
                  return (
                    <tr key={row.id} className="hover:bg-[#052698]/3 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-[#052698] font-medium text-[16.6px]">{row.bill_of_lading ?? row.id}</p>
                        {row.container_number && (
                          <p className="text-[13px] text-black/70 mt-0.5">{row.container_number}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-black text-[16.6px] hidden md:table-cell">{row.vessel}</td>
                      <td className="px-5 py-3.5 text-black/85 text-[16.6px] hidden md:table-cell">{row.origin} → {row.destination}</td>
                      <td className="px-5 py-3.5 text-black text-[16.6px]">{fmtDate(row.eta)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[14.6px] px-2 py-1 ${statusStyles[label] ?? "bg-black/5 text-black/80 border border-black/10"}`}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#052698]/8 text-[14.6px] text-black/80">
              Showing {filtered.length} of {allShipments.length} shipment{allShipments.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
