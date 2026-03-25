const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1";

const FRIENDLY_ERROR = "Something went wrong. Kindly refresh and try again.";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(FRIENDLY_ERROR);
  }
  const data: unknown = await res.json().catch(() => ({}));
  console.log(`[API] ${options?.method ?? "GET"} ${path}`, data);
  if (!res.ok) {
    const err = data as { message?: string; detail?: string };
    throw new Error(err.message ?? err.detail ?? FRIENDLY_ERROR);
  }
  return data as T;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type Shipment = {
  id: string;
  bill_of_lading: string | null;
  container_number: string | null;
  carrier: string | null;
  vessel: string | null;
  line: string | null;
  origin: string | null;
  destination: string | null;
  eta: string | null;
  predicted_eta: string | null;
  demurrage_risk: string | null;
  free_days_remaining: number | null;
  days_left: number;
  progress: number;
  status: string;
  last_updated: string;
  user_id: string;
  created_at: string;
};

export type ShipmentsResponse = {
  pending_approval: Shipment[];
  active: Shipment[];
  completed: Shipment[];
  total_pending_approval: number;
  total_active: number;
  total_completed: number;
};

export type ApiApproval = {
  id: string;
  container_number: string;
  bill_of_lading: string;
  carrier: string | null;
  status: string;
  eta: string | null;
  predicted_eta: string | null;
  demurrage_risk: string | null;
  free_days_remaining: number | null;
  last_updated: string;
  created_at: string;
  user_id: string;
};

export type NotifyParty = {
  id: string;
  name: string;
  channel: "email" | "whatsapp";
  contact_value: string;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const api = {
  requestLink: (email: string, company_name: string, metadata?: Record<string, string>) =>
    apiFetch<{ message: string }>("/auth/request-link", {
      method: "POST",
      body: JSON.stringify({ email, company_name, ...(metadata ? { metadata } : {}) }),
    }),

  verifyToken: (token: string) =>
    apiFetch<{ user_id: string; subscription_status: "pending" | "active" | "none" }>(`/auth/verify?token=${token}`),

  logout: () =>
    apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),

  // ── Payment ───────────────────────────────────────────────────────────────

  initiatePayment: (phone: string, plan: "starter" | "growth" | "pro") =>
    apiFetch<{ session_id: string; message: string }>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ phone, plan }),
    }),

  confirmOTP: (otp_code: string) =>
    apiFetch<{ status: string }>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ otp_code }),
    }),

  applyCoupon: (code: string) =>
    apiFetch<{ status: string; plan: string }>("/payments/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  // ── Onboarding ────────────────────────────────────────────────────────────

  checkTrackingPrefix: (prefix: string) =>
    apiFetch<{ available: boolean }>(`/onboarding/tracking-email/check?prefix=${encodeURIComponent(prefix)}`),

  setTrackingEmail: (tracking_email: string) =>
    apiFetch<{ user_id: string; tracking_email: string; subscription_status: string }>(
      "/onboarding/tracking-email",
      { method: "POST", body: JSON.stringify({ tracking_email }) }
    ),

  getWhatsAppPhone: () =>
    apiFetch<{ phones: string[] }>("/onboarding/whatsapp-phone"),

  setWhatsAppPhone: (phone: string) =>
    apiFetch<{ user_id: string; phones: string[] }>("/onboarding/whatsapp-phone", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  // ── Account ───────────────────────────────────────────────────────────────

  getPlans: () =>
    apiFetch<unknown>("/account/plans"),

  getPlan: () =>
    apiFetch<{ plan: string | null; subscription_status: string }>("/account/plan"),

  // ── Dashboard ─────────────────────────────────────────────────────────────

  getShipments: () =>
    apiFetch<ShipmentsResponse>("/dashboard/shipments"),

  getActiveShipments: () =>
    apiFetch<Shipment[]>("/dashboard/shipments/active"),

  getCompletedShipments: () =>
    apiFetch<Shipment[]>("/dashboard/shipments/completed"),

  submitShipment: (data: Record<string, unknown>) =>
    apiFetch<{ id: string; status: string }>("/dashboard/shipments/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ── Approvals ─────────────────────────────────────────────────────────────

  getApprovals: () =>
    apiFetch<ApiApproval[]>("/dashboard/approvals"),

  approveShipment: (id: string) =>
    apiFetch<Shipment>(`/dashboard/approvals/${id}/approve`, { method: "POST" }),

  // ── Notify Parties ────────────────────────────────────────────────────────

  getNotifyParties: () =>
    apiFetch<NotifyParty[]>("/notify-parties"),

  addNotifyParty: (name: string, channel: "email" | "whatsapp", contact_value: string) =>
    apiFetch<NotifyParty>("/notify-parties", {
      method: "POST",
      body: JSON.stringify({ name, channel, contact_value }),
    }),

  deleteNotifyParty: (id: string) =>
    apiFetch<{ message: string }>(`/notify-parties/${id}`, { method: "DELETE" }),
};
