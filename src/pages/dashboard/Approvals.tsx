import { useState, useEffect } from "react";
import { api, type ApiApproval } from "../../services/api";

function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return s;
  }
}

function Approvals() {
  const [approvals, setApprovals] = useState<ApiApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    api.getApprovals()
      .then((data) => {
        setApprovals(Array.isArray(data) ? data : []);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    setApproving(id);
    setError(null);
    try {
      await api.approveShipment(id);
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setApproving(null);
    }
  }

  const pending = approvals.length;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div>
        <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Approvals</h2>
        <p className="text-black/85 text-[18.6px] mt-0.5">
          {loading ? "Loading…" : pending > 0 ? `${pending} shipment${pending > 1 ? "s" : ""} awaiting approval` : "All shipments approved"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[16.6px] px-4 py-3">{error}</div>
      )}

      {loading ? (
        <div className="text-[16.6px] text-black/85 text-center py-12">Loading…</div>
      ) : approvals.length === 0 ? (
        <div className="bg-[#FCFDFF] border border-[#052698]/20 p-10 text-center">
          <p className="text-black/85 text-[16.6px]">No shipments pending approval.</p>
          <p className="text-black/55 text-[14.6px] mt-1">Submitted shipments are auto-approved after 3 days.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {approvals.map((item) => (
            <div key={item.id} className="bg-[#FCFDFF] border border-[#052698]/20 p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* B/L number — primary identifier */}
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="text-[#052698] font-medium text-[16.6px]">{item.bill_of_lading}</span>
                    <span className="text-[14.6px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Approval
                    </span>
                  </div>

                  {/* Container number — secondary */}
                  <p className="text-[14.6px] text-black/80 mb-1">
                    Container: <span className="font-medium text-black">{item.container_number}</span>
                    {item.carrier && <> · {item.carrier}</>}
                  </p>

                  {/* ETA / dates */}
                  <p className="text-[14.6px] text-black/80">
                    {item.eta
                      ? <>ETA {fmtDate(item.eta)}</>
                      : item.predicted_eta
                      ? <>Predicted ETA {fmtDate(item.predicted_eta)}</>
                      : <>Submitted {fmtDate(item.created_at)}</>
                    }
                    {item.free_days_remaining != null && (
                      <> · {item.free_days_remaining} free days remaining</>
                    )}
                  </p>

                  {item.demurrage_risk && (
                    <p className="text-[13px] text-red-600 mt-1">Demurrage risk: {item.demurrage_risk}</p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={approving === item.id}
                    className="bg-[#052698] text-white text-[16.6px] px-4 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approving === item.id ? "Approving…" : "Approve Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[14.6px] text-black/55">
        Shipments pending approval for more than 3 days are automatically approved by the system.
      </p>
    </div>
  );
}

export default Approvals;
