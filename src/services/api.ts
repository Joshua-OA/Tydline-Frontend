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
  if (!res.ok) throw new Error((data as { message?: string }).message ?? FRIENDLY_ERROR);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const api = {
  requestLink: (email: string, company_name: string) =>
    apiFetch<{ message: string }>("/auth/request-link", {
      method: "POST",
      body: JSON.stringify({ email, company_name }),
    }),

  verifyToken: (token: string) =>
    apiFetch<{ user_id: string; subscription_status: "pending" | "active" }>(`/auth/verify?token=${token}`),

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

  // ── Onboarding ────────────────────────────────────────────────────────────

  setTrackingEmail: (tracking_email: string) =>
    apiFetch<{ user_id: string; tracking_email: string; subscription_status: string }>(
      "/onboarding/tracking-email",
      { method: "POST", body: JSON.stringify({ tracking_email }) }
    ),

  // ── Account ───────────────────────────────────────────────────────────────

  getPlans: () =>
    apiFetch<unknown>("/account/plans"),

  getPlan: () =>
    apiFetch<unknown>("/account/plan"),

  // ── Dashboard ─────────────────────────────────────────────────────────────

  getShipments: () =>
    apiFetch<unknown>("/dashboard/shipments"),

  getActiveShipments: () =>
    apiFetch<unknown>("/dashboard/shipments/active"),

  getCompletedShipments: () =>
    apiFetch<unknown>("/dashboard/shipments/completed"),

  // ── Notify Parties ────────────────────────────────────────────────────────

  getNotifyParties: () =>
    apiFetch<unknown>("/notify-parties"),

  addNotifyParty: (name: string, channel: "email" | "whatsapp", contact_value: string) =>
    apiFetch<unknown>("/notify-parties", {
      method: "POST",
      body: JSON.stringify({ name, channel, contact_value }),
    }),

  deleteNotifyParty: (id: string) =>
    apiFetch<unknown>(`/notify-parties/${id}`, { method: "DELETE" }),
};
