const shipments = [
  {
    id: "MSKU7234891",
    vessel: "MSC DIANA",
    line: "MSC",
    origin: "Shanghai, CN",
    destination: "Rotterdam, NL",
    eta: "Mar 24, 2026",
    daysLeft: 6,
    status: "On Time",
    progress: 82,
  },
  {
    id: "HLCU4521037",
    vessel: "EVER GOLDEN",
    line: "Evergreen",
    origin: "Busan, KR",
    destination: "Hamburg, DE",
    eta: "Mar 26, 2026",
    daysLeft: 8,
    status: "Delayed",
    progress: 61,
  },
  {
    id: "CMAU1983204",
    vessel: "CMA CGM MARCO POLO",
    line: "CMA CGM",
    origin: "Singapore, SG",
    destination: "Felixstowe, GB",
    eta: "Mar 29, 2026",
    daysLeft: 11,
    status: "On Time",
    progress: 54,
  },
  {
    id: "OOLU6782341",
    vessel: "OOCL GERMANY",
    line: "OOCL",
    origin: "Ningbo, CN",
    destination: "Antwerp, BE",
    eta: "Apr 2, 2026",
    daysLeft: 15,
    status: "In Transit",
    progress: 38,
  },
  {
    id: "MAEU9043156",
    vessel: "MAERSK EINDHOVEN",
    line: "Maersk",
    origin: "Tanjung Pelepas, MY",
    destination: "Bremerhaven, DE",
    eta: "Apr 5, 2026",
    daysLeft: 18,
    status: "On Time",
    progress: 27,
  },
  {
    id: "ZIMU3421890",
    vessel: "ZIM KINGSTON",
    line: "ZIM",
    origin: "Haifa, IL",
    destination: "New York, US",
    eta: "Apr 9, 2026",
    daysLeft: 22,
    status: "In Transit",
    progress: 15,
  },
];

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  "Delayed": "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
};

function UpcomingShipments() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Upcoming Shipments</h2>
          <p className="text-black/70 text-base mt-0.5">{shipments.length} active containers arriving within 30 days</p>
        </div>
        <button className="bg-[#052698] text-white text-sm px-4 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer">
          + Track Container
        </button>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3">
        <div className="flex-1 border border-[#052698]/25 flex items-center px-3 gap-2 bg-[#FCFDFF]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="2" opacity="0.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Search by container ID, vessel or route…"
            className="flex-1 py-2.5 text-sm text-black bg-transparent placeholder-[#545454]/40"
          />
        </div>
        <button className="border border-[#052698]/25 text-[#052698] text-sm px-4 py-2 hover:bg-[#052698]/5 transition-colors cursor-pointer">
          Filter
        </button>
      </div>

      {/* Shipment cards */}
      <div className="flex flex-col gap-3">
        {shipments.map((s) => (
          <div key={s.id} className="bg-[#FCFDFF] border border-[#052698]/20 p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">

              {/* Left: ID + vessel — fixed width, does not grow */}
              <div className="shrink-0 md:w-56 md:mr-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#052698] font-medium text-sm">{s.id}</span>
                  <span className={`text-xs px-2 py-0.5 ${statusStyles[s.status]}`}>{s.status}</span>
                </div>
                <p className="text-black text-sm mt-1">{s.vessel} · {s.line}</p>
                <p className="text-black/60 text-sm mt-0.5">{s.origin} → {s.destination}</p>
              </div>

              {/* Center: progress bar — flex-1, sits between left and right */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-black/60">
                  <span>Origin</span>
                  <span>Destination</span>
                </div>
                <div className="h-1.5 bg-[#052698]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#052698] rounded-full transition-all"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                <div className="text-xs text-black/50 text-center">{s.progress}% in transit</div>
              </div>

              {/* Right: ETA — fixed width, right-aligned */}
              <div className="shrink-0 md:w-36 md:text-right md:ml-8">
                <p className="text-[#052698] font-heading font-medium text-sm">{s.eta}</p>
                <p className="text-black/60 text-sm mt-0.5">{s.daysLeft} days remaining</p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingShipments;
