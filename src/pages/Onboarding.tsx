import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useApp } from "../store/appContext";
import Button from "../components/ui/Button";
const logo = "/tydline-sqaurlogo.png";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

type Step = "payment" | "otp" | "tracking-email" | "success";

const COUNTRY_CODES = [
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+1",   flag: "🇺🇸", name: "USA/Canada" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
];

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedPackage, setSubscriptionActive, setTrackingEmail } = useApp();

  const stepParam = searchParams.get("step") as Step | null;
  const step: Step = (["payment", "otp", "tracking-email", "success"].includes(stepParam ?? "") ? stepParam! : "payment");

  function goToStep(s: Step) {
    navigate(`/onboarding?step=${s}`);
  }

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const pendingNav = useRef<(() => void) | null>(null);

  function guardedNavigate(destination: () => void) {
    if (step === "success") { destination(); return; }
    pendingNav.current = destination;
    setShowLeaveModal(true);
  }

  // Intercept browser back/forward button
  useEffect(() => {
    if (step === "success") return;
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      pendingNav.current = () => navigate(-2);
      setShowLeaveModal(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [step]);

  // Payment step
  const [countryCode, setCountryCode] = useState("+233");
  const [phone, setPhone] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // OTP step
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Tracking email step — user types prefix only; suffix is fixed
  const TRACKING_SUFFIX = "@track.tydline.com";
  const suggestedPrefix = (() => {
    const authEmail = localStorage.getItem("tydline_auth_email") ?? "";
    const domain = authEmail.split("@")[1] ?? "";
    // e.g. "meltwater.org" → "meltwater", "co.uk" edge case → first segment
    const company = domain.split(".")[0] ?? "";
    return company.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  })();
  const [tEmailPrefix, setTEmailPrefix] = useState(suggestedPrefix);
  const [tEmailLoading, setTEmailLoading] = useState(false);
  const [tEmailError, setTEmailError] = useState("");
  const [prefixAvailability, setPrefixAvailability] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [copied, setCopied] = useState(false);

  async function checkPrefixAvailability() {
    const prefix = tEmailPrefix.trim();
    if (!prefix || !/^[a-z0-9][a-z0-9.\-]*[a-z0-9]$/.test(prefix)) return;
    setPrefixAvailability("checking");
    try {
      const res = await api.checkTrackingPrefix(prefix);
      setPrefixAvailability(res.available ? "available" : "taken");
    } catch {
      setPrefixAvailability("idle");
    }
  }

  function copyTrackingEmail() {
    const full = `${tEmailPrefix.trim()}${TRACKING_SUFFIX}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleInitiatePayment() {
    const digits = phone.trim().replace(/^0/, "");
    if (!digits || digits.length < 7) {
      setPayError("Please enter a valid phone number.");
      return;
    }
    const dialCode = countryCode.replace("+", "");
    const fullNumber = `${dialCode}${digits}`;
    setPayError("");
    setPayLoading(true);
    try {
      const planKey = selectedPackage?.plan ?? "starter";
      const apiPlan = (["starter", "growth", "pro"] as const).includes(planKey as "starter" | "growth" | "pro")
        ? (planKey as "starter" | "growth" | "pro")
        : "starter";
      await api.initiatePayment(fullNumber, apiPlan);
      goToStep("otp");
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Payment initiation failed.");
    } finally {
      setPayLoading(false);
    }
  }

  async function handleConfirmOTP() {
    const code = otp.trim();
    if (!code || code.length < 4) {
      setOtpError("Please enter the OTP sent to your phone.");
      return;
    }
    setOtpError("");
    setOtpLoading(true);
    try {
      await api.confirmOTP(code);
      setSubscriptionActive();
      goToStep("tracking-email");
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "OTP confirmation failed.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSetTrackingEmail() {
    const prefix = tEmailPrefix.trim().toLowerCase();
    if (!prefix || !/^[a-z0-9][a-z0-9.\-]*[a-z0-9]$/.test(prefix)) {
      setTEmailError("Use only letters, numbers, dots, or hyphens — e.g. yourcompany");
      return;
    }
    if (prefixAvailability === "taken") {
      setTEmailError("This address is already taken. Please choose a different one.");
      return;
    }
    const te = `${prefix}${TRACKING_SUFFIX}`;
    setTEmailError("");
    setTEmailLoading(true);
    try {
      await api.setTrackingEmail(te);
      setTrackingEmail(te);
      goToStep("success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e) {
      setTEmailError(e instanceof Error ? e.message : "Failed to set tracking email.");
    } finally {
      setTEmailLoading(false);
    }
  }

  const steps: Step[] = ["payment", "otp", "tracking-email"];
  const stepIndex = steps.indexOf(step);
  const stepLabels = ["Payment", "Confirm", "Setup"];

  return (
    <div className="w-screen min-h-screen bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full min-h-screen bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-5 md:px-8 border-b border-[#052698]/15 shrink-0">
          <button onClick={() => guardedNavigate(() => navigate("/"))} className="flex items-center gap-2.5 cursor-pointer">
            <img src={logo} className="w-9" alt="Tydline" />
            <span className="font-heading font-bold text-[#052698] text-base tracking-tight hidden md:block">Tydline</span>
          </button>
          <Button
            onClick={() => guardedNavigate(() => navigate(-1))}
            className="flex items-center gap-1.5 text-[13.5px] text-black/60 hover:text-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center py-10 px-4">
          {/* No package selected guard */}
          {!selectedPackage && step === "payment" && (
            <div className="w-full max-w-md border border-[#052698]/15 bg-[#FCFDFF] p-5 mb-6 flex flex-col gap-3">
              <p className="text-[15px] text-black font-medium">No plan selected</p>
              <p className="text-[13.5px] text-black/60">It looks like your plan selection was lost. Please go back and choose a plan to continue.</p>
              <button
                onClick={() => navigate(-1)}
                className="text-[13.5px] text-[#052698] underline text-left cursor-pointer"
              >
                ← Go back and select a plan
              </button>
            </div>
          )}

          {step !== "success" && (
            <div className="w-full max-w-md flex flex-col gap-8">
              {/* Step indicator */}
              <div className="flex items-center gap-0">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-7 h-7 flex items-center justify-center text-[13.5px] font-medium border ${
                          i <= stepIndex
                            ? "bg-[#052698] border-[#052698] text-white"
                            : "bg-white border-[#052698]/20 text-black/30"
                        }`}
                      >
                        {i < stepIndex ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className={`text-[11.5px] uppercase tracking-widest ${i <= stepIndex ? "text-black" : "text-black/30"}`}>
                        {label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`h-px flex-1 mb-5 ${i < stepIndex ? "bg-[#052698]" : "bg-[#052698]/15"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* STEP: payment */}
              {step === "payment" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-[#052698] text-[25.5px] font-heading font-extrabold tracking-tight">Complete payment</h2>
                    <p className="text-black/60 text-[15.5px] mt-1">
                      You selected the <span className="text-[#052698] font-semibold">{selectedPackage?.name ?? "—"}</span> plan
                      {selectedPackage ? ` — ${selectedPackage.label}` : ""}.
                    </p>
                  </div>

                  <div className="border border-[#052698]/15 bg-[#FCFDFF] p-4 flex items-center justify-between">
                    <span className="text-[15.5px] text-black/60">Amount due</span>
                    <span className="text-[#052698] font-heading font-bold text-[19.5px]">
                      GHS {selectedPackage?.amount ?? "—"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13.5px] text-black/60 uppercase tracking-widest">MoMo phone number</label>
                    <div className="flex border-[0.45px] border-[#052698] bg-white">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={payLoading}
                        className="border-r border-[#052698]/20 bg-transparent px-3 py-2.5 text-[15.5px] text-black focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="XXXXXXXXX"
                        disabled={payLoading}
                        className="flex-1 px-4 py-2.5 text-black bg-transparent text-[15.5px] focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[13.5px] text-black/40">Enter your MTN or Vodafone Cash number without the leading 0</p>
                  </div>

                  {payError && <p className="text-red-500 text-[15.5px]">{payError}</p>}

                  <button
                    onClick={handleInitiatePayment}
                    disabled={payLoading || !selectedPackage}
                    className="bg-[#052698] text-white text-[15.5px] font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {payLoading ? "Processing…" : `Pay GHS ${selectedPackage?.amount ?? "—"} →`}
                  </button>
                </div>
              )}

              {/* STEP: otp */}
              {step === "otp" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-black text-[25.5px] font-heading font-extrabold tracking-tight">Enter OTP</h2>
                    <p className="text-black/60 text-[15.5px] mt-1">
                      We sent a one-time code to your MoMo number. Enter it below to confirm the payment.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13.5px] text-black/60 uppercase tracking-widest">OTP code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      disabled={otpLoading}
                      className="border-[#052698] border-[0.45px] px-4 py-2.5 text-black bg-white text-[15.5px] w-full tracking-[0.3em] disabled:opacity-50"
                    />
                  </div>

                  {otpError && <p className="text-red-500 text-[15.5px]">{otpError}</p>}

                  <button
                    onClick={handleConfirmOTP}
                    disabled={otpLoading}
                    className="bg-[#052698] text-white text-[15.5px] font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? "Confirming…" : "Confirm payment →"}
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="text-[15.5px] text-black/50 hover:text-black transition-colors cursor-pointer text-left"
                  >
                    ← Use a different number
                  </button>
                </div>
              )}

              {/* STEP: tracking-email */}
              {step === "tracking-email" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-[#052698] text-[26.8px] font-heading font-extrabold tracking-tight">Set up tracking</h2>
                    <p className="text-black/70 text-[16.8px] mt-1">
                      Choose your tracking address. Shipping notifications forwarded here are automatically parsed by Tydline.
                    </p>
                  </div>

                  {/* Notice */}
                  <div className="border border-[#052698]/20 bg-[#FCFDFF] p-4 flex flex-col gap-1.5">
                    <p className="text-[14.8px] font-medium text-[#052698]">How it works</p>
                    <p className="text-[14.8px] text-black/70 leading-relaxed">
                      When your carrier sends a shipping update to your email, <span className="text-black font-medium">forward it or CC</span> your Tydline tracking address. We extract the data and send you alerts via {selectedPackage?.name?.includes("WhatsApp") ? "WhatsApp" : selectedPackage?.plan === "growth" ? "email and WhatsApp" : selectedPackage?.plan === "pro" ? "email, WhatsApp, and ERP" : "your chosen channel"} automatically.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14.8px] text-black/60 uppercase tracking-widest">Your tracking address</label>
                    {/* Split input: editable prefix + fixed suffix */}
                    <div className="flex border-[0.45px] border-[#052698] bg-white">
                      <input
                        type="text"
                        value={tEmailPrefix}
                        onChange={(e) => {
                          setTEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9.\-]/g, ""));
                          setPrefixAvailability("idle");
                          setTEmailError("");
                        }}
                        onBlur={checkPrefixAvailability}
                        placeholder="yourcompany"
                        disabled={tEmailLoading}
                        className="flex-1 min-w-0 px-4 py-2.5 text-black bg-transparent text-[16.8px] focus:outline-none disabled:opacity-50"
                      />
                      <span className="flex items-center pr-4 text-[16.8px] text-black/35 select-none whitespace-nowrap">
                        @track.tydline.com
                      </span>
                    </div>
                    {prefixAvailability === "checking" && (
                      <p className="text-[14.8px] text-black/50">Checking availability…</p>
                    )}
                    {prefixAvailability === "available" && (
                      <p className="text-[14.8px] text-green-600 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                        Available
                      </p>
                    )}
                    {prefixAvailability === "taken" && (
                      <p className="text-[14.8px] text-red-500 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        Already taken — try another
                      </p>
                    )}
                    {prefixAvailability === "idle" && (
                      <p className="text-[14.8px] text-black/50">
                        Letters, numbers, dots and hyphens only. This will be your permanent tracking address.
                      </p>
                    )}
                  </div>

                  {/* Live preview with copy */}
                  {tEmailPrefix.trim() && (
                    <div className="border border-[#052698]/15 bg-[#FCFDFF] px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[14.8px] text-black/60">Your address will be:</span>
                        <span className="text-[14.8px] font-medium text-[#052698] break-all">
                          {tEmailPrefix.trim()}@track.tydline.com
                        </span>
                      </div>
                      <button
                        onClick={copyTrackingEmail}
                        className="shrink-0 flex items-center gap-1.5 text-[14.8px] text-[#052698]/70 hover:text-[#052698] transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="1" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {tEmailError && <p className="text-red-500 text-[16.8px]">{tEmailError}</p>}

                  <button
                    onClick={handleSetTrackingEmail}
                    disabled={tEmailLoading || !tEmailPrefix.trim() || prefixAvailability === "taken" || prefixAvailability === "checking"}
                    className="bg-[#052698] text-white text-[15.5px] font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tEmailLoading ? "Saving…" : "Go to dashboard →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP: success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-5 text-center max-w-sm pt-6">
              <div className="w-14 h-14 border border-green-200 bg-green-50 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="text-black font-heading font-bold text-[21.5px]">You're all set!</p>
                <p className="text-black/50 text-[15.5px] mt-1">Taking you to your dashboard…</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation guard modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="bg-[#FFF9F5] border border-[#052698]/20 w-full max-w-sm flex flex-col gap-5 p-7">
              <div>
                <p className="text-black font-heading font-bold text-[17.5px]">Leave onboarding?</p>
                <p className="text-black/60 text-[15.5px] mt-1.5 leading-relaxed">
                  If you leave now your progress will be lost and you'll need to start over.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowLeaveModal(false); pendingNav.current?.(); pendingNav.current = null; }}
                  className="flex-1 bg-[#052698] text-white text-[15.5px] font-medium py-2.5 hover:bg-[#052698]/90 transition-colors cursor-pointer"
                >
                  Yes, leave
                </button>
                <Button onClick={() => { setShowLeaveModal(false); pendingNav.current = null; }} className="flex-1 text-[15.5px]">
                  Stay
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[#052698]/15 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <p className="text-[13.5px] text-black/60">© {new Date().getFullYear()} Tydline. All rights reserved.</p>
          <a href="mailto:hello@tydline.com" className="text-[13.5px] text-black/60 hover:text-black transition-colors">
            hello@tydline.com
          </a>
        </footer>
      </div>
    </div>
  );
}
