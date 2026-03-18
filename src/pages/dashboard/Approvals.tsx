import { useState } from "react";

type ApprovalStatus = "pending" | "approved" | "rejected";

type Approval = {
  id: string;
  type: string;
  container: string;
  requestedBy: string;
  date: string;
  description: string;
  status: ApprovalStatus;
};

const initialApprovals: Approval[] = [
  {
    id: "APR-2026-041",
    type: "Demurrage Waiver",
    container: "MSKU7234891",
    requestedBy: "Logistics Team",
    date: "Mar 17, 2026",
    description: "Requesting waiver for 4-day demurrage charge at Rotterdam port due to vessel delay beyond shipper control.",
    status: "pending",
  },
  {
    id: "APR-2026-040",
    type: "Custom Clearance",
    container: "HLCU4521037",
    requestedBy: "Import Ops",
    date: "Mar 16, 2026",
    description: "Pre-clearance approval needed for hazardous cargo category B before vessel arrival at Hamburg.",
    status: "pending",
  },
  {
    id: "APR-2026-039",
    type: "Route Amendment",
    container: "CMAU1983204",
    requestedBy: "Freight Forwarder",
    date: "Mar 15, 2026",
    description: "Transshipment port change from Port Klang to Tanjung Pelepas due to capacity constraints.",
    status: "approved",
  },
  {
    id: "APR-2026-038",
    type: "Detention Extension",
    container: "OOLU6782341",
    requestedBy: "Warehouse Ops",
    date: "Mar 14, 2026",
    description: "Requesting 7-day detention period extension for container OOLU6782341 pending warehouse availability.",
    status: "rejected",
  },
  {
    id: "APR-2026-037",
    type: "Overweight Declaration",
    container: "MAEU9043156",
    requestedBy: "Compliance",
    date: "Mar 13, 2026",
    description: "VGM re-submission required — initial declaration was 320kg below actual verified gross mass.",
    status: "pending",
  },
];

const statusStyles: Record<ApprovalStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
};

const statusLabel: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);

  function handleApprove(id: string) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));
  }

  function handleReject(id: string) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)));
  }

  const pending = approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div>
        <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Approvals</h2>
        <p className="text-black/70 text-base mt-0.5">
          {pending > 0 ? `${pending} item${pending > 1 ? "s" : ""} awaiting your review` : "All items reviewed"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border border-[#052698]/20 w-fit bg-[#FCFDFF]">
        {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            className="text-sm px-4 py-2 text-black hover:bg-[#052698]/5 hover:text-[#052698] transition-colors first:border-r border-[#052698]/20 cursor-pointer"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Approval items */}
      <div className="flex flex-col gap-3">
        {approvals.map((item) => (
          <div key={item.id} className="bg-[#FCFDFF] border border-[#052698]/20 p-5">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="text-[#052698] font-medium text-sm">{item.id}</span>
                  <span className={`text-xs px-2 py-0.5 ${statusStyles[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-[#052698]/6 text-[#052698]/70 border border-[#052698]/15">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-black/60 mb-2">
                  Container: <span className="text-[#052698] font-medium">{item.container}</span>
                  {" · "}Requested by {item.requestedBy}
                  {" · "}{item.date}
                </p>
                <p className="text-sm text-black/80 leading-relaxed">{item.description}</p>
              </div>

              {/* Actions */}
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="border border-red-200 text-red-600 text-sm px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="bg-[#052698] text-white text-sm px-4 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              )}

              {item.status !== "pending" && (
                <div className="shrink-0">
                  <span className={`text-xs px-3 py-1.5 ${statusStyles[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approvals;
