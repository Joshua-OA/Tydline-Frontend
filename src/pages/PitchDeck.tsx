import { useState, useEffect, useCallback } from "react";

const BLUE = "#052698";

// ── Slide data ────────────────────────────────────────────────────────────────

const slides: { id: string; label: string }[] = [
  { id: "cover",        label: "Cover" },
  { id: "problem",      label: "Problem" },
  { id: "persona",      label: "Persona" },
  { id: "hacks",        label: "Current Hacks" },
  { id: "insights",     label: "Key Insights" },
  { id: "solution",     label: "Solution" },
  { id: "demo",         label: "Demo" },
  { id: "bmc",          label: "Business Model" },
  { id: "market",       label: "Market Size" },
  { id: "competitive",  label: "Competitive" },
  { id: "gtm",          label: "Go-to-Market" },
  { id: "economics",    label: "Unit Economics" },
  { id: "team",         label: "Team" },
  { id: "appendix",     label: "Appendix" },
];

// ── Shared primitives ─────────────────────────────────────────────────────────

function Tag({ children, invert = false }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <span
      className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5"
      style={{
        background: invert ? BLUE : `${BLUE}14`,
        color: invert ? "#fff" : BLUE,
        border: `1px solid ${BLUE}30`,
      }}
    >
      {children}
    </span>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5" style={{ borderLeft: `3px solid ${BLUE}` }} >
      <div className="pl-3">
        <div className="font-heading font-extrabold text-2xl md:text-3xl" style={{ color: BLUE }}>{value}</div>
        <div className="text-sm font-medium text-black/70">{label}</div>
        {sub && <div className="text-xs text-black/40 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function Check({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-black/80">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
      {text}
    </li>
  );
}

function Cross({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-black/80">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M18 6L6 18M6 6l12 12" /></svg>
      {text}
    </li>
  );
}

function Card({ children, highlight = false, className = "" }: { children: React.ReactNode; highlight?: boolean; className?: string }) {
  return (
    <div
      className={`px-5 py-4 flex flex-col gap-2 ${className}`}
      style={{
        border: `1px solid ${highlight ? BLUE : `${BLUE}25`}`,
        background: highlight ? `${BLUE}08` : "#FCFDFF",
      }}
    >
      {children}
    </div>
  );
}

// ── Individual slides ─────────────────────────────────────────────────────────

function SlideCover() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8">
      <img src="/tydline-sqaurlogo.png" alt="Tydline" className="w-16 mb-2" />
      <div className="flex flex-col gap-3">
        <Tag>Investor Pitch · 2026</Tag>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight" style={{ color: BLUE }}>
          TASA — your AI agent<br />for zero-delay imports.
        </h1>
        <p className="text-base md:text-lg text-black/65 max-w-xl mx-auto leading-relaxed">
          Tydline eliminates demurrage fees and manual shipment tracking by giving freight teams
          real-time, AI-powered visibility across every carrier — delivered where they already work.
        </p>
      </div>
      <div className="flex items-center gap-6 mt-2 flex-wrap justify-center">
        <Stat value="18" label="Carriers integrated" />
        <Stat value="$50–$1K" label="Monthly plans" />
        <Stat value="3 channels" label="Email · WhatsApp · ERP" />
      </div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>01 — Problem Statement</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          Freight teams are flying blind.
        </h2>
        <p className="text-sm md:text-base text-black/65 mt-1 max-w-2xl">
          Every importer we spoke to was doing the same thing every single day — and it was costing them money.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card highlight>
          <div className="font-heading font-bold text-base" style={{ color: BLUE }}>Manual checking</div>
          <p className="text-sm text-black/70 leading-relaxed">
            Ops teams log into 5+ carrier portals multiple times a day, refreshing manually hoping an ETA hasn't shifted.
          </p>
        </Card>
        <Card highlight>
          <div className="font-heading font-bold text-base" style={{ color: BLUE }}>Invisible delays</div>
          <p className="text-sm text-black/70 leading-relaxed">
            ETA changes aren't proactively pushed. By the time a team finds out, demurrage is already accruing at port.
          </p>
        </Card>
        <Card highlight>
          <div className="font-heading font-bold text-base" style={{ color: BLUE }}>Information silos</div>
          <p className="text-sm text-black/70 leading-relaxed">
            One person becomes the tracking bottleneck. Everyone else — procurement, finance, customs — chases updates via WhatsApp.
          </p>
        </Card>
      </div>

      <div className="flex gap-6 flex-wrap">
        <Stat value="$150–300" label="Demurrage per container / day" />
        <Stat value="3–5 hrs" label="Lost per week per ops person" sub="to manual tracking" />
        <Stat value="Days" label="Average delay detection lag" sub="when tracking manually" />
      </div>
    </div>
  );
}

function SlidePersona() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>02 — User Persona</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          Meet Ama — Operations Lead at a mid-size importer.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Profile</div>
            <ul className="flex flex-col gap-1.5">
              {[
                "Operations manager at a Ghana-based import company",
                "Handles 20–40 containers per month across Maersk, MSC & CMA CGM",
                "Team of 3–6 people responsible for freight clearance",
                "Reports directly to the MD on cargo arrival schedules",
              ].map((t) => <Check key={t} text={t} />)}
            </ul>
          </Card>
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Pain Points</div>
            <ul className="flex flex-col gap-1.5">
              {[
                "Loses half a morning refreshing carrier portals",
                "Gets blamed for demurrage fees she didn't cause",
                "Drowns in email chains and WhatsApp pings asking 'where's the cargo?'",
                "Has no single view across carriers — each has a different portal",
              ].map((t) => <Cross key={t} text={t} />)}
            </ul>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Goals</div>
            <ul className="flex flex-col gap-1.5">
              {[
                "Know about ETA changes before they become crises",
                "Share status updates without being the information middleman",
                "Reduce demurrage exposure on every shipment",
                "Spend less time on tracking, more on exception management",
              ].map((t) => <Check key={t} text={t} />)}
            </ul>
          </Card>
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Why Tydline</div>
            <p className="text-sm text-black/70 leading-relaxed">
              Ama needs a tool that works in the background, pushes the right alert at the right moment, and
              requires zero daily attention — delivered on WhatsApp, where she already lives.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SlideHacks() {
  const hacks = [
    {
      hack: "The Spreadsheet",
      desc: "A shared Google Sheet with container IDs, ETAs, and carrier links. Updated manually. Becomes stale by lunchtime.",
      cost: "3+ hrs/week",
    },
    {
      hack: "The Email Chain",
      desc: "Forwarding carrier confirmation emails to 5 colleagues. Nobody knows who's responsible for following up.",
      cost: "Missed updates",
    },
    {
      hack: "The Refresh Loop",
      desc: "Checking Maersk, MSC, CMA CGM, OOCL portals individually, multiple times per day. No aggregation, no alerting.",
      cost: "5 logins/day",
    },
    {
      hack: "The Freight Forwarder Ping",
      desc: "WhatsApp-ing the forwarder every morning asking 'any updates?' They check on your behalf — causing the same loop, one level up.",
      cost: "Latency + cost",
    },
    {
      hack: "The Calendar Reminder",
      desc: "Setting recurring reminders to manually check an ETA. Has no awareness of vessel reroutes, port congestion, or customs holds.",
      cost: "False confidence",
    },
    {
      hack: "The Junior Staff Check",
      desc: "Delegating portal monitoring to an entry-level employee who checks every few hours. One missed update = one demurrage invoice.",
      cost: "Human error",
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>03 — Current Hacks</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          How teams cope today — badly.
        </h2>
        <p className="text-sm text-black/60">Every workaround below is real. Every one is broken.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hacks.map((h) => (
          <Card key={h.hack}>
            <div className="flex items-center justify-between gap-2">
              <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{h.hack}</div>
              <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-200 font-medium whitespace-nowrap">{h.cost}</span>
            </div>
            <p className="text-xs text-black/65 leading-relaxed">{h.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideInsights() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>04 — Key Insights</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          The market has a signal problem, not a data problem.
        </h2>
        <p className="text-sm text-black/60 max-w-2xl">
          Carrier portals already have the data. The gap is intelligence — knowing which change actually matters
          and delivering that signal before it's too late.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-4">
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Insight 1 — Signal over noise</div>
            <p className="text-sm text-black/70 leading-relaxed">
              Teams don't need more updates — they need fewer, better ones. An ETA that shifts 2 hours is irrelevant.
              A customs hold the morning of arrival is critical. The difference requires intelligence.
            </p>
          </Card>
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Insight 2 — WhatsApp is infrastructure</div>
            <p className="text-sm text-black/70 leading-relaxed">
              In West Africa, WhatsApp isn't a messaging app — it's how business runs. Any freight tool that doesn't
              deliver into WhatsApp will lose to one that does.
            </p>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Insight 3 — Demurrage is the buying trigger</div>
            <p className="text-sm text-black/70 leading-relaxed">
              No importer wants to pay for a tool. They pay to avoid demurrage. One avoided bill at $300/day
              covers an entire year of the Starter plan. The ROI conversation is instant.
            </p>
          </Card>
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Insight 4 — Aggregation unlocks multi-team value</div>
            <p className="text-sm text-black/70 leading-relaxed">
              The moment visibility is centralised, it spreads across ops, procurement, finance, and
              customer success — multiplying seats and plan upgrades from a single initial sale.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>05 — Solution</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          Tydline — shipment visibility without the manual work.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TASA Feature Block */}
        <div
          className="px-5 py-5 flex flex-col gap-3 md:col-span-2"
          style={{ border: `1px solid ${BLUE}`, background: `${BLUE}06` }}
        >
          <div className="flex items-center gap-2">
            <Tag invert>Featured</Tag>
            <Tag>Powered by AI</Tag>
          </div>
          <h3 className="font-heading font-extrabold text-lg md:text-xl" style={{ color: BLUE }}>
            TASA — Tydline's Autonomous Shipping Agent
          </h3>
          <p className="text-sm text-black/70 leading-relaxed max-w-3xl">
            TASA is the intelligence layer behind Tydline. Rather than forwarding carrier status updates,
            TASA interprets them — understanding context, identifying patterns, and deciding which changes
            actually warrant attention. When a vessel is rerouted, a port is congested, or a customs hold appears,
            TASA evaluates the downstream impact on your specific delivery window and sends a targeted alert with
            the context you need to act. No noise. Just the signal that matters.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { title: "Real-Time ETA Monitoring", body: "Watches every milestone — departure, customs, port arrival, delivery — across 18+ carriers continuously." },
            { title: "Multi-Channel Alerts", body: "Email, WhatsApp, WhatsApp Business, or direct ERP/TMS push via API. Your workflow, not ours." },
            { title: "Custom Alert Rules", body: "Set thresholds: alert only when ETA shifts >48 hrs, or flag any customs hold immediately." },
          ].map((f) => (
            <Card key={f.title}>
              <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{f.title}</div>
              <p className="text-xs text-black/65 leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {[
            { title: "Multi-User Team Access", body: "Share visibility across ops, procurement, and customer success. No single bottleneck." },
            { title: "ERP & TMS Integration", body: "Push shipment status directly into your existing systems. Eliminate manual data entry." },
            { title: "Scalable Coverage", body: "10 to 450 shipments/month. Alert rules and integrations carry over seamlessly as you grow." },
          ].map((f) => (
            <Card key={f.title}>
              <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{f.title}</div>
              <p className="text-xs text-black/65 leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideDemo() {
  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>06 — Demo</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          From search to dashboard in under 3 minutes.
        </h2>
        <p className="text-sm text-black/60">The full user journey — no account, no sales call, no friction.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { step: "01", title: "Search", desc: "Enter a container ID, BL number, or vessel name on the landing page." },
          { step: "02", title: "See Result", desc: "Tydline returns live status, progress, ETA, and carrier data instantly." },
          { step: "03", title: "Subscribe", desc: "Choose a plan, pick your notification channel, enter your work email." },
          { step: "04", title: "Authenticate", desc: "Receive a magic link. One click — no password. Proceed to payment via MoMo." },
          { step: "05", title: "Dashboard", desc: "All active shipments in one view. Forward booking emails → auto-tracked." },
        ].map((s) => (
          <div key={s.step} className="flex flex-col gap-2 px-4 py-4" style={{ border: `1px solid ${BLUE}20`, background: "#FCFDFF" }}>
            <div className="font-heading font-extrabold text-3xl" style={{ color: `${BLUE}25` }}>{s.step}</div>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{s.title}</div>
            <p className="text-xs text-black/60 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
        <Card>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Dashboard — Upcoming Shipments</div>
          <p className="text-xs text-black/65">Active containers listed with vessel, route, progress bar, days remaining, and status (On Time / Delayed / In Transit).</p>
        </Card>
        <Card>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>TASA Timeline View</div>
          <p className="text-xs text-black/65">Phase-by-phase tracking: Origin → At Sea → Transshipment → Destination. Current milestone highlighted with live pulse indicator.</p>
        </Card>
        <Card>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Smart Onboarding</div>
          <p className="text-xs text-black/65">Forward or CC your carrier booking email to your Tydline tracking address — shipments appear automatically. No manual entry.</p>
        </Card>
      </div>
    </div>
  );
}

function SlideBMC() {
  const blocks = [
    {
      title: "Key Partners",
      items: ["Global carriers (Maersk, MSC, CMA CGM +15)", "ERP / TMS vendors", "Freight forwarders", "WhatsApp Business API providers"],
    },
    {
      title: "Key Activities",
      items: ["Carrier data ingestion & normalisation", "TASA intelligence layer development", "Alert delivery infrastructure", "Customer onboarding & support"],
    },
    {
      title: "Value Propositions",
      items: ["Eliminate manual tracking", "Prevent demurrage fees", "Multi-channel alerts (Email · WhatsApp · ERP)", "AI-powered delay detection"],
      highlight: true,
    },
    {
      title: "Customer Relationships",
      items: ["Self-serve SaaS onboarding", "Magic-link authentication", "Email & WhatsApp support", "Upgrade nudges at volume limits"],
    },
    {
      title: "Customer Segments",
      items: ["SME importers (10–40 containers/mo)", "Mid-size shippers (40–450/mo)", "Freight operations teams", "West Africa focus, globally scalable"],
    },
    {
      title: "Key Resources",
      items: ["Carrier API connections (18+)", "TASA AI agent", "Tracking email infrastructure", "Brand & positioning"],
    },
    {
      title: "Channels",
      items: ["Direct website (tydline.com)", "WhatsApp-native outreach", "Freight forwarder partnerships", "Organic search"],
    },
    {
      title: "Cost Structure",
      items: ["Carrier API access & data costs", "Cloud & alert delivery infra", "Engineering & product", "Customer acquisition"],
    },
    {
      title: "Revenue Streams",
      items: ["Starter: $50/mo · 10 shipments", "Growth: $125/mo · 40 shipments", "Pro: $1,000/mo · 450 shipments", "Custom enterprise pricing"],
      highlight: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full justify-center px-6 md:px-10">
      <div className="flex flex-col gap-1">
        <Tag>07 — Business Model Canvas</Tag>
        <h2 className="font-heading font-extrabold text-xl md:text-3xl mt-1" style={{ color: BLUE }}>
          A focused, subscription-first business.
        </h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2.5 flex-1">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="px-3 py-3 flex flex-col gap-1.5"
            style={{
              border: `1px solid ${b.highlight ? BLUE : `${BLUE}20`}`,
              background: b.highlight ? `${BLUE}08` : "#FCFDFF",
            }}
          >
            <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>{b.title}</div>
            <ul className="flex flex-col gap-1">
              {b.items.map((item) => (
                <li key={item} className="text-[11px] text-black/65 flex items-start gap-1.5">
                  <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: BLUE, opacity: 0.4 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideMarket() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>08 — Market Size</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          A massive global market with an underpenetrated African core.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card highlight>
          <div className="font-heading font-extrabold text-3xl" style={{ color: BLUE }}>$52B</div>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>TAM</div>
          <p className="text-xs text-black/65 leading-relaxed">
            Global freight visibility & supply chain visibility software market (2024).
            Growing at ~14% CAGR driven by e-commerce and global supply chain resilience demand.
          </p>
        </Card>
        <Card highlight>
          <div className="font-heading font-extrabold text-3xl" style={{ color: BLUE }}>$3.2B</div>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>SAM</div>
          <p className="text-xs text-black/65 leading-relaxed">
            SME & mid-market freight monitoring SaaS across Africa, MENA, and emerging markets.
            Sub-Saharan Africa's logistics tech spend growing 22% YoY.
          </p>
        </Card>
        <Card highlight>
          <div className="font-heading font-extrabold text-3xl" style={{ color: BLUE }}>$85M</div>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>SOM · 3-Year Target</div>
          <p className="text-xs text-black/65 leading-relaxed">
            ~5,000 active subscribers at blended ARPU of ~$140/mo across West Africa, Ghana and
            anglophone markets as primary beachhead.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
        {[
          { value: "800K+", label: "Containers cleared annually", sub: "Tema Port, Ghana alone" },
          { value: "~12,000", label: "Active importers in Ghana", sub: "GRA / customs data" },
          { value: "22%", label: "Africa logistics tech CAGR", sub: "2024–2030 forecast" },
          { value: "<5%", label: "Penetration of digital tracking", sub: "in SME importers today" },
        ].map((s) => <Stat key={s.label} value={s.value} label={s.label} sub={s.sub} />)}
      </div>
    </div>
  );
}

function SlideCompetitive() {
  const competitors = [
    { name: "Tydline", tracking: true, ai: true, whatsapp: true, africa: true, smePricing: true, erpInt: true, highlight: true },
    { name: "project44",  tracking: true, ai: true, whatsapp: false, africa: false, smePricing: false, erpInt: true, highlight: false },
    { name: "Portcast",   tracking: true, ai: true, whatsapp: false, africa: false, smePricing: false, erpInt: true, highlight: false },
    { name: "CargoX",     tracking: true, ai: false, whatsapp: false, africa: false, smePricing: false, erpInt: false, highlight: false },
    { name: "FourKites",  tracking: true, ai: true, whatsapp: false, africa: false, smePricing: false, erpInt: true, highlight: false },
    { name: "Manual / Portals", tracking: false, ai: false, whatsapp: false, africa: true, smePricing: true, erpInt: false, highlight: false },
  ];

  const cols = ["", "Real-Time Tracking", "AI Alerting", "WhatsApp Native", "Africa Focus", "SME Pricing", "ERP Integration"];

  function Tick({ yes }: { yes: boolean }) {
    return yes
      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
  }

  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>09 — Competitive Landscape</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          We win on focus, channel, and geography.
        </h2>
        <p className="text-sm text-black/60 max-w-2xl">
          Enterprise players don't serve SMEs. No competitor delivers AI-powered tracking to WhatsApp, at African SME price points.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 text-xs font-medium"
                  style={{ color: BLUE, borderBottom: `1px solid ${BLUE}20`, background: i === 0 ? "transparent" : `${BLUE}05` }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.name} style={{ background: c.highlight ? `${BLUE}08` : undefined, borderBottom: `1px solid ${BLUE}10` }}>
                <td className="px-3 py-2.5 font-heading font-bold text-xs" style={{ color: c.highlight ? BLUE : "inherit" }}>
                  {c.name}
                  {c.highlight && <span className="ml-1.5 text-[9px] px-1.5 py-0.5" style={{ background: BLUE, color: "#fff" }}>US</span>}
                </td>
                {[c.tracking, c.ai, c.whatsapp, c.africa, c.smePricing, c.erpInt].map((v, i) => (
                  <td key={i} className="px-3 py-2.5 text-center" style={{ background: `${BLUE}03` }}>
                    <div className="flex justify-center"><Tick yes={v} /></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: "vs. Enterprise players", body: "project44 / FourKites charge $30K–$100K+ / yr, require months-long integrations, and target Fortune 500 shippers. Zero relevance to African SMEs." },
          { title: "vs. Manual tracking", body: "The real competitor is the spreadsheet. Our ROI story (one avoided demurrage invoice pays for a full year) is the fastest objection handler in sales." },
          { title: "Our moat", body: "TASA intelligence layer + WhatsApp delivery + Africa-native pricing + carrier breadth (18 lines). Replicating all four takes 18+ months." },
        ].map((b) => (
          <Card key={b.title} highlight>
            <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>{b.title}</div>
            <p className="text-xs text-black/65 leading-relaxed">{b.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideGTM() {
  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>10 — Go-to-Market Strategy</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          Land in Ghana. Expand across West Africa. Scale globally.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            phase: "Phase 1 · Now",
            title: "Beachhead: Ghana Importers",
            items: [
              "Target 200+ active importers at Tema Port",
              "Self-serve SaaS — no sales team required",
              "WhatsApp-native onboarding & support",
              "Starter plan at $50/mo as low-friction entry",
              "Freight forwarder referral partnerships",
            ],
          },
          {
            phase: "Phase 2 · 12 Months",
            title: "West Africa Expansion",
            items: [
              "Nigeria, Côte d'Ivoire, Senegal rollout",
              "Local payment methods per market",
              "Growth plan push for teams >10 containers",
              "Channel partnerships with clearance agents",
              "WhatsApp Business broadcast campaigns",
            ],
          },
          {
            phase: "Phase 3 · 24+ Months",
            title: "Enterprise & Global",
            items: [
              "ERP integrations for Pro/Custom clients",
              "MENA, SEA, and LatAm entry",
              "API product for freight-adjacent platforms",
              "Aggregated data insights product layer",
              "Potential white-label for forwarder platforms",
            ],
          },
        ].map((p) => (
          <Card key={p.phase} highlight>
            <Tag>{p.phase}</Tag>
            <div className="font-heading font-bold text-sm mt-1" style={{ color: BLUE }}>{p.title}</div>
            <ul className="flex flex-col gap-1.5 mt-1">
              {p.items.map((i) => <Check key={i} text={i} />)}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Primary motion", value: "Product-led growth" },
          { label: "Entry hook", value: "Free tracking search" },
          { label: "Conversion", value: "Subscribe post-result" },
          { label: "Expansion", value: "Seat & plan upgrades" },
        ].map((s) => (
          <div key={s.label} className="px-3 py-3 flex flex-col gap-1" style={{ border: `1px solid ${BLUE}20`, background: "#FCFDFF" }}>
            <div className="text-xs text-black/45">{s.label}</div>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideEconomics() {
  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>11 — Unit Economics</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          High-margin SaaS with strong payback.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Pricing Summary</div>
            <div className="flex flex-col gap-2">
              {[
                { plan: "Starter", price: "$50/mo", vol: "10 containers", channel: "Email or WhatsApp" },
                { plan: "Growth", price: "$125/mo", vol: "40 containers", channel: "Email + WhatsApp" },
                { plan: "Pro", price: "$1,000/mo", vol: "450 containers", channel: "Email + WA + ERP" },
              ].map((p) => (
                <div key={p.plan} className="grid grid-cols-4 gap-2 px-3 py-2.5 text-xs" style={{ border: `1px solid ${BLUE}20`, background: "#FCFDFF" }}>
                  <span className="font-heading font-bold" style={{ color: BLUE }}>{p.plan}</span>
                  <span className="font-medium">{p.price}</span>
                  <span className="text-black/60">{p.vol}</span>
                  <span className="text-black/50">{p.channel}</span>
                </div>
              ))}
            </div>
          </div>
          <Card highlight>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Blended ARPU</div>
            <div className="font-heading font-extrabold text-2xl" style={{ color: BLUE }}>~$140 / mo</div>
            <p className="text-xs text-black/60">Assuming 60% Starter, 30% Growth, 10% Pro mix in early cohorts.</p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Estimated CAC", value: "~$80", sub: "PLG model — low paid acquisition" },
              { label: "LTV (24-mo)", value: "~$3,360", sub: "Blended ARPU × 24 months" },
              { label: "LTV:CAC", value: "42×", sub: "At blended ARPU, 24-month horizon" },
              { label: "Payback period", value: "<1 month", sub: "First MoMo payment covers CAC" },
            ].map((s) => (
              <Card key={s.label} highlight>
                <div className="text-xs text-black/45">{s.label}</div>
                <div className="font-heading font-extrabold text-2xl" style={{ color: BLUE }}>{s.value}</div>
                <div className="text-xs text-black/50">{s.sub}</div>
              </Card>
            ))}
          </div>
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Gross Margin Profile</div>
            <p className="text-xs text-black/65 leading-relaxed">
              Primary variable costs are carrier data API access and alert delivery infrastructure (email / WhatsApp).
              At scale, estimated gross margin of 70–80% consistent with infrastructure-light SaaS.
            </p>
          </Card>
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Demurrage ROI Framing</div>
            <p className="text-xs text-black/65 leading-relaxed">
              One container avoiding 3 days of demurrage at $200/day = $600 saved. That covers 12 months of
              the Starter plan. Every conversation starts with this math.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SlideTeam() {
  return (
    <div className="flex flex-col gap-6 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>12 — Team</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-4xl mt-2" style={{ color: BLUE }}>
          Built by people who understand freight and software.
        </h2>
        <p className="text-sm text-black/60 max-w-2xl">
          The team behind Tydline combines deep domain knowledge in African trade and logistics with
          full-stack product and engineering capability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            role: "Founder / Product",
            strength: "Domain expertise",
            bio: "Deep understanding of West African import operations, demurrage pain, and carrier workflows. Built Tydline from direct observation of how freight teams work.",
          },
          {
            role: "Engineering",
            strength: "Full-stack + AI",
            bio: "React, TypeScript, Node.js. Built TASA intelligence layer, carrier integrations, and the entire product end-to-end. Rapid iteration pace.",
          },
          {
            role: "Growth / Ops",
            strength: "GTM & Partnerships",
            bio: "Freight forwarder and importer network across Ghana. Driving early customer conversations, onboarding, and channel partnerships.",
          },
        ].map((m) => (
          <Card key={m.role} highlight>
            <Tag>{m.role}</Tag>
            <div className="font-heading font-bold text-sm mt-1" style={{ color: BLUE }}>{m.strength}</div>
            <p className="text-sm text-black/65 leading-relaxed">{m.bio}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Why us</div>
          <p className="text-sm text-black/65 leading-relaxed">
            We didn't read about this problem in a report — we watched it happen. Every design decision, every
            feature, every pricing tier was shaped by direct conversations with the freight teams who will use it.
          </p>
        </Card>
        <Card>
          <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Advisors & Network</div>
          <p className="text-sm text-black/65 leading-relaxed">
            Connected to Tema Port operators, licensed clearing agents, and freight forwarder associations in Ghana.
            Network extends to Nigeria, Côte d'Ivoire, and Senegal for Phase 2 expansion.
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-sm text-black/50">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <a href="mailto:hello@tydline.com" style={{ color: BLUE }}>hello@tydline.com</a>
        <span>·</span>
        <a href="https://tydline.com" style={{ color: BLUE }}>tydline.com</a>
      </div>
    </div>
  );
}

function SlideAppendix() {
  return (
    <div className="flex flex-col gap-5 h-full justify-center px-6 md:px-12">
      <div className="flex flex-col gap-1">
        <Tag>13 — Appendix</Tag>
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl mt-2" style={{ color: BLUE }}>
          Supporting data & references.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Carriers Integrated (18+)</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["Maersk","CMA CGM","Hapag-Lloyd","OOCL","COSCO","MSC","Grimaldi","Arkas","PIL",
                "Safmarine","BBC Chartering","Africa Express Line","Gold Star Line","ONE","ZIM","MOL","NileDutch","Evergreen"].map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 font-medium" style={{ border: `1px solid ${BLUE}20`, color: BLUE, background: `${BLUE}05` }}>{c}</span>
              ))}
            </div>
          </Card>

          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Tech Stack</div>
            <ul className="flex flex-col gap-1 mt-1">
              {[
                "Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4",
                "Auth: Magic link (passwordless) via email",
                "Payments: Mobile Money (MoMo) — GH₵ native",
                "Notifications: Email, WhatsApp, WhatsApp Business API",
                "Integrations: ERP/TMS via REST API (Pro tier)",
                "Infrastructure: Scalable cloud, API-first backend",
              ].map((t) => <li key={t} className="text-xs text-black/65">{t}</li>)}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Market Sources</div>
            <ul className="flex flex-col gap-1 mt-1">
              {[
                "Global supply chain visibility market: Grand View Research, 2024",
                "Africa logistics tech growth: McKinsey Africa Logistics Report, 2023",
                "Tema Port container throughput: Ghana Ports & Harbours Authority (GPHA)",
                "Demurrage cost benchmarks: Drewry Container Forecaster",
                "SME importer penetration: GRA customs registration data",
                "WhatsApp business usage Africa: Meta Business Summit, 2023",
              ].map((s) => <li key={s} className="text-xs text-black/65 flex items-start gap-1.5"><span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: BLUE, opacity: 0.4 }} />{s}</li>)}
            </ul>
          </Card>

          <Card>
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Glossary</div>
            <ul className="flex flex-col gap-1 mt-1">
              {[
                ["Demurrage", "Fee charged when a container is not collected from the port within the free period"],
                ["ETA", "Estimated Time of Arrival — the projected date a vessel reaches port"],
                ["BL / Bill of Lading", "Shipping document used to track and identify a cargo shipment"],
                ["TASA", "Tydline's Autonomous Shipping Agent — the AI layer interpreting tracking events"],
                ["ERP / TMS", "Enterprise Resource Planning / Transport Management System — business ops software"],
              ].map(([term, def]) => (
                <li key={term} className="text-xs text-black/65"><span style={{ color: BLUE, fontWeight: 600 }}>{term}</span>: {def}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Slide registry ────────────────────────────────────────────────────────────

const SLIDE_COMPONENTS = [
  SlideCover,
  SlideProblem,
  SlidePersona,
  SlideHacks,
  SlideInsights,
  SlideSolution,
  SlideDemo,
  SlideBMC,
  SlideMarket,
  SlideCompetitive,
  SlideGTM,
  SlideEconomics,
  SlideTeam,
  SlideAppendix,
];

// ── Main deck component ───────────────────────────────────────────────────────

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const total = SLIDE_COMPONENTS.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")                   { e.preventDefault(); prev(); }
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const SlideContent = SLIDE_COMPONENTS[current];

  return (
    <div className="w-screen h-screen bg-[#F9E4D2] overflow-hidden flex flex-col" style={{ fontFamily: "inherit" }}>
      {/* Deck shell */}
      <div
        className="flex-1 flex flex-col border-x-[0.5px] border-[#052698]/30 mx-2 md:mx-5 overflow-hidden"
        style={{ backgroundImage: brickSvg, background: "#FFF9F5" }}
      >
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-5 h-12 border-b border-[#052698]/20">
          <div className="flex items-center gap-3">
            <img src="/tydline-sqaurlogo.png" alt="Tydline" className="w-8" />
            <span className="text-xs font-medium text-black/40 hidden sm:block">Investor Pitch · 2026</span>
          </div>

          {/* Nav dots + label */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 text-xs text-black/50 hover:text-[#052698] transition-colors cursor-pointer"
          >
            <span style={{ color: BLUE }} className="font-medium">{current + 1}</span>
            <span>/</span>
            <span>{total}</span>
            <span className="ml-1 hidden sm:block">{slides[current].label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-8 h-8 flex items-center justify-center border border-[#052698]/20 hover:bg-[#052698]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={next}
              disabled={current === total - 1}
              className="w-8 h-8 flex items-center justify-center border border-[#052698]/20 hover:bg-[#052698]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Slide menu */}
        {menuOpen && (
          <div
            className="absolute top-12 right-0 z-50 w-56 border-l border-b border-[#052698]/20 bg-white overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 4rem)", right: "calc(0.625rem + 1px)" }}
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setCurrent(i); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#052698]/5 flex items-center gap-3 cursor-pointer"
                style={{ borderBottom: `1px solid ${BLUE}10`, background: i === current ? `${BLUE}08` : undefined }}
              >
                <span className="font-medium tabular-nums" style={{ color: `${BLUE}60` }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: i === current ? BLUE : "inherit", fontWeight: i === current ? 600 : undefined }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="shrink-0 h-0.5 bg-[#052698]/10 relative">
          <div
            className="h-full bg-[#052698] transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full py-2">
            <SlideContent />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="shrink-0 flex items-center justify-between px-5 h-10 border-t border-[#052698]/15">
          <span className="text-[11px] text-black/30">Use ← → keys to navigate</span>
          <div className="flex items-center gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? BLUE : `${BLUE}30`,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <a href="/" className="text-[11px] text-black/30 hover:text-[#052698] transition-colors">
            tydline.com →
          </a>
        </div>
      </div>
    </div>
  );
}
