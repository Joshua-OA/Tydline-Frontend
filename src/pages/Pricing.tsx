import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, type SelectedPackage } from "../store/appContext";
import Header from "../layouts/Header";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;


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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity={muted ? 0.35 : 1}>
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
    <span className="flex items-center gap-1 border border-[#052698]/15 bg-white px-2 py-1 text-xs text-[#052698] font-medium">
      {icon}{label}
    </span>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const { setSelectedPackage, userId } = useApp();

  const [starterChannel, setStarterChannel] = useState<"email" | "whatsapp" | null>(null);
  const [channelError, setChannelError] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  function selectPlan(pkg: SelectedPackage) {
    setSelectedPackage(pkg);
    // If already authenticated (existing user with no subscription), go straight to payment
    navigate(userId ? "/onboarding" : "/track?step=auth");
  }

  function handleStarterSelect() {
    if (!starterChannel) {
      setChannelError("Please choose a notification channel before continuing.");
      return;
    }
    setChannelError("");
    selectPlan({
      name: `Starter — ${starterChannel === "email" ? "Email" : "WhatsApp"}`,
      amount: "50.00",
      label: "$50 / mo",
      plan: "starter",
      channel: starterChannel,
    });
  }

  function handleSelectCustom() {
    const amt = customAmount.trim();
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) return;
    selectPlan({ name: "Custom", amount: Number(amt).toFixed(2), label: `$${amt} / mo`, plan: "custom" });
  }

  return (
    <div className="w-screen min-h-screen bg-[#F9E4D2] lg:px-5">
      <div
        className="w-full min-h-screen bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        <Header />

        <div className="flex flex-col items-center px-6 md:px-10 pt-10 pb-14">
            <div className="w-full max-w-5xl flex flex-col gap-6 mx-auto">

              {/* Heading */}
              <div className="text-center">
                <h1 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">
                  Friendly prices carefully curated for you
                </h1>
                <p className="text-[15px] text-black/80 mt-2">Pick the coverage that fits your shipment volume.</p>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

                {/* Starter */}
                <div className="flex flex-col border border-[#052698]/20 bg-[#FCFDFF] p-6 gap-5">
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[#052698] font-heading font-bold text-lg">Starter</p>
                    <p className="text-[#052698] font-heading font-extrabold text-4xl">$50</p>
                    <p className="text-[15px] text-black/80 -mt-1">per month · $6.25 per container</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <ChannelBadge icon={<EmailIcon size={11} muted />} label="Email" />
                      <ChannelBadge icon={<WhatsAppIcon size={11} muted />} label="WhatsApp" />
                      <span className="flex items-center text-sm text-black/50 px-1">choose one</span>
                    </div>
                  </div>
                  <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                    <ShipIcon />
                    <span className="text-sm text-[#052698] font-medium">8 containers / mo</span>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {[
                      "Email or WhatsApp alerts",
                      "12 milestone notifications per container",
                      "7-day free window alert",
                      "Single user access",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-black">
                        <CheckIcon />{f}
                      </li>
                    ))}
                  </ul>
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

                {/* Standard */}
                <div className="flex flex-col border border-[#052698] bg-[#FCFDFF] p-6 gap-5 relative">
                  <span className="absolute -top-px left-5 bg-[#052698] text-white text-[10px] px-2 py-0.5 font-medium tracking-wide">
                    MOST POPULAR
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[#052698] font-heading font-bold text-lg">Standard</p>
                    <p className="text-[#052698] font-heading font-extrabold text-4xl">$200</p>
                    <p className="text-[15px] text-black/80 -mt-1">per month · $10.00 per container</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <ChannelBadge icon={<EmailIcon size={11} />} label="Email" />
                      <ChannelBadge icon={<WhatsAppIcon size={11} />} label="WhatsApp" />
                    </div>
                  </div>
                  <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                    <ShipIcon />
                    <span className="text-sm text-[#052698] font-medium">20 containers / mo</span>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {[
                      "WhatsApp + Email alerts",
                      "Custom milestone alerts",
                      "21-day UCL forfeiture warning",
                      "Multi-user access (up to 3)",
                      "Monthly demurrage cost report",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-black">
                        <CheckIcon />{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => selectPlan({ name: "Standard", amount: "200.00", label: "$200 / mo", plan: "growth" })}
                    className="bg-[#052698] text-white text-sm font-medium px-4 py-3 border border-[#052698] hover:bg-[#052698]/90 transition-colors cursor-pointer mt-auto"
                  >
                    Get started
                  </button>
                </div>

                {/* Pro */}
                <div className="flex flex-col border border-[#052698]/20 bg-[#FCFDFF] p-6 gap-5">
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[#052698] font-heading font-bold text-lg">Pro</p>
                    <p className="text-[#052698] font-heading font-extrabold text-4xl">$500</p>
                    <p className="text-[15px] text-black/80 -mt-1">per month · $15.15 per container</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <ChannelBadge icon={<EmailIcon size={11} />} label="Email" />
                      <ChannelBadge icon={<WhatsAppIcon size={11} />} label="WhatsApp" />
                      <ChannelBadge icon={<ERPIcon size={11} />} label="ERP" />
                    </div>
                  </div>
                  <div className="border border-[#052698]/15 bg-white px-3 py-2 flex items-center gap-2">
                    <ShipIcon />
                    <span className="text-sm text-[#052698] font-medium">33 containers / mo</span>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {[
                      "WhatsApp + Email + ERP integration",
                      "API access for internal systems",
                      "Unlimited users",
                      "Priority support",
                      "HS code lookup included",
                      "Custom onboarding session",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-black">
                        <CheckIcon />{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => selectPlan({ name: "Pro", amount: "500.00", label: "$500 / mo", plan: "pro" })}
                    className="bg-white text-[#052698] text-sm font-medium px-4 py-3 border border-[#052698]/30 hover:bg-[#052698]/5 transition-colors cursor-pointer mt-auto"
                  >
                    Get started
                  </button>
                </div>
              </div>

              {/* Custom amount bar */}
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
          </div>

        {/* Footer */}
        <footer className="border-t border-[#052698]/15 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <p className="text-sm text-black/60">© {new Date().getFullYear()} Tydline. All rights reserved.</p>
          <a href="mailto:hello@tydline.com" className="text-sm text-black/60 hover:text-black transition-colors">
            hello@tydline.com
          </a>
        </footer>
      </div>
    </div>
  );
}
