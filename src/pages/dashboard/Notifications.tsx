import { useState, useEffect } from "react";
import { api, type NotifyParty } from "../../services/api";
import { useApp } from "../../store/appContext";

type Recipient = {
  id: string;
  value: string;
  enabled: boolean;
};

type Platform = {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "erp";
  connected: boolean;
  enabled: boolean;
  recipients: Recipient[];
};

const countryCodes = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+1", flag: "🇨🇦", label: "CA" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+31", flag: "🇳🇱", label: "NL" },
  { code: "+32", flag: "🇧🇪", label: "BE" },
  { code: "+34", flag: "🇪🇸", label: "ES" },
  { code: "+39", flag: "🇮🇹", label: "IT" },
  { code: "+351", flag: "🇵🇹", label: "PT" },
  { code: "+41", flag: "🇨🇭", label: "CH" },
  { code: "+46", flag: "🇸🇪", label: "SE" },
  { code: "+47", flag: "🇳🇴", label: "NO" },
  { code: "+45", flag: "🇩🇰", label: "DK" },
  { code: "+358", flag: "🇫🇮", label: "FI" },
  { code: "+48", flag: "🇵🇱", label: "PL" },
  { code: "+55", flag: "🇧🇷", label: "BR" },
  { code: "+52", flag: "🇲🇽", label: "MX" },
  { code: "+54", flag: "🇦🇷", label: "AR" },
  { code: "+57", flag: "🇨🇴", label: "CO" },
  { code: "+20", flag: "🇪🇬", label: "EG" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+254", flag: "🇰🇪", label: "KE" },
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+212", flag: "🇲🇦", label: "MA" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+966", flag: "🇸🇦", label: "SA" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
  { code: "+82", flag: "🇰🇷", label: "KR" },
  { code: "+81", flag: "🇯🇵", label: "JP" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+60", flag: "🇲🇾", label: "MY" },
  { code: "+62", flag: "🇮🇩", label: "ID" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+64", flag: "🇳🇿", label: "NZ" },
  { code: "+972", flag: "🇮🇱", label: "IL" },
  { code: "+90", flag: "🇹🇷", label: "TR" },
  { code: "+7", flag: "🇷🇺", label: "RU" },
];

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.531 5.855L.057 23.886a.5.5 0 00.611.61l6.101-1.525A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.187-1.38l-.372-.214-3.853.963.978-3.773-.232-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );
}

function IconERP() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 8h.01M11 8h6M7 12h.01M11 12h6" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}

const platformIcon: Record<Platform["type"], React.ReactNode> = {
  whatsapp: <IconWhatsApp />,
  email: <IconEmail />,
  erp: <IconERP />,
};

const platformColor: Record<Platform["type"], string> = {
  whatsapp: "text-green-600",
  email: "text-[#052698]",
  erp: "text-purple-600",
};

const placeholder: Record<Platform["type"], string> = {
  whatsapp: "555 000 0000",
  email: "name@company.com",
  erp: "webhook URL or system ID",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? "bg-[#052698]" : "bg-black/25"}`}
    >
      <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

const EMPTY_PLATFORMS: Platform[] = [
  { id: "whatsapp", name: "WhatsApp", type: "whatsapp", connected: true, enabled: true, recipients: [] },
  { id: "email", name: "Email", type: "email", connected: true, enabled: true, recipients: [] },
  { id: "erp", name: "ERP / TMS", type: "erp", connected: false, enabled: false, recipients: [] },
];

function Notifications() {
  const { selectedPackage } = useApp();
  const [plan, setPlan] = useState<string | null>(null);
  const hasWhatsApp = plan === null || plan === "growth" || plan === "pro" || plan === "custom";

  const [platforms, setPlatforms] = useState<Platform[]>(EMPTY_PLATFORMS);
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [selectedCodes, setSelectedCodes] = useState<Record<string, string>>({ whatsapp: "+1" });
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    api.getPlan()
      .then((data) => { if (data?.plan) setPlan(data.plan); })
      .catch(() => {/* keep context fallback */});
  }, []);

  useEffect(() => {
    api.getNotifyParties().then((data) => {
      const parties: NotifyParty[] = Array.isArray(data) ? data : [];
      setPlatforms((prev) =>
        prev.map((p) => {
          if (p.type === "erp") return p;
          const recipients = parties
            .filter((party) => party.channel === p.type)
            .map((party) => ({ id: party.id, value: party.contact_value, enabled: true }));
          return { ...p, recipients };
        })
      );
    }).catch((e: Error) => setApiError(e.message));
  }, []);

  function togglePlatform(id: string) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  }

  function toggleRecipient(platformId: string, recipientId: string) {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? { ...p, recipients: p.recipients.map((r) => r.id === recipientId ? { ...r, enabled: !r.enabled } : r) }
          : p
      )
    );
  }

  function removeRecipient(platformId: string, recipientId: string) {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? { ...p, recipients: p.recipients.filter((r) => r.id !== recipientId) }
          : p
      )
    );
    api.deleteNotifyParty(recipientId).catch((e: Error) => setApiError(e.message));
  }

  async function addRecipient(platformId: string, type: Platform["type"]) {
    const raw = newValues[platformId]?.trim();
    if (!raw || type === "erp") return;
    const channel = type as "email" | "whatsapp";
    const contact_value = channel === "whatsapp" ? `${selectedCodes[platformId] ?? "+1"} ${raw}` : raw;
    setSaving(platformId);
    setApiError(null);
    try {
      const party = await api.addNotifyParty(contact_value, channel, contact_value);
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId
            ? { ...p, recipients: [...p.recipients, { id: party.id, value: party.contact_value, enabled: true }] }
            : p
        )
      );
      setNewValues((prev) => ({ ...prev, [platformId]: "" }));
    } catch (e) {
      setApiError((e as Error).message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[16.6px] px-4 py-3">{apiError}</div>
      )}
      <div>
        <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Notifications</h2>
        <p className="text-black/85 text-[18.6px] mt-0.5">Manage which platforms and recipients receive shipment notifications</p>
      </div>

      {/* Platform cards */}
      <div className="flex flex-col gap-4">
        {platforms.map((platform) => {
          const isLocked = platform.type === "whatsapp" && !hasWhatsApp;
          const isComingSoon = platform.type === "erp";

          return (
          <div key={platform.id} className={`bg-[#FCFDFF] border border-[#052698]/20 ${isLocked || isComingSoon ? "opacity-70" : ""}`}>

            {/* Platform header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#052698]/10">
              <div className="flex items-center gap-3">
                <span className={platformColor[platform.type]}>{platformIcon[platform.type]}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[#052698] font-heading font-bold text-[18.6px]">{platform.name}</p>
                    {isLocked && (
                      <span className="text-[12.6px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                        Growth plan
                      </span>
                    )}
                    {isComingSoon && (
                      <span className="text-[12.6px] px-1.5 py-0.5 bg-black/5 text-black/85 border border-black/10">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-[14.6px] mt-0.5 text-[#052698]/60">
                    {isLocked
                      ? "Upgrade to Growth or Pro to enable WhatsApp"
                      : isComingSoon
                      ? "ERP / TMS integration coming soon"
                      : `${platform.recipients.length} recipient${platform.recipients.length !== 1 ? "s" : ""} configured`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isLocked && !isComingSoon && !platform.connected && (
                  <button className="text-[16.6px] border border-[#052698] text-[#052698] px-4 py-1.5 hover:bg-[#052698] hover:text-white transition-colors cursor-pointer">
                    Connect
                  </button>
                )}
                {!isLocked && !isComingSoon && (
                  <Toggle
                    checked={platform.enabled && platform.connected}
                    onChange={() => togglePlatform(platform.id)}
                  />
                )}
              </div>
            </div>

            {/* Recipients — only show if connected and accessible */}
            {platform.connected && !isLocked && !isComingSoon && (
              <div className="px-5 py-4 flex flex-col gap-3">

                {/* Recipient list */}
                {platform.recipients.length > 0 && (
                  <div className="flex flex-col">
                    {platform.recipients.map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-[#052698]/8 last:border-0">
                        <span className={`text-[16.6px] flex-1 font-medium ${r.enabled ? "text-[#052698]" : "text-black/85 line-through"}`}>
                          {r.value}
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <Toggle checked={r.enabled} onChange={() => toggleRecipient(platform.id, r.id)} />
                          <button
                            onClick={() => removeRecipient(platform.id, r.id)}
                            className="text-black/85 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add recipient */}
                <div className="flex gap-0 mt-1 border border-[#052698]/20">

                  {/* Country code dropdown — WhatsApp only */}
                  {platform.type === "whatsapp" && (
                    <div className="border-r border-[#052698]/20 shrink-0">
                      <select
                        value={selectedCodes[platform.id] ?? "+1"}
                        onChange={(e) => setSelectedCodes((prev) => ({ ...prev, [platform.id]: e.target.value }))}
                        disabled={!platform.enabled}
                        className="h-full pl-2 pr-6 py-2 text-[16.6px] text-[#052698] bg-[#FCFDFF] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ appearance: "auto" }}
                      >
                        {countryCodes.map((c, i) => (
                          <option key={i} value={c.code}>
                            {c.flag} {c.code} {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Text input */}
                  <div className="flex-1 flex items-center px-3 bg-white">
                    <input
                      value={newValues[platform.id] ?? ""}
                      onChange={(e) => setNewValues((prev) => ({ ...prev, [platform.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addRecipient(platform.id, platform.type)}
                      placeholder={placeholder[platform.type]}
                      disabled={!platform.enabled}
                      className="flex-1 py-2.5 text-[16.6px] text-black placeholder-black/30 bg-transparent disabled:opacity-40"
                    />
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => addRecipient(platform.id, platform.type)}
                    disabled={!platform.enabled || saving === platform.id}
                    className="bg-[#052698] text-white px-4 py-2.5 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-[16.6px] shrink-0"
                  >
                    <IconPlus />
                    <span>{saving === platform.id ? "Adding…" : "Add"}</span>
                  </button>
                </div>

              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;
