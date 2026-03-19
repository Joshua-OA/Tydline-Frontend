import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useApp } from "../store/appContext";
import logo from "../assets/tydline-sqaurlogo.png";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

type Step = "payment" | "otp" | "tracking-email" | "success";

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedPackage, setSubscriptionActive, setTrackingEmail } = useApp();

  const initialStep = (searchParams.get("step") as Step | null) ?? "payment";
  const [step, setStep] = useState<Step>(initialStep);

  // Payment step
  const [phone, setPhone] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // OTP step
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Tracking email step
  const [tEmail, setTEmail] = useState("");
  const [tEmailLoading, setTEmailLoading] = useState(false);
  const [tEmailError, setTEmailError] = useState("");

  const amount = selectedPackage?.amount ?? "100.00";
  const packageName = selectedPackage?.name ?? "Pro";
  const packageLabel = selectedPackage?.label ?? "$100 / mo";
  const planKey = selectedPackage?.plan ?? "growth";

  async function handleInitiatePayment() {
    const p = phone.trim();
    if (!p || p.length < 10) {
      setPayError("Please enter a valid phone number (e.g. 233XXXXXXXXX).");
      return;
    }
    setPayError("");
    setPayLoading(true);
    try {
      const apiPlan = (["starter", "growth", "pro"] as const).includes(planKey as "starter" | "growth" | "pro")
        ? (planKey as "starter" | "growth" | "pro")
        : "starter";
      await api.initiatePayment(p.startsWith("233") ? p : `233${p.replace(/^0/, "")}`, apiPlan);
      setStep("otp");
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
      setStep("tracking-email");
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "OTP confirmation failed.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSetTrackingEmail() {
    const te = tEmail.trim();
    if (!te || !te.includes("@")) {
      setTEmailError("Please enter a valid tracking email address.");
      return;
    }
    setTEmailError("");
    setTEmailLoading(true);
    try {
      await api.setTrackingEmail(te);
      setTrackingEmail(te);
      setStep("success");
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
        <div className="h-16 flex items-center px-5 md:px-8 border-b border-[#052698]/15 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} className="w-9" alt="Tydline" />
            <span className="font-heading font-bold text-[#052698] text-base tracking-tight hidden md:block">Tydline</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center py-10 px-4">
          {step !== "success" && (
            <div className="w-full max-w-md flex flex-col gap-8">
              {/* Step indicator */}
              <div className="flex items-center gap-0">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-7 h-7 flex items-center justify-center text-xs font-medium border ${
                          i < stepIndex
                            ? "bg-[#052698] border-[#052698] text-white"
                            : i === stepIndex
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
                      <span className={`text-[10px] uppercase tracking-widest ${i <= stepIndex ? "text-[#052698]" : "text-black/30"}`}>
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
                    <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Complete payment</h2>
                    <p className="text-black/60 text-sm mt-1">
                      You selected the <span className="text-[#052698] font-medium">{packageName}</span> plan — {packageLabel}.
                    </p>
                  </div>

                  <div className="border border-[#052698]/15 bg-[#FCFDFF] p-4 flex items-center justify-between">
                    <span className="text-sm text-black/60">Amount due</span>
                    <span className="text-[#052698] font-heading font-bold text-lg">GHS {amount}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-black/60 uppercase tracking-widest">MoMo phone number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="233XXXXXXXXX"
                      disabled={payLoading}
                      className="border-[#052698] border-[0.45px] px-4 py-2.5 text-[#545454] bg-white text-sm w-full disabled:opacity-50"
                    />
                    <p className="text-xs text-black/40">Enter your MTN or Vodafone Cash number with country code (233…)</p>
                  </div>

                  {payError && <p className="text-red-500 text-sm">{payError}</p>}

                  <button
                    onClick={handleInitiatePayment}
                    disabled={payLoading}
                    className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {payLoading ? "Processing…" : `Pay GHS ${amount} →`}
                  </button>
                </div>
              )}

              {/* STEP: otp */}
              {step === "otp" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Enter OTP</h2>
                    <p className="text-black/60 text-sm mt-1">
                      We sent a one-time code to your MoMo number. Enter it below to confirm the payment.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-black/60 uppercase tracking-widest">OTP code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      disabled={otpLoading}
                      className="border-[#052698] border-[0.45px] px-4 py-2.5 text-[#545454] bg-white text-sm w-full tracking-[0.3em] disabled:opacity-50"
                    />
                  </div>

                  {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

                  <button
                    onClick={handleConfirmOTP}
                    disabled={otpLoading}
                    className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? "Confirming…" : "Confirm payment →"}
                  </button>

                  <button
                    onClick={() => setStep("payment")}
                    className="text-sm text-black/50 hover:text-[#052698] transition-colors cursor-pointer text-left"
                  >
                    ← Use a different number
                  </button>
                </div>
              )}

              {/* STEP: tracking-email */}
              {step === "tracking-email" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Set up tracking</h2>
                    <p className="text-black/60 text-sm mt-1">
                      Your dedicated Tydline tracking email receives forwarded shipping notifications so we can track your cargo automatically.
                    </p>
                  </div>

                  <div className="border border-[#052698]/15 bg-[#FCFDFF] p-4 text-sm text-black/60 leading-relaxed">
                    Forward your shipping notifications to your assigned tracking email. Tydline will automatically extract updates and notify you across your chosen channels.
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-black/60 uppercase tracking-widest">Your tracking email</label>
                    <input
                      type="email"
                      value={tEmail}
                      onChange={(e) => setTEmail(e.target.value)}
                      placeholder="yourcompany@track.tydline.com"
                      disabled={tEmailLoading}
                      className="border-[#052698] border-[0.45px] px-4 py-2.5 text-[#545454] bg-white text-sm w-full disabled:opacity-50"
                    />
                  </div>

                  {tEmailError && <p className="text-red-500 text-sm">{tEmailError}</p>}

                  <button
                    onClick={handleSetTrackingEmail}
                    disabled={tEmailLoading}
                    className="bg-[#052698] text-white text-sm font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-[#052698] font-heading font-bold text-xl">You're all set!</p>
                <p className="text-black/50 text-sm mt-1">Taking you to your dashboard…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
