type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
};

function StatCard({ label, value, delta, deltaUp }: StatCardProps) {
  return (
    <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-2">
      <span className="text-xs text-black/60 uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-heading font-bold text-[#052698]">{value}</span>
      {delta && (
        <span className={`text-xs ${deltaUp ? "text-green-600" : "text-red-500"}`}>
          {deltaUp ? "▲" : "▼"} {delta} vs last month
        </span>
      )}
    </div>
  );
}

const recentActivity = [
  { id: "MSKU7234891", vessel: "MSC DIANA", route: "Shanghai → Rotterdam", eta: "Mar 24, 2026", status: "On Time" },
  { id: "HLCU4521037", vessel: "EVER GOLDEN", route: "Busan → Hamburg", eta: "Mar 26, 2026", status: "Delayed" },
  { id: "CMAU1983204", vessel: "CMA CGM MARCO POLO", route: "Singapore → Felixstowe", eta: "Mar 29, 2026", status: "On Time" },
  { id: "OOLU6782341", vessel: "OOCL GERMANY", route: "Ningbo → Antwerp", eta: "Apr 2, 2026", status: "In Transit" },
  { id: "MAEU9043156", vessel: "MAERSK EINDHOVEN", route: "Tanjung Pelepas → Bremerhaven", eta: "Apr 5, 2026", status: "On Time" },
];

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  "Delayed": "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
};

function Reports() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Reports</h2>
          <p className="text-black/70 text-base mt-0.5">March 2026 — Overview</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-[#052698]/30 text-[#052698] text-sm px-4 py-2 hover:bg-[#052698]/5 transition-colors cursor-pointer">
            Export CSV
          </button>
          <button className="bg-[#052698] text-white text-sm px-4 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Shipments" value="142" delta="12%" deltaUp />
        <StatCard label="On Time" value="118" delta="4%" deltaUp />
        <StatCard label="Delayed" value="16" delta="2%" deltaUp={false} />
        <StatCard label="In Transit" value="8" />
      </div>

      {/* Chart placeholder */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#052698] font-heading font-bold text-base">Shipment Volume — Last 6 Months</h3>
          <span className="text-sm text-black/50">Oct 2025 – Mar 2026</span>
        </div>
        {/* Bar chart visual */}
        <div className="flex items-end gap-3 h-28 px-2">
          {[68, 82, 94, 110, 127, 142].map((val, i) => {
            const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
            const pct = Math.round((val / 142) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-black/50">{val}</span>
                <div
                  className="w-full bg-[#052698]/80"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] text-black/60">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#052698]/10">
          <h3 className="text-[#052698] font-heading font-bold text-base">Recent Activity</h3>
          <button className="text-sm text-[#052698] hover:underline cursor-pointer">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#052698]/10">
                <th className="text-left px-5 py-3 text-sm text-black/50 font-body font-normal uppercase tracking-wider">Container ID</th>
                <th className="text-left px-5 py-3 text-sm text-black/50 font-body font-normal uppercase tracking-wider">Vessel</th>
                <th className="text-left px-5 py-3 text-sm text-black/50 font-body font-normal uppercase tracking-wider hidden md:table-cell">Route</th>
                <th className="text-left px-5 py-3 text-sm text-black/50 font-body font-normal uppercase tracking-wider">ETA</th>
                <th className="text-left px-5 py-3 text-sm text-black/50 font-body font-normal uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#052698]/8">
              {recentActivity.map((row) => (
                <tr key={row.id} className="hover:bg-[#052698]/3 transition-colors">
                  <td className="px-5 py-3.5 text-[#052698] font-medium text-sm">{row.id}</td>
                  <td className="px-5 py-3.5 text-black text-sm">{row.vessel}</td>
                  <td className="px-5 py-3.5 text-black/70 text-sm hidden md:table-cell">{row.route}</td>
                  <td className="px-5 py-3.5 text-black text-sm">{row.eta}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
