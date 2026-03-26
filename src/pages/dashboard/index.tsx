import { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useApp } from "../../store/appContext";
import { api } from "../../services/api";
const logo = "/tydline-sqaurlogo.png";
import Reports from "./Reports";
import UpcomingShipments from "./UpcomingShipments";
import Approvals from "./Approvals";
import Notifications from "./Notifications";
import Settings from "./Settings";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.07'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.07'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.07'/%3E%3C/svg%3E")`;

function IconReports() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconShipments() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18M5 17V9l4-4h6l4 4v8" />
      <path d="M9 5v4M15 5v4" />
      <circle cx="7.5" cy="19.5" r="1.5" />
      <circle cx="16.5" cy="19.5" r="1.5" />
    </svg>
  );
}

function IconApprovals() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function IconNotifications() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type SidebarProps = {
  onClose?: () => void;
  onLogout: () => void;
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
};

function NavItem({ to, icon, label, end = false, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 text-[14.6px] transition-all duration-150 ${
          isActive
            ? "bg-[#052698] text-white"
            : "text-black hover:bg-[#052698]/8 hover:text-[#052698]"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ onClose, onLogout }: SidebarProps) {
  return (
    <aside className="w-56 h-full border-r border-[#052698]/20 flex flex-col bg-[#FFF9F5] shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#052698]/15 gap-2.5">
        <img src={logo} className="w-9" alt="Tydline" />
        <span className="font-heading font-bold text-[#052698] text-[16.6px] tracking-tight">Tydline</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        <NavItem to="/dashboard" end icon={<IconReports />} label="Reports" onClick={onClose} />
        <NavItem to="/dashboard/shipments" icon={<IconShipments />} label="Upcoming Shipments" onClick={onClose} />
        <NavItem to="/dashboard/approvals" icon={<IconApprovals />} label="Approvals" onClick={onClose} />
        <NavItem to="/dashboard/notifications" icon={<IconNotifications />} label="Notifications" onClick={onClose} />
      </nav>

      {/* Settings + Logout at bottom */}
      <div className="px-2 pb-3 border-t border-[#052698]/15 pt-2 flex flex-col gap-0.5">
        <NavItem to="/dashboard/settings" icon={<IconSettings />} label="Settings" onClick={onClose} />
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-[14.6px] text-black hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full cursor-pointer"
        >
          <IconLogout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const WA_CODES = [
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+254", flag: "🇰🇪", label: "KE" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+31", flag: "🇳🇱", label: "NL" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+55", flag: "🇧🇷", label: "BR" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
];

function WhatsAppSetupModal({ onDone }: { onDone: () => void }) {
  const [countryCode, setCountryCode] = useState("+233");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const raw = phone.trim();
    if (!raw) return;
    // Backend expects digits only, no spaces/dashes, country code prefix
    const digits = `${countryCode}${raw}`.replace(/\D/g, "");
    setSaving(true);
    setError(null);
    try {
      await api.setWhatsAppPhone(digits);
      onDone();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function dismiss() {
    localStorage.setItem("tydline_wa_prompt_dismissed", "1");
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={dismiss} />
      <div className="relative z-10 w-full max-w-md bg-[#FFF9F5] border border-[#052698]/20 shadow-xl flex flex-col">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#052698]/10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-green-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.531 5.855L.057 23.886a.5.5 0 00.611.61l6.101-1.525A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.187-1.38l-.372-.214-3.853.963.978-3.773-.232-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </span>
            <h2 className="text-[#052698] font-heading font-extrabold text-[20.6px]">Set up WhatsApp notifications</h2>
          </div>
          <p className="text-black/80 text-[15.6px]">
            Your plan includes WhatsApp tracking. Register your number to forward shipment details, receive live status updates, and chat with the tracking agent directly on WhatsApp.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[14.6px] px-3 py-2">{error}</div>
          )}

          <div>
            <label className="text-[14.6px] text-black/80 block mb-1.5">WhatsApp phone number</label>
            <div className="flex border border-[#052698]/25">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="pl-2 pr-5 py-2.5 text-[15.6px] text-[#052698] bg-[#F8FAFF] border-r border-[#052698]/20 cursor-pointer shrink-0"
                style={{ appearance: "auto" }}
              >
                {WA_CODES.map((c) => (
                  <option key={c.label} value={c.code}>
                    {c.flag} {c.code} {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="55 123 4567"
                className="flex-1 px-3 py-2.5 text-[15.6px] text-black placeholder-black/30 bg-white"
              />
            </div>
            <p className="text-[13.6px] text-black/80 mt-1.5">Must be active on WhatsApp. Forward any shipment confirmation to this number and we'll start tracking it. You can change this anytime in Settings.</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !phone.trim()}
            className="w-full bg-green-600 text-white text-[16.6px] font-medium py-3 hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Activate WhatsApp tracking"}
          </button>

          <button
            onClick={dismiss}
            className="text-[14.6px] text-black/80 hover:text-black/80 transition-colors cursor-pointer text-center"
          >
            I'll set this up later
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clearUser, selectedPackage } = useApp();
  const navigate = useNavigate();
  const [showWaModal, setShowWaModal] = useState(false);
  const [waPhoneSet, setWaPhoneSet] = useState<boolean | null>(null);
  const [hasWaPlan, setHasWaPlan] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(
    () => !!localStorage.getItem("tydline_wa_toast_dismissed")
  );

  useEffect(() => {
    api.getPlan().then((planData) => {
      const plan = planData?.plan ?? selectedPackage?.plan ?? "starter";
      const eligible = plan === "growth" || plan === "pro" || plan === "custom";
      setHasWaPlan(eligible);
      if (!eligible) return;

      api.getWhatsAppPhone().then((res) => {
        const isSet = Array.isArray(res.phones) && res.phones.length > 0;
        setWaPhoneSet(isSet);
        const dismissed = localStorage.getItem("tydline_wa_prompt_dismissed");
        if (!isSet && !dismissed) setShowWaModal(true);
      }).catch(() => {
        setWaPhoneSet(true);
      });
    }).catch(() => {});
  }, [selectedPackage?.plan]);

  function handleWaModalDone() {
    setShowWaModal(false);
    api.getWhatsAppPhone().then((res) => {
      setWaPhoneSet(Array.isArray(res.phones) && res.phones.length > 0);
    }).catch(() => {});
  }

  const showWaBanner = hasWaPlan && waPhoneSet === false && !toastDismissed;

  async function handleLogout() {
    try { await api.logout(); } catch { /* best effort */ }
    clearUser();
    navigate("/");
  }

  return (
    <>
    {showWaModal && <WhatsAppSetupModal onDone={handleWaModalDone} />}
    <div className="w-screen h-screen overflow-hidden bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full h-full bg-[#FFF9F5] flex flex-col md:flex-row border-x-[0.5px] border-[#052698]/30 overflow-hidden"
        style={{ backgroundImage: brickSvg }}
      >
        {/* Mobile top bar */}
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-[#052698]/15 bg-[#FFF9F5] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#052698] cursor-pointer"
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <img src={logo} className="w-8" alt="Tydline" />
          <span className="font-heading font-bold text-[#052698] text-[16.6px] tracking-tight">Tydline</span>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10 w-56 h-full bg-[#FFF9F5] shadow-xl flex flex-col">
              <div className="h-14 flex items-center justify-between px-4 border-b border-[#052698]/15">
                <div className="flex items-center gap-2.5">
                  <img src={logo} className="w-8" alt="Tydline" />
                  <span className="font-heading font-bold text-[#052698] text-[16.6px]">Tydline</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-[#052698] cursor-pointer">
                  <IconClose />
                </button>
              </div>
              <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
                <NavItem to="/dashboard" end icon={<IconReports />} label="Reports" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/dashboard/shipments" icon={<IconShipments />} label="Upcoming Shipments" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/dashboard/approvals" icon={<IconApprovals />} label="Approvals" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/dashboard/notifications" icon={<IconNotifications />} label="Notifications" onClick={() => setSidebarOpen(false)} />
              </nav>
              <div className="px-2 pb-3 border-t border-[#052698]/15 pt-2 flex flex-col gap-0.5">
                <NavItem to="/dashboard/settings" icon={<IconSettings />} label="Settings" onClick={() => setSidebarOpen(false)} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-[16.6px] text-black hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full cursor-pointer"
                >
                  <IconLogout />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar onLogout={handleLogout} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFF] flex flex-col" style={{ backgroundImage: brickSvg }}>
          {/* WhatsApp setup banner */}
          {showWaBanner && (
            <div className="shrink-0 flex items-center justify-between gap-4 bg-green-50 border-b border-green-200 px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-600 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.531 5.855L.057 23.886a.5.5 0 00.611.61l6.101-1.525A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.187-1.38l-.372-.214-3.853.963.978-3.773-.232-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                <p className="text-green-800 text-[14.6px]">
                  <span className="font-semibold">WhatsApp tracking not set up.</span>{" "}
                  Register your number to receive live shipment updates on WhatsApp.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowWaModal(true)}
                  className="text-[14.6px] font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Set up now
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("tydline_wa_toast_dismissed", "1");
                    setToastDismissed(true);
                  }}
                  className="text-green-700 hover:text-green-900 text-[18.6px] leading-none cursor-pointer"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route index element={<Reports />} />
              <Route path="shipments" element={<UpcomingShipments />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings waPhoneSet={waPhoneSet} onWaPhoneUpdated={() => setWaPhoneSet(true)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
