import { useNavigate, Link } from "react-router-dom";
const logo = "/tydline-sqaurlogo.png";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

export default function NoSubscription() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-[#F9E4D2] lg:px-5">
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

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md flex flex-col gap-6">
            {/* Icon */}
            <div className="w-12 h-12 border border-[#052698]/20 bg-[#052698]/5 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#052698" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="0" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>

            <div>
              <h1 className="text-[#052698] font-heading font-extrabold text-[26px] tracking-tight">No active subscription</h1>
              <p className="text-black/60 text-[15.5px] mt-2 leading-relaxed">
                Your account doesn't have an active subscription. Choose a plan to get access to your dashboard and start tracking shipments.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/pricing")}
                className="bg-[#052698] text-white text-[15.5px] font-medium px-6 py-3 hover:bg-[#052698]/90 transition-colors cursor-pointer"
              >
                View plans →
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-[15.5px] text-black/50 hover:text-black transition-colors cursor-pointer text-left"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
