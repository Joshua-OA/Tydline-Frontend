import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useApp, type SelectedPackage } from "../store/appContext";
const logo = "/tydline-sqaurlogo.png";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

export default function AuthVerify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setSelectedPackage, subscriptionStatus, trackingEmail } = useApp();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [, setErrorMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the link.");
      return;
    }

    // Restore context from state param (embedded by backend in the magic link)
    const stateParam = params.get("state");
    if (stateParam) {
      try {
        const meta = JSON.parse(atob(stateParam)) as Record<string, string>;
        if (meta.tracking_query) {
          localStorage.setItem("tydline_tracking_query", meta.tracking_query);
        }
        if (meta.plan && meta.plan_name && meta.plan_amount && meta.plan_label) {
          setSelectedPackage({
            plan: meta.plan as SelectedPackage["plan"],
            name: meta.plan_name,
            amount: meta.plan_amount,
            label: meta.plan_label,
          });
        }
      } catch {
        // malformed state — ignore
      }
    }

    api
      .verifyToken(token)
      .then((res) => {
        setUser(res.user_id, res.subscription_status);
        setStatus("success");

        // Small delay so the user sees the success state before redirect
        setTimeout(() => {
          if (res.subscription_status === "none") {
            // New user — no subscription initiated yet.
            // If a plan was already selected (from tracking or pricing flow),
            // go straight to payment. Otherwise send them to pick a plan first.
            const hasPlan = !!localStorage.getItem("tydline_package");
            navigate(hasPlan ? "/onboarding" : "/no-subscription");
          } else if (res.subscription_status === "pending") {
            // Returning user who started payment but never completed it.
            navigate("/onboarding");
          } else if (!trackingEmail) {
            navigate("/onboarding?step=tracking-email");
          } else {
            navigate("/dashboard");
          }
        }, 1200);
      })
      .catch((e: unknown) => {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "Verification failed. The link may have expired.");
        const savedQuery = localStorage.getItem("tydline_tracking_query") ?? "";
        const dest = savedQuery
          ? `/track?q=${encodeURIComponent(savedQuery)}&step=auth&retry=true`
          : null;
        setTimeout(() => { if (dest) navigate(dest); }, 2000);
      });
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full h-full bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        {/* Top bar */}
        <div className="h-16 flex items-center px-5 md:px-8 border-b border-[#052698]/15 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} className="w-9" alt="Tydline" />
            <span className="font-heading font-bold text-[#052698] text-base tracking-tight hidden md:block">Tydline</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 text-center max-w-sm px-4">
            {status === "verifying" && (
              <>
                <div className="w-12 h-12 border-2 border-[#052698]/20 border-t-[#052698] rounded-full animate-spin" />
                <div>
                  <p className="text-[#052698] font-heading font-bold text-lg">Verifying your link…</p>
                  <p className="text-black/50 text-sm mt-1">Just a moment.</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-12 h-12 border border-green-200 bg-green-50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#052698] font-heading font-bold text-lg">Verified!</p>
                  <p className="text-black/50 text-sm mt-1">
                    {subscriptionStatus === "active"
                    ? "Redirecting to your dashboard…"
                    : subscriptionStatus === "pending"
                    ? "Redirecting to complete your payment…"
                    : "Pending subscription — redirecting to plans…"}
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-12 h-12 border border-red-200 bg-red-50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#052698] font-heading font-bold text-lg">Link expired</p>
                  <p className="text-black/50 text-sm mt-1">Redirecting you back to request a new one…</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
