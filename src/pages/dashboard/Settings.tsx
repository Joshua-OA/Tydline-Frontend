import { useState } from "react";

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pb-4 border-b border-[#052698]/12">
      <h3 className="text-[#052698] font-heading font-bold text-base">{title}</h3>
      {description && <p className="text-xs text-black/60 mt-0.5">{description}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
      <label className="text-xs text-black/70 md:w-40 shrink-0">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="flex-1 border border-[#052698]/25 bg-[#FCFDFF] px-3 py-2 text-sm text-black placeholder-[#545454]/30 focus:border-[#052698]/50 transition-colors"
    />
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn((p) => !p)}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${on ? "bg-[#052698]" : "bg-[#052698]/20"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function Settings() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight">Settings</h2>
        <p className="text-black/70 text-base mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-[#FCFDFF] border border-[#052698]/20 p-5 flex flex-col gap-5">
        <SectionHeader title="Profile" description="Your personal information and account details" />

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#052698] flex items-center justify-center text-white font-heading font-bold text-lg shrink-0">
            TY
          </div>
          <div>
            <p className="text-sm text-[#052698] font-medium">Team Account</p>
            <p className="text-xs text-black/60">Tydline Operations</p>
          </div>
          <button className="ml-auto border border-[#052698]/25 text-[#052698] text-sm px-3 py-1.5 hover:bg-[#052698]/5 transition-colors cursor-pointer">
            Change
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Full name">
            <TextInput defaultValue="Operations Manager" />
          </Field>
          <Field label="Email address">
            <TextInput defaultValue="ops@tydline.com" />
          </Field>
          <Field label="Company">
            <TextInput defaultValue="Tydline Logistics" />
          </Field>
          <Field label="Phone">
            <TextInput placeholder="+1 (555) 000-0000" />
          </Field>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#052698] text-white text-sm px-5 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications preferences */}
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
                <p className="text-sm text-black font-medium">{label}</p>
                <p className="text-xs text-black/50 mt-0.5">{sub}</p>
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
          {[
            { name: "WhatsApp Business", status: "Connected", color: "text-green-600 border-green-200 bg-green-50" },
            { name: "Gmail", status: "Connected", color: "text-green-600 border-green-200 bg-green-50" },
            { name: "Slack", status: "Not connected", color: "text-black/50 border-[#052698]/15 bg-transparent" },
            { name: "ERP / TMS", status: "Not connected", color: "text-black/50 border-[#052698]/15 bg-transparent" },
          ].map(({ name, status, color }) => (
            <div key={name} className="flex items-center justify-between border border-[#052698]/12 p-3">
              <div>
                <p className="text-sm text-black font-medium">{name}</p>
                <span className={`text-xs px-2 py-0.5 border ${color} mt-1 inline-block`}>{status}</span>
              </div>
              <button className="border border-[#052698]/25 text-[#052698] text-sm px-3 py-1.5 hover:bg-[#052698]/5 transition-colors cursor-pointer">
                {status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#FCFDFF] border border-red-200 p-5 flex flex-col gap-4">
        <SectionHeader title="Danger Zone" description="Irreversible actions — proceed with caution" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-black font-medium">Delete account</p>
            <p className="text-xs text-black/50 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="border border-red-200 text-red-600 text-sm px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
