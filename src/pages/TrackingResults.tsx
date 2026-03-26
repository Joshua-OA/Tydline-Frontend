import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useApp, type SelectedPackage } from "../store/appContext";
import Header from "../layouts/Header";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

const mockShipments = [
  { id: "MSKU7234891", vessel: "MSC DIANA", line: "MSC", origin: "Shanghai, CN", destination: "Rotterdam, NL", eta: "Mar 24, 2026", daysLeft: 6, status: "On Time", progress: 82 },
  { id: "HLCU4521037", vessel: "EVER GOLDEN", line: "Evergreen", origin: "Busan, KR", destination: "Hamburg, DE", eta: "Mar 26, 2026", daysLeft: 8, status: "Delayed", progress: 61 },
  { id: "CMAU1983204", vessel: "CMA CGM MARCO POLO", line: "CMA CGM", origin: "Singapore, SG", destination: "Felixstowe, GB", eta: "Mar 29, 2026", daysLeft: 11, status: "On Time", progress: 54 },
  { id: "OOLU6782341", vessel: "OOCL GERMANY", line: "OOCL", origin: "Ningbo, CN", destination: "Antwerp, BE", eta: "Apr 2, 2026", daysLeft: 15, status: "In Transit", progress: 38 },
  { id: "MAEU9043156", vessel: "MAERSK EINDHOVEN", line: "Maersk", origin: "Tanjung Pelepas, MY", destination: "Bremerhaven, DE", eta: "Apr 5, 2026", daysLeft: 18, status: "On Time", progress: 27 },
  { id: "ZIMU3421890", vessel: "ZIM KINGSTON", line: "ZIM", origin: "Haifa, IL", destination: "New York, US", eta: "Apr 9, 2026", daysLeft: 22, status: "In Transit", progress: 15 },
];

const statusStyles: Record<string, string> = {
  "On Time": "bg-green-50 text-green-700 border border-green-200",
  Delayed: "bg-red-50 text-red-600 border border-red-200",
  "In Transit": "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
};

type Step = "result" | "packages" | "auth" | "check-email";

function ShipIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18M5 17V9l4-4h6l4 4v8" /><circle cx="7.5" cy="19.5" r="1.5" /><circle cx="16.5" cy="19.5" r="1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function EmailIcon({ size = 14, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={muted ? "#052698" : "#052698"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity={muted ? 0.35 : 1}>
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 14, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity={muted ? 0.35 : 1}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ERPIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  );
}

function ChannelBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 border border-[#052698]/15 bg-white px-2 py-1 text-sm text-[#052698] font-medium">
      {icon}{label}
    </span>
  );
}

export default function TrackingResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setSelectedPackage, selectedPackage } = useApp();

  const query = params.get("q") ?? "";

  function goToStep(s: Step, extra = "") {
    navigate(`/track?q=${encodeURIComponent(query)}&step=${s}${extra}`);
  }
  const q = query.toUpperCase();
  const foundShipment = mockShipments.find(
    (s) =>
      s.id.includes(q) ||
      s.vessel.includes(q) ||
      s.origin.toUpperCase().includes(q) ||
      s.destination.toUpperCase().includes(q)
  );
  const isUnknownBl = !foundShipment;
  const shipment = foundShipment ?? mockShipments[0];

  const stepParam = params.get("step") as Step | null;
  const isRetry = stepParam === "auth" && params.get("retry") === "true";
  const step: Step = (["packages", "auth", "check-email"].includes(stepParam ?? "") ? stepParam! : "result");
  const [isLoading, setIsLoading] = useState(step === "result");
  const [starterChannel, setStarterChannel] = useState<"email" | "whatsapp" | null>(null);
  const [channelError, setChannelError] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [submittedShipmentId, setSubmittedShipmentId] = useState<string | null>(null);
  const [realShipment, setRealShipment] = useState<import("../services/api").Shipment | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // When the fallback screen shows, register the shipment on the backend,
  // then poll until real tracking data (vessel) is available.
  useEffect(() => {
    if (!isLoading && isUnknownBl && query) {
      let cancelled = false;
      api.submitShipment({ bill_of_lading: query })
        .then((res) => {
          if (cancelled) return;
          setSubmittedShipmentId(res.id);
          // Poll the shipment until vessel data appears (max ~10 s)
          let attempts = 0;
          function poll() {
            if (cancelled) return;
            api.getShipment(res.id)
              .then((s) => {
                if (cancelled) return;
                if (s.vessel || s.origin || s.destination) {
                  setRealShipment(s);
                } else if (attempts < 5) {
                  attempts++;
                  setTimeout(poll, 2000);
                }
              })
              .catch(() => {});
          }
          setTimeout(poll, 1500);
        })
        .catch(() => {
          // Not logged in or other error — notify button will show error if id is missing
        });
      return () => { cancelled = true; };
    }
  }, [isLoading, isUnknownBl, query]);

  function handleSelectPlan(pkg: SelectedPackage) {
    setSelectedPackage(pkg);
    localStorage.setItem("tydline_tracking_query", query);
    goToStep("auth");
  }

  function handleStarterSelect() {
    if (!starterChannel) {
      setChannelError("Please choose a notification channel before continuing.");
      return;
    }
    setChannelError("");
    handleSelectPlan({
      name: `Starter — ${starterChannel === "email" ? "Email" : "WhatsApp"}`,
      amount: "50.00",
      label: "$50 / mo",
      plan: "starter",
    });
  }

  function handleSelectCustom() {
    const amt = customAmount.trim();
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) return;
    handleSelectPlan({ name: "Custom", amount: Number(amt).toFixed(2), label: `$${amt} / mo`, plan: "custom" });
  }

  async function handleRequestLink() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const metadata: Record<string, string> = {};
      if (query) metadata.tracking_query = query;
      if (selectedPackage) {
        metadata.plan = selectedPackage.plan;
        metadata.plan_name = selectedPackage.name;
        metadata.plan_amount = selectedPackage.amount;
        metadata.plan_label = selectedPackage.label;
      }
      localStorage.setItem("tydline_auth_email", email.trim());
      await api.requestLink(email.trim(), "", Object.keys(metadata).length ? metadata : undefined);
      goToStep("check-email");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNotifySubmit() {
    const email = notifyEmail.trim();
    if (!email) {
      setNotifyError("Please enter your email address.");
      return;
    }
    if (!submittedShipmentId) {
      setNotifyError("Something went wrong, please try again.");
      return;
    }
    setNotifyError("");
    setNotifyLoading(true);
    try {
      await api.notifyMe(submittedShipmentId, email);
      setNotifySubmitted(true);
    } catch (e) {
      const msg = (e as Error).message ?? "";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        navigate("/");
        return;
      }
      setNotifyError("Something went wrong, please try again.");
    } finally {
      setNotifyLoading(false);
    }
  }

  function backFromStep() {
    navigate(-1);
  }

  return (
    <div className="w-screen h-screen bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full h-full bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30 overflow-hidden"
        style={{ backgroundImage: brickSvg }}
      >
        {/* Header */}
        <Header />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10">

            {/* ── LOADING ── */}
            {step === "result" && isLoading && (
              <div className="w-full max-w-3xl flex flex-col gap-6 mt-2">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-28 bg-[#052698]/8 animate-pulse" />
                  <div className="h-6 w-52 bg-[#052698]/10 animate-pulse" />
                </div>
                <div className="bg-[#FCFDFF] border border-[#052698]/10 p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-5 animate-pulse">
                    <div className="shrink-0 md:w-56 md:mr-8 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-28 bg-[#052698]/10" />
                        <div className="h-4 w-14 bg-[#052698]/8" />
                      </div>
                      <div className="h-3 w-40 bg-[#052698]/8" />
                      <div className="h-3 w-36 bg-[#052698]/8" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-10 bg-[#052698]/8" />
                        <div className="h-3 w-10 bg-[#052698]/8" />
                      </div>
                      <div className="h-1.5 bg-[#052698]/10 w-full" />
                      <div className="h-3 w-20 bg-[#052698]/8 mx-auto" />
                    </div>
                    <div className="shrink-0 md:w-36 md:text-right md:ml-8 flex flex-col gap-2 md:items-end">
                      <div className="h-4 w-24 bg-[#052698]/10" />
                      <div className="h-3 w-20 bg-[#052698]/8" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-[#052698]/20 border-t-[#052698] rounded-full animate-spin shrink-0" />
                  <span className="text-sm text-black/40">
                    Fetching tracking data for <span className="text-[#052698]/60">{query}</span>…
                  </span>
                </div>
              </div>
            )}

            {/* ── REAL DATA RETURNED — show live tracking card ── */}
            {step === "result" && !isLoading && isUnknownBl && realShipment && (
              <div className="w-full max-w-3xl flex flex-col gap-4">
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-widest mb-1">Tracking</p>
                  <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">{query}</h2>
                </div>
                <div className="bg-[#FCFDFF] border border-[#052698]/20 p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="shrink-0 md:w-56 md:mr-8">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#052698] font-medium text-[16.6px]">{realShipment.container_number ?? realShipment.bill_of_lading}</span>
                        <span className="text-[14.6px] px-2 py-0.5 bg-[#052698]/8 text-[#052698] border border-[#052698]/20">{realShipment.status}</span>
                      </div>
                      <p className="text-black text-[16.6px] mt-1">{realShipment.vessel} · {realShipment.line}</p>
                      <p className="text-black/80 text-[16.6px] mt-0.5">{realShipment.origin} → {realShipment.destination}</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[14.6px] text-black/80">
                        <span>{realShipment.origin}</span>
                        <span>{realShipment.destination}</span>
                      </div>
                      <div className="relative h-1.5 bg-[#052698]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#052698] rounded-full" style={{ width: `${realShipment.progress}%` }} />
                      </div>
                      <div className="text-[14.6px] text-black/85 text-center">{realShipment.progress}% in transit</div>
                    </div>
                    {realShipment.eta && (
                      <div className="shrink-0 md:w-36 md:text-right md:ml-8">
                        <p className="text-[#052698] font-heading font-medium text-[16.6px]">
                          {new Date(realShipment.eta).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-black/80 text-[16.6px] mt-0.5">{realShipment.days_left} days remaining</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-black/45 text-center">
                  Live tracking data · Log in to your dashboard for full details and notifications
                </p>
              </div>
            )}

            {/* ── NO MATCH — notify me ── */}
            {step === "result" && !isLoading && isUnknownBl && !realShipment && (
              <div className="w-full max-w-md flex flex-col gap-6">
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-widest mb-1">Tracking</p>
                  <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">{query}</h2>
                </div>

                {!notifySubmitted ? (
                  <div className="border border-[#052698]/20 bg-[#FCFDFF] p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[#052698] font-heading font-bold text-base">We're on it</h3>
                      <p className="text-sm text-black/65 leading-relaxed">
                        We've queued <span className="text-[#052698] font-medium">{query}</span> for tracking. Since this
                        is a new shipment, it may take a short while to pull the latest data. Enter your email and
                        we'll notify you the moment it's ready.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-black">Your email</label>
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => { setNotifyEmail(e.target.value); setNotifyError(""); }}
                        placeholder="you@company.com"
                        className="border border-[#052698]/25 px-4 py-2.5 text-sm text-[#545454] bg-white outline-none w-full"
                      />
                      {notifyError && <p className="text-red-500 text-xs">{notifyError}</p>}
                    </div>
                    <button
                      onClick={handleNotifySubmit}
                      disabled={notifyLoading}
                      className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {notifyLoading ? "Submitting…" : "Notify me →"}
                    </button>
                  </div>
                ) : (
                  <div className="border border-[#052698]/20 bg-[#FCFDFF] p-6 flex flex-col items-center gap-4 text-center">
                    <div className="w-10 h-10 border border-[#052698]/20 flex items-center justify-center bg-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[#052698] font-heading font-bold text-base">You're on the list</h3>
                      <p className="text-sm text-black/65 leading-relaxed">
                        Got it — we'll email you at{" "}
                        <span className="text-[#052698] font-medium">{notifyEmail}</span> the moment tracking data is ready.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── RESULT ── */}
            {step === "result" && !isLoading && !isUnknownBl && (
              <div className="w-full max-w-3xl flex flex-col gap-6">
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-widest mb-1">Tracking result for</p>
                  <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">{query}</h2>
                </div>

                <div className="bg-[#FCFDFF] border border-[#052698]/20 p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="shrink-0 md:w-56 md:mr-8">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#052698] font-medium text-sm">{shipment.id}</span>
                        <span className={`text-xs px-2 py-0.5 ${statusStyles[shipment.status]}`}>{shipment.status}</span>
                      </div>
                      <p className="text-black text-sm mt-1">{shipment.vessel} · {shipment.line}</p>
                      <p className="text-black/60 text-sm mt-0.5">{shipment.origin} → {shipment.destination}</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs text-black/60">
                        <span>Origin</span>
                        <span>Destination</span>
                      </div>
                      <div className="h-1.5 bg-[#052698]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#052698] rounded-full" style={{ width: `${shipment.progress}%` }} />
                      </div>
                      <div className="text-xs text-black/50 text-center">{shipment.progress}% in transit</div>
                    </div>
                    <div className="shrink-0 md:w-36 md:text-right md:ml-8">
                      <p className="text-[#052698] font-heading font-medium text-sm">{shipment.eta}</p>
                      <p className="text-black/60 text-sm mt-0.5">{shipment.daysLeft} days remaining</p>
                    </div>
                  </div>
                </div>

                <div className="border border-[#052698]/25 bg-[#FCFDFF] p-6 md:p-8 flex flex-col gap-5">
                  <div>
                    <h3 className="text-[#052698] text-lg font-heading font-bold tracking-tight">
                      Get automatic tracking notifications
                    </h3>
                    <p className="text-black/60 text-sm mt-1 leading-relaxed">
                      Receive alerts at every milestone — before things go wrong. Stay ahead of delays, ETA changes, and arrival windows.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Email", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                      { label: "WhatsApp", d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
                      { label: "ERP / TMS", d: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
                    ].map(({ label, d }) => (
                      <div key={label} className="border border-[#052698]/15 bg-white flex flex-col items-center gap-2 py-4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d={d} />
                        </svg>
                        <span className="text-xs text-[#052698] font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => goToStep("packages")}
                    className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer w-full md:w-auto md:self-start"
                  >
                    Subscribe for notifications →
                  </button>
                </div>
              </div>
            )}

            {/* ── PACKAGES ── */}
            {step === "packages" && (
              <div className="w-full max-w-5xl flex flex-col items-center gap-6">
                {/* Back + heading — back sits directly above */}
                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={backFromStep}
                    className="text-sm text-[#052698]/60 hover:text-[#052698] transition-colors cursor-pointer self-start"
                  >
                    ← Back
                  </button>
                  <div>
                    <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Choose your plan</h2>
                    <p className="text-sm text-black mt-1">Pick the coverage that fits your shipment volume.</p>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

                  {/* Starter */}
                  <div className="flex flex-col border border-[#052698]/20 bg-[#FCFDFF] p-7 gap-5">
                    <div className="flex flex-col gap-3">
                      <p className="text-[#052698] font-heading font-bold text-lg">Starter</p>
                      <p className="text-[#052698] font-heading font-extrabold text-4xl">$50</p>
                      <p className="text-sm text-black/60 -mt-2">per month</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <ChannelBadge icon={<EmailIcon size={11} muted />} label="Email" />
                        <ChannelBadge icon={<WhatsAppIcon size={11} muted />} label="WhatsApp" />
                        <span className="flex items-center text-sm text-black/50 px-1">choose one</span>
                      </div>
                    </div>
                    <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                      <ShipIcon />
                      <span className="text-sm text-[#052698] font-medium">10 shipments / mo</span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {["ETA alerts", "Basic delay alerts", "Single notification channel"].map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-black">
                          <CheckIcon />{f}
                        </li>
                      ))}
                    </ul>

                    {/* Dropdown channel selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-black">Notify me via</label>
                      <div className="relative">
                        <select
                          value={starterChannel ?? ""}
                          onChange={(e) => {
                            setStarterChannel(e.target.value as "email" | "whatsapp");
                            setChannelError("");
                          }}
                          className="w-full border border-[#052698]/25 bg-white px-3 py-2.5 text-sm text-[#545454] appearance-none cursor-pointer outline-none pr-8"
                        >
                          <option value="" disabled>Choose a channel…</option>
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                      </div>
                      {channelError && <p className="text-red-500 text-sm mt-0.5">{channelError}</p>}
                    </div>

                    <button
                      onClick={handleStarterSelect}
                      className="bg-white text-[#052698] text-sm font-medium px-4 py-3 border border-[#052698]/30 hover:bg-[#052698]/5 transition-colors cursor-pointer mt-auto"
                    >
                      Get started
                    </button>
                  </div>

                  {/* Growth */}
                  <div className="flex flex-col border border-[#052698] bg-[#FCFDFF] p-7 gap-5 relative">
                    <span className="absolute -top-px left-5 bg-[#052698] text-white text-[10px] px-2 py-0.5 font-medium tracking-wide">
                      MOST POPULAR
                    </span>
                    <div className="flex flex-col gap-3">
                      <p className="text-[#052698] font-heading font-bold text-lg">Growth</p>
                      <p className="text-[#052698] font-heading font-extrabold text-4xl">$125</p>
                      <p className="text-sm text-black/60 -mt-2">per month</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <ChannelBadge icon={<EmailIcon size={11} />} label="Email" />
                        <ChannelBadge icon={<WhatsAppIcon size={11} />} label="WhatsApp" />
                      </div>
                    </div>
                    <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                      <ShipIcon />
                      <span className="text-sm text-[#052698] font-medium">40 shipments / mo</span>
                    </div>
                    <ul className="flex flex-col gap-2 flex-1">
                      {["Email + WhatsApp alerts", "ETA change alerts", "Custom alert rules", "Multi-user access"].map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-black">
                          <CheckIcon />{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSelectPlan({ name: "Growth", amount: "125.00", label: "$125 / mo", plan: "growth" })}
                      className="bg-[#052698] text-white text-sm font-medium px-4 py-3 border border-[#052698] hover:bg-[#052698]/90 transition-colors cursor-pointer mt-auto"
                    >
                      Get started
                    </button>
                  </div>

                  {/* Pro */}
                  <div className="flex flex-col border border-[#052698]/20 bg-[#FCFDFF] p-7 gap-5">
                    <div className="flex flex-col gap-3">
                      <p className="text-[#052698] font-heading font-bold text-lg">Pro</p>
                      <p className="text-[#052698] font-heading font-extrabold text-4xl">$1,000</p>
                      <p className="text-sm text-black/60 -mt-2">per month</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <ChannelBadge icon={<EmailIcon size={11} />} label="Email" />
                        <ChannelBadge icon={<WhatsAppIcon size={11} />} label="WhatsApp" />
                        <ChannelBadge icon={<ERPIcon size={11} />} label="ERP" />
                      </div>
                    </div>
                    <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                      <ShipIcon />
                      <span className="text-sm text-[#052698] font-medium">450 shipments / mo</span>
                    </div>
                    <ul className="flex flex-col gap-2 flex-1">
                      {["Email + WhatsApp + ERP", "All alert types", "ERP / TMS integration"].map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-black">
                          <CheckIcon />{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSelectPlan({ name: "Pro", amount: "1000.00", label: "$1,000 / mo", plan: "pro" })}
                      className="bg-white text-[#052698] text-sm font-medium px-4 py-3 border border-[#052698]/30 hover:bg-[#052698]/5 transition-colors cursor-pointer mt-auto"
                    >
                      Get started
                    </button>
                  </div>
                </div>

                {/* Custom amount bar — simple input at the bottom */}
                <div className="border border-[#052698]/15 bg-[#FCFDFF] px-6 py-5 flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="flex items-start gap-3 flex-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 opacity-60">
                      <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#052698]">Need a custom volume?</p>
                      <p className="text-xs text-black/50 mt-0.5">Enter your monthly budget and we'll tailor a plan.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center border border-[#052698]/25 bg-white w-full sm:w-40">
                      <span className="pl-3 text-sm text-black/40 select-none">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder="Amount"
                        className="flex-1 py-2.5 px-2 text-sm text-[#545454] bg-transparent outline-none w-0"
                      />
                    </div>
                    <button
                      onClick={handleSelectCustom}
                      disabled={!customAmount || isNaN(Number(customAmount)) || Number(customAmount) <= 0}
                      className="bg-[#052698] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap border border-[#052698]"
                    >
                      Get started →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── AUTH ── */}
            {step === "auth" && (
              <div className="w-full max-w-md flex flex-col gap-6">
                {!isRetry && (
                  <button
                    onClick={backFromStep}
                    className="text-sm text-[#052698]/60 hover:text-[#052698] transition-colors cursor-pointer self-start"
                  >
                    ← Back
                  </button>
                )}
                {isRetry && (
                  <div className="border border-[#052698]/15 bg-[#FCFDFF] px-4 py-3 text-sm text-black/70 leading-relaxed">
                    Sorry, that link has expired. Please request a new one below.
                  </div>
                )}
                <div>
                  <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Get started</h2>
                  <p className="text-sm text-black mt-1">We'll send a secure login link to your email — no password needed.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">Work email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={submitting}
                      className="border-[#052698] border-[0.45px] px-4 py-2.5 text-[#545454] bg-white text-sm w-full disabled:opacity-50"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    onClick={handleRequestLink}
                    disabled={submitting}
                    className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                    {submitting ? "Sending…" : "Send login link →"}
                  </button>
                </div>
                <p className="text-sm text-black/60">By continuing you agree to Tydline's Terms of Service and Privacy Policy.</p>
              </div>
            )}

            {/* ── CHECK EMAIL ── */}
            {step === "check-email" && (
              <div className="w-full max-w-md flex flex-col items-center gap-4 text-center pt-4">
                <div className="w-12 h-12 border border-[#052698]/20 flex items-center justify-center bg-[#FCFDFF]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-[#052698] text-xl font-heading font-extrabold tracking-tight">Check your email</h2>
                  <p className="text-sm text-black leading-relaxed">
                    We sent a secure login link to{" "}
                    <span className="text-[#052698] font-medium">{email}</span>.
                  </p>
                  <p className="text-sm text-black leading-relaxed">
                    Click the link to continue to payment.
                  </p>
                </div>
                <div className="border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4 text-sm text-black text-left w-full">
                  Didn't receive it? Check your spam folder, or{" "}
                  <button onClick={() => goToStep("auth")} className="text-[#052698] underline cursor-pointer">
                    try a different email
                  </button>
                  .
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <footer className="border-t border-[#052698]/15 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
            <p className="text-sm">© {new Date().getFullYear()} Tydline. All rights reserved.</p>
            <a href="mailto:hello@tydline.com" className="text-sm hover:text-[#052698] transition-colors">
              hello@tydline.com
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
