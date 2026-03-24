import { createContext, useContext, useState, type ReactNode } from "react";

export interface SelectedPackage {
  name: string;
  amount: string;
  label: string;
  plan: "starter" | "growth" | "pro" | "custom";
}

interface AppState {
  userId: string | null;
  subscriptionStatus: "pending" | "active" | "none" | null;
  trackingEmail: string | null;
  selectedPackage: SelectedPackage | null;
  setUser: (userId: string, status: "pending" | "active" | "none") => void;
  setSubscriptionActive: () => void;
  setTrackingEmail: (email: string) => void;
  setSelectedPackage: (pkg: SelectedPackage) => void;
  clearUser: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("tydline_user_id"));
  const [subscriptionStatus, setSubStatus] = useState<"pending" | "active" | "none" | null>(
    () => localStorage.getItem("tydline_sub_status") as "pending" | "active" | "none" | null
  );
  const [trackingEmail, setTrackingEmailState] = useState<string | null>(
    () => localStorage.getItem("tydline_tracking_email")
  );
  const [selectedPackage, setSelectedPackageState] = useState<SelectedPackage | null>(() => {
    const stored = localStorage.getItem("tydline_package");
    return stored ? (JSON.parse(stored) as SelectedPackage) : null;
  });

  const setUser = (id: string, status: "pending" | "active" | "none") => {
    setUserId(id);
    setSubStatus(status);
    localStorage.setItem("tydline_user_id", id);
    localStorage.setItem("tydline_sub_status", status);
  };

  const setSubscriptionActive = () => {
    setSubStatus("active");
    localStorage.setItem("tydline_sub_status", "active");
  };

  const setTrackingEmail = (email: string) => {
    setTrackingEmailState(email);
    localStorage.setItem("tydline_tracking_email", email);
  };

  const setSelectedPackage = (pkg: SelectedPackage) => {
    setSelectedPackageState(pkg);
    localStorage.setItem("tydline_package", JSON.stringify(pkg));
  };

  const clearUser = () => {
    setUserId(null);
    setSubStatus(null);
    setTrackingEmailState(null);
    setSelectedPackageState(null);
    ["tydline_user_id", "tydline_sub_status", "tydline_tracking_email", "tydline_package"].forEach((k) =>
      localStorage.removeItem(k)
    );
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        subscriptionStatus,
        trackingEmail,
        selectedPackage,
        setUser,
        setSubscriptionActive,
        setTrackingEmail,
        setSelectedPackage,
        clearUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
