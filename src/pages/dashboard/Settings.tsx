import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useApp } from "../../store/appContext";

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pb-4 border-b border-[#052698]/12">
      <h3 className="text-[#052698] font-heading font-bold text-[18.6px]">{title}</h3>
      {description && <p className="text-[14.6px] text-black/80 mt-0.5">{description}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
      <label className="text-[14.6px] text-black/85 md:w-40 shrink-0">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="flex-1 border border-[#052698]/25 bg-[#FCFDFF] px-3 py-2 text-[16.6px] text-black placeholder-[#545454]/30 focus:border-[#052698]/50 transition-colors"
    />
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn((p) => !p)}
      className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${on ? "bg-[#052698]" : "bg-[#052698]/20"}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

const planLabel: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
  custom: "Custom",
};

const planColor: Record<string, string> = {
  starter: "bg-black/5 text-black/80 border-black/15",
  growth: "bg-[#052698]/8 text-[#052698] border-[#052698]/20",
  pro: "bg-amber-50 text-amber-700 border-amber-200",
  custom: "bg-green-50 text-green-700 border-green-200",
};

type PlanInfo = {
  plan: string;
  status: string;
};

function Settings({ waPhoneSet }: { waPhoneSet?: boolean | null }) {
  const { selectedPackage, trackingEmail } = useApp();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    api.getPlan()
      .then((data) => setPlanInfo(data as PlanInfo))
      .catch(() => setPlanInfo(null))
      .finally(() => setPlanLoading(false));
  }, []);

  const plan = planInfo?.plan ?? selectedPackage?.plan ?? "starter";
  const planDisplay = planLabel[plan] ?? plan;
  const hasWhatsApp = plan === "growth" || plan === "pro" || plan === "custom";

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-[#052698] text-[26.6px] font-heading font-extrabold tracking-tight">Settings</h2>
        <p className="text-black/85 text-[18.6px] mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Subscription */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-5">
        <SectionHeader title="Subscription" description="Your current plan and billing status" />
        <div className="flex items-center justify-between">
          <div>
            {planLoading ? (
              <p className="text-[16.6px] text-black/80">Loading plan…</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-[16.6px] text-black font-medium">{planDisplay} Plan</p>
                  <span className={`text-[12.6px] px-2 py-0.5 border ${planColor[plan] ?? planColor.starter}`}>
                    {planInfo?.status === "active" ? "Active" : "Active"}
                  </span>
                </div>
                {trackingEmail && (
                  <p className="text-[14.6px] text-black/85 mt-0.5">
                    Tracking email: <span className="text-[#052698] font-medium">{trackingEmail}</span>
                  </p>
                )}
              </>
            )}
          </div>
          <button className="border border-[#052698]/25 text-[#052698] text-[16.6px] px-3 py-1.5 hover:bg-[#052698]/5 transition-colors cursor-pointer">
            Upgrade
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-5">
        <SectionHeader title="Profile" description="Your personal information and account details" />

        <div className="flex flex-col gap-4">
          <Field label="Full name">
            <TextInput placeholder="Your name" />
          </Field>
          <Field label="Email address">
            <TextInput placeholder="you@company.com" />
          </Field>
          <Field label="Company">
            <TextInput placeholder="Company name" />
          </Field>
          <Field label="Phone">
            <TextInput placeholder="+1 (555) 000-0000" />
          </Field>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#052698] text-white text-[16.6px] px-5 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-5">
        <SectionHeader title="Notification Preferences" description="Choose what you want to be alerted about" />
        <div className="flex flex-col gap-4">
          {[
            { label: "Demurrage alerts", sub: "Notify before free time expires", defaultOn: true },
            { label: "Vessel delays", sub: "ETA changes greater than 6 hours", defaultOn: true },
            { label: "Customs clearance", sub: "Status updates from port authorities", defaultOn: true },
            { label: "Approval requests", sub: "New items requiring your review", defaultOn: true },
            { label: "Weekly reports", sub: "Automated summary every Monday", defaultOn: false },
            { label: "Marketing updates", sub: "Product news and feature releases", defaultOn: false },
          ].map(({ label, sub, defaultOn }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-[16.6px] text-black font-medium">{label}</p>
                <p className="text-[14.6px] text-black/85 mt-0.5">{sub}</p>
              </div>
              <Toggle defaultChecked={defaultOn} />
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-5">
        <SectionHeader title="Integrations" description="Connect Tydline to your existing tools" />
        <div className="flex flex-col gap-3">
          {/* Mail — available on all plans */}
          <div className="flex items-center justify-between border border-[#052698]/12 p-3">
            <div>
              <p className="text-[16.6px] text-black font-medium">Mail</p>
              <span className="text-[14.6px] px-2 py-0.5 border text-green-600 border-green-200 bg-green-50 mt-1 inline-block">Connected</span>
            </div>
            <button className="border border-[#052698]/25 text-[#052698] text-[16.6px] px-3 py-1.5 hover:bg-[#052698]/5 transition-colors cursor-pointer">
              Disconnect
            </button>
          </div>

          {/* WhatsApp — Growth / Pro / Custom only */}
          <div className={`flex items-center justify-between border border-[#052698]/12 p-3 ${!hasWhatsApp ? "opacity-60" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[16.6px] text-black font-medium">WhatsApp Business</p>
                {!hasWhatsApp && (
                  <span className="text-[12.6px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">Growth plan</span>
                )}
              </div>
              {hasWhatsApp ? (
                waPhoneSet === false ? (
                  <span className="text-[14.6px] px-2 py-0.5 border text-amber-700 border-amber-200 bg-amber-50 mt-1 inline-block">Disconnected — setup pending</span>
                ) : (
                  <span className="text-[14.6px] px-2 py-0.5 border text-green-600 border-green-200 bg-green-50 mt-1 inline-block">Connected</span>
                )
              ) : (
                <span className="text-[14.6px] px-2 py-0.5 border text-black/80 border-black/10 bg-transparent mt-1 inline-block">Not available on Starter</span>
              )}
            </div>
            {hasWhatsApp ? (
              waPhoneSet === false ? (
                <span className="text-[14.6px] text-amber-700 italic">Pending setup</span>
              ) : (
                <button className="border border-[#052698]/25 text-[#052698] text-[16.6px] px-3 py-1.5 hover:bg-[#052698]/5 transition-colors cursor-pointer">
                  Disconnect
                </button>
              )
            ) : (
              <button
                disabled
                className="border border-[#052698]/15 text-[#052698]/40 text-[16.6px] px-3 py-1.5 cursor-not-allowed"
              >
                Upgrade to unlock
              </button>
            )}
          </div>

          {/* ERP — coming soon */}
          <div className="flex items-center justify-between border border-[#052698]/12 p-3 opacity-60">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[16.6px] text-black font-medium">ERP / TMS</p>
                <span className="text-[12.6px] px-1.5 py-0.5 bg-black/5 text-black/85 border border-black/10">Coming soon</span>
              </div>
              <span className="text-[14.6px] px-2 py-0.5 border text-black/80 border-black/10 bg-transparent mt-1 inline-block">Not connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#FCFDFF] border border-red-200 p-5 flex flex-col gap-4">
        <SectionHeader title="Danger Zone" description="Irreversible actions — proceed with caution" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16.6px] text-black font-medium">Delete account</p>
            <p className="text-[14.6px] text-black/85 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="border border-red-200 text-red-600 text-[16.6px] px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
