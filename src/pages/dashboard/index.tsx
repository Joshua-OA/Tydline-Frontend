import { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import logo from "../../assets/tydline-sqaurlogo.png";
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

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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
        `flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 ${
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

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="w-56 h-full border-r border-[#052698]/20 flex flex-col bg-[#FFF9F5] shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#052698]/15 gap-2.5">
        <img src={logo} className="w-9" alt="Tydline" />
        <span className="font-heading font-bold text-[#052698] text-base tracking-tight">Tydline</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        <NavItem to="/dashboard" end icon={<IconReports />} label="Reports" onClick={onClose} />
        <NavItem to="/dashboard/shipments" icon={<IconShipments />} label="Upcoming Shipments" onClick={onClose} />
        <NavItem to="/dashboard/approvals" icon={<IconApprovals />} label="Approvals" onClick={onClose} />
        <NavItem to="/dashboard/notifications" icon={<IconNotifications />} label="Notifications" onClick={onClose} />
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-3 border-t border-[#052698]/15 pt-2">
        <NavItem to="/dashboard/settings" icon={<IconSettings />} label="Settings" onClick={onClose} />
      </div>
    </aside>
  );
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
          <span className="font-heading font-bold text-[#052698] text-sm tracking-tight">Tydline</span>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10 w-56 h-full bg-[#FFF9F5] shadow-xl flex flex-col">
              <div className="h-14 flex items-center justify-between px-4 border-b border-[#052698]/15">
                <div className="flex items-center gap-2.5">
                  <img src={logo} className="w-8" alt="Tydline" />
                  <span className="font-heading font-bold text-[#052698] text-sm">Tydline</span>
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
              <div className="px-2 pb-3 border-t border-[#052698]/15 pt-2">
                <NavItem to="/dashboard/settings" icon={<IconSettings />} label="Settings" onClick={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFF]" style={{ backgroundImage: brickSvg }}>
          <Routes>
            <Route index element={<Reports />} />
            <Route path="shipments" element={<UpcomingShipments />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
