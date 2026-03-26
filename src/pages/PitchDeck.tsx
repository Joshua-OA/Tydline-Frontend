import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { toPng } from "html-to-image";
import PptxGenJS from "pptxgenjs";

const BLUE = "#052698";
const CREAM = "#FFF9F5";
const OUTER = "#F9E4D2";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

// ── Slide registry ─────────────────────────────────────────────────────────────
const slides = [
  { id: "cover",       label: "Cover" },
  { id: "problem",     label: "Problem" },
  { id: "persona",     label: "Persona" },
  { id: "hacks",       label: "Current Hacks" },
  { id: "insights",    label: "Key Insights" },
  { id: "solution",    label: "Solution" },
  { id: "demo",        label: "Demo" },
  { id: "bmc",         label: "Business Model" },
  { id: "market",      label: "Market Size" },
  { id: "competitive", label: "Competitive" },
  { id: "gtm",         label: "Go-to-Market" },
  { id: "economics",   label: "Unit Economics" },
  { id: "team",        label: "Team" },
  { id: "appendix",    label: "Appendix" },
];

// ── Shared primitives ──────────────────────────────────────────────────────────

function Tag({ children, invert = false }: { children: ReactNode; invert?: boolean }) {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1"
      style={{ background: invert ? BLUE : `${BLUE}12`, color: invert ? "#fff" : BLUE, border: `1px solid ${BLUE}30` }}>
      {children}
    </span>
  );
}

function SlideHeader({ tag, title, sub }: { tag: string; title: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 mb-6">
      <Tag>{tag}</Tag>
      <h2 className="font-heading font-extrabold text-2xl md:text-3xl leading-tight" style={{ color: BLUE }}>{title}</h2>
      {sub && <p className="text-sm text-black/50 max-w-2xl">{sub}</p>}
    </div>
  );
}

function Card({ children, highlight = false, className = "" }: { children: ReactNode; highlight?: boolean; className?: string }) {
  return (
    <div className={`px-4 py-4 flex flex-col gap-2 ${className}`}
      style={{ border: `1px solid ${highlight ? BLUE : `${BLUE}22`}`, background: highlight ? `${BLUE}07` : CREAM }}>
      {children}
    </div>
  );
}

function Check({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-black/75">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
      {text}
    </li>
  );
}

function Cross({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-black/75">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M18 6L6 18M6 6l12 12" /></svg>
      {text}
    </li>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
function Icon({ d, size = 22, color = BLUE, strokeWidth = 1.6 }: { d: string; size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {d.split("|").map((path, i) => <path key={i} d={path} />)}
    </svg>
  );
}

// ── Charts ─────────────────────────────────────────────────────────────────────

/** Concentric circle TAM/SAM/SOM chart */
function ConcentricCircles() {
  const rings = [
    { label: "TAM", value: "$52B", r: 90, color: `${BLUE}18` },
    { label: "SAM", value: "$3.2B", r: 62, color: `${BLUE}35` },
    { label: "SOM", value: "$85M", r: 36, color: BLUE },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        {rings.map((r) => (
          <circle key={r.label} cx="0" cy="0" r={r.r} fill={r.color} stroke={`${BLUE}40`} strokeWidth="1" />
        ))}
        {rings.map((r) => (
          <text key={r.label + "t"} x="0" y={-r.r + 16} textAnchor="middle" fontSize="8" fontWeight="700" fill={r.label === "SOM" ? "#fff" : BLUE} fontFamily="inherit">
            {r.label}
          </text>
        ))}
        {rings.map((r) => (
          <text key={r.label + "v"} x="0" y={-r.r + 27} textAnchor="middle" fontSize="9" fontWeight="800" fill={r.label === "SOM" ? "#fff" : BLUE} fontFamily="inherit">
            {r.value}
          </text>
        ))}
      </svg>
      <div className="flex gap-4">
        {rings.map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5" style={{ background: r.color, border: `1px solid ${BLUE}50` }} />
            <span className="text-xs text-black/60">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Horizontal bar chart */
function BarChart({ data }: { data: { label: string; value: number; display: string; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="text-xs text-black/55 w-28 text-right shrink-0">{d.label}</div>
          <div className="flex-1 h-6 relative" style={{ background: `${BLUE}08` }}>
            <div
              className="h-full flex items-center transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? BLUE }}
            >
              <span className="text-[10px] font-bold text-white pl-2 whitespace-nowrap">{d.display}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Donut / pie chart */
function DonutChart({ segments, size = 130 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const r = 42; const cx = 65; const cy = 65;
  function polarToXY(pct: number) {
    const angle = (pct * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  const segmentsWithOffsets = segments.map((seg, i) => {
    const start = segments.slice(0, i).reduce((acc, s) => acc + s.value / total, 0);
    return { ...seg, start, end: start + seg.value / total };
  });
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 130 130">
        {segmentsWithOffsets.map((seg) => {
          const p1 = polarToXY(seg.start);
          const p2 = polarToXY(seg.end);
          const large = seg.value / total > 0.5 ? 1 : 0;
          const d = `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
          return <path key={seg.label} d={d} fill={seg.color} stroke="#fff" strokeWidth="2" />;
        })}
        <circle cx={cx} cy={cy} r={24} fill={CREAM} />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={BLUE} fontFamily="inherit">MRR</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill={BLUE} fontFamily="inherit">Mix</text>
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 shrink-0" style={{ background: s.color }} />
            <span className="text-[11px] text-black/60">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Funnel chart */
function Funnel({ steps }: { steps: { label: string; value: string; pct: number }[] }) {
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center w-full">
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              width: `${100 - i * 14}%`,
              background: `${BLUE}${Math.round(25 + i * 18).toString(16).padStart(2,"0")}`,
              border: `1px solid ${BLUE}30`,
            }}
          >
            <span className="text-xs font-medium" style={{ color: i > 1 ? "#fff" : BLUE }}>{s.label}</span>
            <span className="text-xs font-bold" style={{ color: i > 1 ? "#fff" : BLUE }}>{s.value}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${BLUE}30` }} />
          )}
        </div>
      ))}
    </div>
  );
}

/** Simple vertical bar chart */
function VerticalBars({ data }: { data: { label: string; value: number; display: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const barH = 80;
  return (
    <div className="flex items-end justify-center gap-4 w-full">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold" style={{ color: BLUE }}>{d.display}</span>
          <div
            style={{
              width: 36,
              height: Math.max(8, (d.value / max) * barH),
              background: `${BLUE}${["ff", "bb", "77", "44"][i % 4]}`,
              border: `1px solid ${BLUE}40`,
            }}
          />
          <span className="text-[10px] text-black/50 text-center leading-tight w-16">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Slides ─────────────────────────────────────────────────────────────────────

function SlideCover() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-6 py-4">
      <img src="/tydline-sqaurlogo.png" alt="Tydline" className="w-20 mb-1" />

      <div className="flex flex-col items-center gap-3">
        <Tag>Investor Pitch · 2026</Tag>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight max-w-2xl" style={{ color: BLUE }}>
          TASA — your AI agent<br />for zero-delay imports.
        </h1>
        <p className="text-base text-black/60 max-w-xl leading-relaxed">
          Tydline eliminates demurrage fees and manual shipment tracking by giving freight teams
          real-time, AI-powered visibility across every carrier — delivered where they already work.
        </p>
      </div>

      {/* Hero visual */}
      <div className="w-full max-w-lg border border-[#052698]/20 bg-[#FCFDFF] p-5 flex flex-col gap-3">
        {/* Mock notification cards */}
        {[
          { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", color: "#25D366", label: "WhatsApp", msg: "ETA changed: MSKU7234891 now arriving Mar 26 (+2 days). Action required." },
          { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: BLUE, label: "Email", msg: "Customs hold detected on HLCU4521037 — Tema Port. Estimated 48hr delay." },
          { icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18", color: "#7c3aed", label: "ERP Push", msg: "Shipment CMAU1983204 updated in your TMS — ETA confirmed Mar 29." },
        ].map((n) => (
          <div key={n.label} className="flex items-start gap-3 px-3 py-2.5 border border-[#052698]/10 bg-white">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full" style={{ background: `${n.color}18` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={n.icon} />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: n.color }}>{n.label}</span>
              <span className="text-xs text-black/65 leading-snug mt-0.5">{n.msg}</span>
            </div>
            <span className="text-[10px] text-black/30 shrink-0 mt-0.5">Just now</span>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div className="flex items-center divide-x divide-[#052698]/15 border border-[#052698]/15 bg-[#FCFDFF]">
        {[
          { v: "18+", l: "Carriers" },
          { v: "3", l: "Alert channels" },
          { v: "$50/mo", l: "Starting price" },
          { v: "TASA", l: "AI-powered" },
        ].map((s) => (
          <div key={s.l} className="px-5 py-3 flex flex-col items-center gap-0.5">
            <div className="font-heading font-extrabold text-lg" style={{ color: BLUE }}>{s.v}</div>
            <div className="text-[10px] text-black/45 uppercase tracking-wide">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="01 — Problem"
        title="Freight teams are flying blind."
        sub="Every importer we spoke to was doing the same thing every day — and it was costing them real money."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {[
          {
            icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z|M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            title: "Manual Checking",
            body: "Ops teams log into 5+ carrier portals multiple times a day, refreshing manually hoping an ETA hasn't shifted.",
            stat: "5+ logins/day",
            statColor: "#dc2626",
          },
          {
            icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
            title: "Invisible Delays",
            body: "ETA changes aren't proactively pushed. By the time a team finds out, demurrage is already accruing at port.",
            stat: "$150–300/day",
            statColor: "#dc2626",
          },
          {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            title: "Information Silos",
            body: "One person becomes the tracking bottleneck. Everyone else — procurement, finance, customs — chases updates via WhatsApp.",
            stat: "3–5 hrs/week lost",
            statColor: "#dc2626",
          },
        ].map((p) => (
          <Card key={p.title} highlight className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25` }}>
              <Icon d={p.icon} size={22} />
            </div>
            <div className="font-heading font-bold text-base" style={{ color: BLUE }}>{p.title}</div>
            <p className="text-sm text-black/65 leading-relaxed">{p.body}</p>
            <div className="mt-auto px-3 py-1.5 text-xs font-bold" style={{ background: "#fef2f2", color: p.statColor, border: "1px solid #fecaca" }}>
              {p.stat}
            </div>
          </Card>
        ))}
      </div>

      {/* Cost bar chart */}
      <div className="w-full max-w-4xl border border-[#052698]/15 bg-[#FCFDFF] px-6 py-4">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3 text-center">Annual cost of poor shipment visibility (per company)</div>
        <BarChart data={[
          { label: "Demurrage fees", value: 18000, display: "$18,000+" },
          { label: "Manual tracking hours", value: 7800, display: "$7,800" },
          { label: "Expediting costs", value: 5200, display: "$5,200" },
          { label: "Missed SLAs", value: 12000, display: "$12,000" },
        ]} />
      </div>
    </div>
  );
}

function SlidePersona() {
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="02 — User Persona"
        title='Meet Ama — Operations Lead at a mid-size importer.'
        sub="She manages 20–40 containers a month across multiple carriers. She's busy, underserved, and losing money."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* Avatar card */}
        <Card className="flex flex-col items-center text-center gap-3 col-span-1">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${BLUE}12`, border: `2px solid ${BLUE}25` }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg" style={{ color: BLUE }}>Ama Asante</div>
            <div className="text-xs text-black/50">Operations Manager</div>
            <div className="text-xs text-black/40">Accra, Ghana</div>
          </div>
          <div className="w-full flex flex-col gap-1.5 mt-1">
            {[
              { label: "Company size", value: "50–200 staff" },
              { label: "Containers/mo", value: "20–40" },
              { label: "Carriers used", value: "3–5" },
              { label: "Team size", value: "3–6 ops" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-xs px-2 py-1" style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}10` }}>
                <span className="text-black/50">{r.label}</span>
                <span className="font-medium" style={{ color: BLUE }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pain + Goals */}
        <div className="flex flex-col gap-3 col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                <div className="font-heading font-bold text-xs" style={{ color: "#dc2626" }}>Pain Points</div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Loses half a morning refreshing carrier portals",
                  "Gets blamed for demurrage she didn't cause",
                  "Drowns in WhatsApp pings: 'where's the cargo?'",
                  "No single view across carriers",
                ].map((t) => <Cross key={t} text={t} />)}
              </ul>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div className="font-heading font-bold text-xs" style={{ color: "#16a34a" }}>Goals</div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Know about ETA changes before they become crises",
                  "Share status without being the bottleneck",
                  "Reduce demurrage on every shipment",
                  "Spend time on exceptions, not tracking",
                ].map((t) => <Check key={t} text={t} />)}
              </ul>
            </Card>
          </div>

          {/* Time breakdown visual */}
          <Card>
            <div className="font-heading font-bold text-xs mb-2" style={{ color: BLUE }}>Ama's work week — where time actually goes</div>
            <div className="flex flex-col gap-1.5">
              {[
                { task: "Manual portal checking", hrs: 5, pct: 75, color: "#dc2626" },
                { task: "Chasing updates (WhatsApp / email)", hrs: 3, pct: 50, color: "#f97316" },
                { task: "Exception management (actual work)", hrs: 2, pct: 30, color: BLUE },
                { task: "Reporting", hrs: 1.5, pct: 22, color: `${BLUE}80` },
              ].map((r) => (
                <div key={r.task} className="flex items-center gap-2">
                  <div className="text-[10px] text-black/50 w-44 shrink-0">{r.task}</div>
                  <div className="flex-1 h-4 relative" style={{ background: `${BLUE}08` }}>
                    <div className="h-full" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                  <div className="text-[10px] font-bold w-10 shrink-0" style={{ color: r.color }}>{r.hrs}h/wk</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="px-4 py-3 flex items-center gap-3" style={{ background: `${BLUE}07`, border: `1px solid ${BLUE}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="text-sm text-black/70 leading-snug">
              <span className="font-semibold" style={{ color: BLUE }}>Ama's insight:</span> "One avoided demurrage charge pays for an entire year of Tydline. It's not a hard conversation."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideHacks() {
  const hacks = [
    { icon: "M3 10h18M3 6h18M3 14h18M3 18h18", title: "The Spreadsheet", desc: "Shared Google Sheet updated manually. Stale by lunchtime. Nobody's sure whose version is current.", cost: "~3 hrs/week" },
    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "The Email Chain", desc: "Forwarding carrier confirmations to 5 colleagues. Nobody knows who's responsible for following up.", cost: "Missed updates" },
    { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "The Refresh Loop", desc: "Checking Maersk, MSC, CMA CGM, OOCL portals individually, multiple times per day.", cost: "5+ logins/day" },
    { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", title: "The Forwarder Ping", desc: "WhatsApp-ing the forwarder each morning. They check on your behalf — the same loop, one level up.", cost: "Latency + fees" },
    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "The Calendar Reminder", desc: "Recurring reminders to check ETAs manually. No awareness of vessel reroutes or port congestion.", cost: "False confidence" },
    { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "The Junior Staff Check", desc: "Delegating portal monitoring to a junior employee. One missed update = one demurrage invoice.", cost: "Human error" },
  ];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="03 — Current Hacks"
        title="How teams cope today — badly."
        sub="Every workaround below is real. Every one is broken."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-4xl">
        {hacks.map((h, i) => (
          <Card key={h.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}20` }}>
                <Icon d={h.icon} size={16} />
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{h.title}</div>
            </div>
            <p className="text-xs text-black/60 leading-relaxed">{h.desc}</p>
            <div className="flex items-center justify-between mt-auto pt-1">
              <span className="text-[10px] text-black/30">Hack #{i + 1}</span>
              <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{h.cost}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="w-full max-w-4xl px-4 py-3 flex items-center justify-center gap-2 border border-[#052698]/20" style={{ background: `${BLUE}06` }}>
        <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={16} />
        <p className="text-sm text-black/60">The real competitor isn't software — <span className="font-semibold" style={{ color: BLUE }}>it's the spreadsheet and the WhatsApp group.</span></p>
      </div>
    </div>
  );
}

function SlideInsights() {
  const insights = [
    { n: "01", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Signal over noise", body: "Teams don't need more updates — they need fewer, better ones. An ETA that shifts 2 hours is irrelevant. A customs hold the morning of arrival is critical. That difference requires intelligence." },
    { n: "02", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", title: "WhatsApp is infrastructure", body: "In West Africa, WhatsApp isn't a messaging app — it's how business runs. Any freight tool that doesn't deliver into WhatsApp will lose to one that does. Full stop." },
    { n: "03", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Demurrage is the buying trigger", body: "No importer wants to pay for a tool. They pay to avoid demurrage. One avoided bill at $300/day covers an entire year of the Starter plan. The ROI conversation takes 30 seconds." },
    { n: "04", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Aggregation unlocks team expansion", body: "The moment visibility is centralised, it spreads across ops, procurement, finance, and customer success — multiplying seats and plan upgrades from a single initial sale." },
  ];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="04 — Key Insights"
        title="The market has a signal problem, not a data problem."
        sub="Carrier portals already have the data. The gap is intelligence."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {insights.map((ins) => (
          <Card key={ins.n} highlight className="flex flex-row gap-4 items-start">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="font-heading font-extrabold text-2xl leading-none" style={{ color: `${BLUE}25` }}>{ins.n}</div>
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25` }}>
                <Icon d={ins.icon} size={20} />
              </div>
            </div>
            <div>
              <div className="font-heading font-bold text-sm mb-1" style={{ color: BLUE }}>{ins.title}</div>
              <p className="text-sm text-black/65 leading-relaxed">{ins.body}</p>
            </div>
          </Card>
        ))}
      </div>
      {/* Insight summary visual */}
      <div className="w-full max-w-4xl border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3 text-center">What matters vs. what exists today</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Importers with real-time AI alerts", have: 5, need: 100 },
            { label: "Carriers with proactive delay push", have: 12, need: 100 },
            { label: "Ops teams with unified visibility", have: 8, need: 100 },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className="text-xs text-black/50 leading-snug">{s.label}</div>
              <div className="w-full h-3 relative" style={{ background: `${BLUE}10` }}>
                <div className="h-full" style={{ width: `${s.have}%`, background: BLUE }} />
              </div>
              <div className="flex justify-between w-full text-[10px]">
                <span style={{ color: BLUE }} className="font-bold">{s.have}% today</span>
                <span className="text-black/30">100% needed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="05 — Solution"
        title="Tydline — shipment visibility without the manual work."
      />

      {/* TASA hero block */}
      <div className="w-full max-w-4xl px-5 py-4 flex flex-col gap-3" style={{ border: `1.5px solid ${BLUE}`, background: `${BLUE}07` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center" style={{ background: BLUE }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2"><Tag invert>TASA</Tag><Tag>Powered by AI</Tag></div>
            <div className="font-heading font-extrabold text-base mt-1" style={{ color: BLUE }}>Tydline's Autonomous Shipping Agent</div>
          </div>
        </div>
        <p className="text-sm text-black/70 leading-relaxed max-w-3xl">
          TASA interprets carrier updates — understanding context, identifying patterns, and deciding which changes
          warrant your attention. When a vessel is rerouted or a customs hold appears, TASA evaluates the downstream
          impact on your specific delivery window and sends a targeted alert. No noise. Just the signal that matters.
        </p>
      </div>

      {/* How it works flow */}
      <div className="w-full max-w-4xl">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3 text-center">How it works</div>
        <div className="flex items-center justify-center gap-0 flex-wrap">
          {[
            { icon: "M3 10h18M3 6h18M3 14h18", label: "Carrier portal" },
            { arrow: true },
            { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", label: "TASA interprets" },
            { arrow: true },
            { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", label: "Alert triggered" },
            { arrow: true },
            { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", label: "Your channel" },
            { arrow: true },
            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "You act in time" },
          ].map((step, i) =>
            "arrow" in step ? (
              <svg key={i} width="24" height="16" viewBox="0 0 24 16" className="shrink-0 mx-1">
                <path d="M0 8h18M14 3l6 5-6 5" stroke={BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-2.5" style={{ border: `1px solid ${BLUE}20`, background: CREAM, minWidth: 72 }}>
                <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                  <Icon d={step.icon!} size={16} />
                </div>
                <span className="text-[10px] text-black/60 text-center leading-snug w-16">{step.label}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-4xl">
        {[
          { icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z|M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", title: "Real-Time ETA Monitoring", body: "Every milestone watched 24/7 across 18+ carriers." },
          { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", title: "Smart Alert Rules", body: "Alert only when ETA shifts >48 hrs, or flag any customs hold immediately." },
          { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", title: "WhatsApp + Email + ERP", body: "Deliver alerts into the tools your team already uses." },
          { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Multi-User Team Access", body: "Share visibility across ops, procurement, and customer success." },
          { icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18", title: "ERP & TMS Integration", body: "Push shipment status directly into your existing systems." },
          { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Scales with you", body: "10 to 450 shipments/month. Rules and integrations carry over." },
        ].map((f) => (
          <Card key={f.title} className="flex flex-row gap-3 items-start">
            <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}20` }}>
              <Icon d={f.icon} size={15} />
            </div>
            <div>
              <div className="font-heading font-bold text-xs mb-0.5" style={{ color: BLUE }}>{f.title}</div>
              <p className="text-xs text-black/60 leading-relaxed">{f.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideDemo() {
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="06 — Demo"
        title="From search to dashboard in under 3 minutes."
        sub="No account required upfront. No sales call. No friction."
      />

      {/* Step flow */}
      <div className="w-full max-w-4xl">
        <div className="flex items-start justify-center gap-0 flex-wrap md:flex-nowrap">
          {[
            { n: "01", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Search", desc: "Enter container ID, BL, or vessel on the landing page." },
            { n: "02", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "See Result", desc: "Live status, progress, ETA, and carrier data returned instantly." },
            { n: "03", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: "Subscribe", desc: "Choose plan, pick notification channel, enter work email." },
            { n: "04", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z", title: "Magic Link Auth", desc: "One-click login via email. No password. Pay via MoMo." },
            { n: "05", icon: "M3 10h18M3 6h18M3 14h18M3 18h7", title: "Dashboard", desc: "All active shipments in one view. Forward emails → auto-tracked." },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center gap-2 px-2 py-3 text-center" style={{ minWidth: 120 }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full relative" style={{ background: `${BLUE}`, border: `2px solid ${BLUE}` }}>
                  <Icon d={s.icon} size={22} color="#fff" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-white" style={{ color: BLUE, border: `1px solid ${BLUE}50` }}>{s.n}</div>
                </div>
                <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>{s.title}</div>
                <p className="text-[10px] text-black/55 leading-snug">{s.desc}</p>
              </div>
              {i < 4 && (
                <svg width="20" height="12" viewBox="0 0 20 12" className="shrink-0 hidden md:block">
                  <path d="M0 6h14M10 1l6 5-6 5" stroke={`${BLUE}50`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mock dashboard preview */}
      <div className="w-full max-w-4xl border border-[#052698]/20 bg-[#FCFDFF]">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#052698]/10" style={{ background: `${BLUE}08` }}>
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-black/40 ml-2">tydline.com/dashboard</span>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>Upcoming Shipments</div>
            <div className="flex gap-1.5">
              {["On Time", "Delayed", "In Transit"].map((s, i) => (
                <span key={s} className="text-[10px] px-2 py-0.5 font-medium" style={{
                  background: ["`#f0fdf4`","#fef2f2","#eff6ff"][i], color: ["#16a34a","#dc2626",BLUE][i], border: `1px solid ${["#bbf7d0","#fecaca",`${BLUE}30`][i]}`
                }}>{s}</span>
              ))}
            </div>
          </div>
          {[
            { id: "MSKU7234891", vessel: "MSC DIANA · MSC", route: "Shanghai → Tema", eta: "Mar 26", pct: 82, status: "On Time" },
            { id: "HLCU4521037", vessel: "EVER GOLDEN · Evergreen", route: "Busan → Hamburg", eta: "Mar 28", pct: 61, status: "Delayed" },
            { id: "CMAU1983204", vessel: "CMA CGM MARCO POLO", route: "Singapore → Felixstowe", eta: "Mar 29", pct: 54, status: "On Time" },
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 border border-[#052698]/10" style={{ background: "#FCFDFF" }}>
              <div className="w-32 shrink-0">
                <div className="text-xs font-medium" style={{ color: BLUE }}>{s.id}</div>
                <div className="text-[10px] text-black/50 truncate">{s.vessel}</div>
                <div className="text-[10px] text-black/40">{s.route}</div>
              </div>
              <div className="flex-1">
                <div className="h-2 relative" style={{ background: `${BLUE}10` }}>
                  <div className="h-full" style={{ width: `${s.pct}%`, background: s.status === "Delayed" ? "#dc2626" : BLUE }} />
                </div>
                <div className="text-[10px] text-black/40 mt-0.5">{s.pct}% in transit</div>
              </div>
              <div className="text-xs font-medium shrink-0" style={{ color: BLUE }}>{s.eta}</div>
              <span className="text-[10px] px-1.5 py-0.5 shrink-0" style={{
                background: s.status === "Delayed" ? "#fef2f2" : "#f0fdf4",
                color: s.status === "Delayed" ? "#dc2626" : "#16a34a",
                border: `1px solid ${s.status === "Delayed" ? "#fecaca" : "#bbf7d0"}`,
              }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideBMC() {
  const blocks = [
    { title: "Key Partners", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", items: ["18+ carriers (Maersk, MSC, CMA CGM…)", "ERP / TMS vendors", "Freight forwarders", "WhatsApp Business API"], span: 1 },
    { title: "Key Activities", icon: "M13 10V3L4 14h7v7l9-11h-7z", items: ["Carrier data ingestion & normalisation", "TASA AI layer development", "Alert delivery infrastructure", "Customer onboarding"], span: 1 },
    { title: "Value Proposition", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", items: ["Eliminate manual tracking", "Prevent demurrage fees", "AI-powered delay detection", "Multi-channel alerts"], span: 1, highlight: true },
    { title: "Customer Relations", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", items: ["Self-serve SaaS onboarding", "Magic-link auth", "WhatsApp support", "Volume upgrade nudges"], span: 1 },
    { title: "Customer Segments", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", items: ["SME importers (10–40 containers/mo)", "Mid-size shippers (40–450/mo)", "Freight ops teams", "West Africa → Global"], span: 1 },
    { title: "Key Resources", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", items: ["Carrier API connections (18+)", "TASA AI intelligence layer", "Tracking email infrastructure", "Brand & positioning"], span: 1 },
    { title: "Channels", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", items: ["tydline.com (PLG)", "WhatsApp-native outreach", "Forwarder partnerships", "Organic search"], span: 1 },
    { title: "Cost Structure", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", items: ["Carrier API access & data", "Cloud & alert infra", "Engineering & product", "Customer acquisition"], span: 1 },
    { title: "Revenue Streams", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", items: ["Starter: $50/mo · 10 shipments", "Growth: $125/mo · 40 shipments", "Pro: $1,000/mo · 450 shipments", "Custom enterprise pricing"], span: 1, highlight: true },
  ];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-4">
      <SlideHeader tag="07 — Business Model Canvas" title="A focused, subscription-first business." />
      <div className="grid grid-cols-3 gap-2 w-full max-w-4xl">
        {blocks.map((b) => (
          <div key={b.title} className="px-3 py-3 flex flex-col gap-1.5"
            style={{ border: `1px solid ${b.highlight ? BLUE : `${BLUE}20`}`, background: b.highlight ? `${BLUE}08` : CREAM, gridColumn: `span ${b.span}` }}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
                <Icon d={b.icon} size={11} />
              </div>
              <div className="font-heading font-bold text-[11px]" style={{ color: BLUE }}>{b.title}</div>
            </div>
            <ul className="flex flex-col gap-1">
              {b.items.map((item) => (
                <li key={item} className="text-[10px] text-black/60 flex items-start gap-1">
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
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="08 — Market Size"
        title="A massive global market with an underpenetrated African core."
        sub="Starting where the pain is greatest — then scaling globally."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl items-center">
        {/* Concentric circles */}
        <div className="flex flex-col items-center gap-2 col-span-1">
          <ConcentricCircles />
        </div>

        {/* Market cards */}
        <div className="flex flex-col gap-3 col-span-2">
          {[
            { label: "TAM", value: "$52B", title: "Global freight visibility software", body: "Supply chain visibility market (2024). Growing at ~14% CAGR driven by e-commerce and global supply chain resilience.", color: `${BLUE}25` },
            { label: "SAM", value: "$3.2B", title: "Emerging market SME freight monitoring SaaS", body: "SME & mid-market freight monitoring across Africa, MENA, and emerging markets. Sub-Saharan Africa logistics tech growing 22% YoY.", color: `${BLUE}55` },
            { label: "SOM", value: "$85M", title: "3-Year West Africa beachhead target", body: "~5,000 active subscribers at blended ARPU of ~$140/mo. Ghana + Nigeria + Côte d'Ivoire as primary markets.", color: BLUE, invert: true },
          ].map((m) => (
            <div key={m.label} className="flex items-start gap-3 px-4 py-3"
              style={{ border: `1px solid ${m.invert ? BLUE : `${BLUE}20`}`, background: m.invert ? `${BLUE}07` : CREAM }}>
              <div className="w-12 h-12 flex items-center justify-center shrink-0 font-heading font-extrabold text-sm" style={{ background: m.color, color: "#fff", border: `1px solid ${m.color}` }}>
                {m.label}
              </div>
              <div>
                <div className="font-heading font-bold text-sm" style={{ color: BLUE }}>{m.value} — {m.title}</div>
                <p className="text-xs text-black/55 leading-relaxed mt-0.5">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting stats */}
      <div className="w-full max-w-4xl border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3 text-center">Ghana beachhead indicators</div>
        <VerticalBars data={[
          { label: "Containers/yr Tema Port", value: 800, display: "800K+" },
          { label: "Active importers (GRA)", value: 120, display: "~12K" },
          { label: "% using digital tracking", value: 5, display: "<5%" },
          { label: "Africa logistics CAGR", value: 22, display: "22%" },
        ]} />
      </div>
    </div>
  );
}

function SlideCompetitive() {
  const rows = [
    { name: "Tydline",     tracking: true,  ai: true,  whatsapp: true,  africa: true,  sme: true,  erp: true,  hl: true },
    { name: "project44",   tracking: true,  ai: true,  whatsapp: false, africa: false, sme: false, erp: true,  hl: false },
    { name: "Portcast",    tracking: true,  ai: true,  whatsapp: false, africa: false, sme: false, erp: true,  hl: false },
    { name: "FourKites",   tracking: true,  ai: true,  whatsapp: false, africa: false, sme: false, erp: true,  hl: false },
    { name: "CargoX",      tracking: true,  ai: false, whatsapp: false, africa: false, sme: false, erp: false, hl: false },
    { name: "Manual/Spreadsheet", tracking: false, ai: false, whatsapp: false, africa: true, sme: true, erp: false, hl: false },
  ];
  const cols = ["Real-Time Tracking", "AI Alerting", "WhatsApp Native", "Africa Focus", "SME Pricing", "ERP Integration"];
  function Tick({ yes }: { yes: boolean }) {
    return yes
      ? <div className="w-5 h-5 mx-auto flex items-center justify-center rounded-full" style={{ background: "#f0fdf4" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg></div>
      : <div className="w-5 h-5 mx-auto flex items-center justify-center rounded-full" style={{ background: "#fef2f2" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg></div>;
  }
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="09 — Competitive Landscape"
        title="We win on focus, channel, and geography."
        sub="Enterprise players don't serve SMEs. No competitor delivers AI-powered tracking to WhatsApp at African price points."
      />

      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: `2px solid ${BLUE}20` }}>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-black/40 uppercase tracking-wide w-36">Company</th>
              {cols.map((c) => (
                <th key={c} className="px-2 py-2.5 text-center text-[10px] font-semibold text-black/40 uppercase tracking-wide">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} style={{ borderBottom: `1px solid ${BLUE}10`, background: r.hl ? `${BLUE}08` : undefined }}>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: r.hl ? BLUE : `${BLUE}10`, color: r.hl ? "#fff" : BLUE }}>
                      {r.name[0]}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: r.hl ? BLUE : "inherit" }}>{r.name}</span>
                    {r.hl && <Tag invert>Us</Tag>}
                  </div>
                </td>
                {[r.tracking, r.ai, r.whatsapp, r.africa, r.sme, r.erp].map((v, i) => (
                  <td key={i} className="px-2 py-2.5 text-center"><Tick yes={v} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl">
        {[
          { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5", title: "vs. Enterprise players", body: "project44 / FourKites charge $30–100K+/yr, need months-long integrations, and target Fortune 500. Zero relevance to African SMEs." },
          { icon: "M3 10h18M3 6h18M3 14h18M3 18h7", title: "vs. Manual tracking", body: "The real competitor is the spreadsheet. One avoided demurrage bill pays for a full year of Tydline. The ROI conversation is instant." },
          { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Our moat", body: "TASA intelligence + WhatsApp delivery + Africa-native pricing + 18-carrier breadth. Replicating all four takes 18+ months." },
        ].map((b) => (
          <Card key={b.title} highlight className="flex flex-row gap-3 items-start">
            <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25` }}>
              <Icon d={b.icon} size={15} />
            </div>
            <div>
              <div className="font-heading font-bold text-xs mb-0.5" style={{ color: BLUE }}>{b.title}</div>
              <p className="text-xs text-black/60 leading-relaxed">{b.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideGTM() {
  const phases = [
    {
      phase: "Phase 1", time: "Now", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z|M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Beachhead: Ghana Importers",
      items: ["Target 200+ active importers at Tema Port", "Self-serve SaaS — no sales team required", "WhatsApp-native onboarding & support", "Starter at $50/mo as low-friction entry", "Freight forwarder referral partnerships"],
      color: BLUE,
    },
    {
      phase: "Phase 2", time: "12 months", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "West Africa Expansion",
      items: ["Nigeria, Côte d'Ivoire, Senegal rollout", "Local payment methods per market", "Growth plan push for teams >10 containers", "Channel partnerships with clearance agents", "WhatsApp Business broadcast campaigns"],
      color: `${BLUE}cc`,
    },
    {
      phase: "Phase 3", time: "24+ months", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title: "Enterprise & Global",
      items: ["ERP integrations for Pro/Custom clients", "MENA, SEA, and LatAm entry", "API product for freight-adjacent platforms", "Aggregated data insights layer", "White-label for forwarder platforms"],
      color: `${BLUE}77`,
    },
  ];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="10 — Go-to-Market"
        title="Land in Ghana. Expand West Africa. Scale globally."
        sub="Product-led growth — the cargo tracking search is the top of our funnel."
      />

      {/* Timeline visual */}
      <div className="w-full max-w-4xl flex items-center gap-0 mb-2">
        {phases.map((p, i) => (
          <div key={p.phase} className="flex items-center flex-1">
            <div className="flex-1 h-1" style={{ background: i === 0 ? BLUE : `${BLUE}30` }} />
            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: p.color, border: `2px solid ${BLUE}` }} />
            {i === phases.length - 1 && <div className="flex-1 h-1" style={{ background: `${BLUE}15` }} />}
          </div>
        ))}
      </div>
      <div className="w-full max-w-4xl flex gap-0">
        {phases.map((p) => (
          <div key={p.phase} className="flex-1 text-center">
            <div className="text-[10px] font-semibold" style={{ color: BLUE }}>{p.phase}</div>
            <div className="text-[10px] text-black/40">{p.time}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {phases.map((p) => (
          <Card key={p.phase} highlight className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: p.color }}>
                <Icon d={p.icon} size={18} color="#fff" />
              </div>
              <div>
                <Tag>{p.phase} · {p.time}</Tag>
                <div className="font-heading font-bold text-xs mt-1" style={{ color: BLUE }}>{p.title}</div>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5">
              {p.items.map((item) => <Check key={item} text={item} />)}
            </ul>
          </Card>
        ))}
      </div>

      <div className="w-full max-w-4xl border border-[#052698]/15 bg-[#FCFDFF] px-5 py-3">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3 text-center">PLG conversion funnel</div>
        <Funnel steps={[
          { label: "Searches cargo on tydline.com", value: "10,000/mo", pct: 100 },
          { label: "Sees tracking result", value: "7,200/mo", pct: 72 },
          { label: "Clicks 'Subscribe for notifications'", value: "1,440/mo", pct: 14 },
          { label: "Completes signup & payment", value: "432/mo", pct: 4 },
          { label: "Upgrades plan within 90 days", value: "130/mo", pct: 1 },
        ]} />
      </div>
    </div>
  );
}

function SlideEconomics() {
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="11 — Unit Economics"
        title="High-margin SaaS with near-instant payback."
        sub="The demurrage ROI story makes every customer conversation short."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl items-start">

        {/* Donut + pricing */}
        <div className="flex flex-col gap-3 items-center">
          <div className="font-heading font-bold text-xs text-center" style={{ color: BLUE }}>Revenue mix (early cohort)</div>
          <DonutChart segments={[
            { label: "Starter (60%)", value: 60, color: `${BLUE}55` },
            { label: "Growth (30%)", value: 30, color: BLUE },
            { label: "Pro (10%)", value: 10, color: `${BLUE}cc` },
          ]} />
          <div className="w-full flex flex-col gap-1.5">
            {[
              { plan: "Starter", price: "$50/mo", vol: "10 ships", color: `${BLUE}55` },
              { plan: "Growth", price: "$125/mo", vol: "40 ships", color: BLUE },
              { plan: "Pro", price: "$1,000/mo", vol: "450 ships", color: `${BLUE}cc` },
            ].map((p) => (
              <div key={p.plan} className="flex items-center gap-2 px-3 py-2" style={{ border: `1px solid ${BLUE}20`, background: CREAM }}>
                <div className="w-2.5 h-2.5 shrink-0" style={{ background: p.color }} />
                <span className="font-heading font-bold text-xs flex-1" style={{ color: BLUE }}>{p.plan}</span>
                <span className="text-xs font-bold" style={{ color: BLUE }}>{p.price}</span>
                <span className="text-[10px] text-black/40">{p.vol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI grid */}
        <div className="flex flex-col gap-3 col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Blended ARPU", value: "~$140/mo", sub: "60/30/10 starter/growth/pro mix", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Estimated CAC", value: "~$80", sub: "PLG model — low paid acquisition", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" },
              { label: "LTV : CAC", value: "42×", sub: "Blended ARPU × 24-month horizon", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { label: "Payback Period", value: "<1 month", sub: "First MoMo payment covers CAC", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Gross Margin", value: "~75%", sub: "API + infra as primary variable cost", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { label: "LTV (24-mo avg)", value: "~$3,360", sub: "ARPU × 24 months retention", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
            ].map((s) => (
              <Card key={s.label} highlight className="flex flex-row gap-3 items-start">
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}20` }}>
                  <Icon d={s.icon} size={15} />
                </div>
                <div>
                  <div className="text-[10px] text-black/45">{s.label}</div>
                  <div className="font-heading font-extrabold text-lg leading-tight" style={{ color: BLUE }}>{s.value}</div>
                  <div className="text-[10px] text-black/40 mt-0.5">{s.sub}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Demurrage ROI bar */}
          <div className="px-4 py-3 flex items-start gap-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full" style={{ background: "#dcfce7" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div>
              <div className="text-xs font-bold text-green-800 mb-1">Demurrage ROI framing</div>
              <p className="text-xs text-green-700 leading-relaxed">
                1 container × 3 days demurrage avoided × $200/day = <strong>$600 saved</strong>. That covers <strong>12 months of the Starter plan</strong>.
                Every sales conversation starts and ends here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideTeam() {
  const team = [
    { role: "Founder / Product", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v2M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", strength: "Domain expertise + vision", skills: ["West African import operations", "Demurrage & carrier workflows", "Product design & user research", "Freight team interviews & discovery"] },
    { role: "Engineering", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", strength: "Full-stack + AI/ML", skills: ["React 19, TypeScript, Node.js", "TASA AI intelligence layer", "Carrier API integrations (18+)", "Rapid iteration & zero-to-one"] },
    { role: "Growth / Ops", icon: "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6", strength: "GTM & partnerships", skills: ["Freight forwarder network Ghana", "Importer community access", "WhatsApp-native customer dev", "Tema Port operator relationships"] },
  ];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader
        tag="12 — Team"
        title="Built by people who understand freight and software."
        sub="Every design decision was shaped by direct conversations with the freight teams who use it."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {team.map((m) => (
          <Card key={m.role} highlight className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: `${BLUE}12`, border: `2px solid ${BLUE}25` }}>
              <Icon d={m.icon} size={28} />
            </div>
            <div>
              <div className="font-heading font-bold text-base" style={{ color: BLUE }}>{m.role}</div>
              <div className="text-xs text-black/45 mt-0.5">{m.strength}</div>
            </div>
            <ul className="flex flex-col gap-1.5 text-left w-full mt-1">
              {m.skills.map((s) => <Check key={s} text={s} />)}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <Card className="flex flex-row gap-3 items-start">
          <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}20` }}>
            <Icon d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" size={15} />
          </div>
          <div>
            <div className="font-heading font-bold text-xs mb-1" style={{ color: BLUE }}>Why us</div>
            <p className="text-xs text-black/65 leading-relaxed">We didn't read about this problem in a report — we watched it happen. We've sat inside freight operations, seen the spreadsheets, and heard the demurrage conversations firsthand.</p>
          </div>
        </Card>
        <Card className="flex flex-row gap-3 items-start">
          <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}20` }}>
            <Icon d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={15} />
          </div>
          <div>
            <div className="font-heading font-bold text-xs mb-1" style={{ color: BLUE }}>Network & Advisors</div>
            <p className="text-xs text-black/65 leading-relaxed">Connected to Tema Port operators, licensed clearing agents, and freight forwarder associations. Network extends to Nigeria, Côte d'Ivoire, and Senegal for Phase 2.</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4 text-sm text-black/40">
        <a href="mailto:hello@tydline.com" className="flex items-center gap-1.5 hover:text-[#052698] transition-colors" style={{ color: BLUE }}>
          <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size={14} />
          hello@tydline.com
        </a>
        <span>·</span>
        <a href="https://tydline.com" className="flex items-center gap-1.5 hover:text-[#052698] transition-colors" style={{ color: BLUE }}>
          <Icon d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" size={14} />
          tydline.com
        </a>
      </div>
    </div>
  );
}

function SlideAppendix() {
  const carriers = ["Maersk","CMA CGM","Hapag-Lloyd","OOCL","COSCO","MSC","Grimaldi","Arkas","PIL","Safmarine","BBC Chartering","Africa Express Line","Gold Star Line","ONE","ZIM","MOL","NileDutch","Evergreen"];
  return (
    <div className="flex flex-col items-center h-full justify-center px-6 py-4 gap-5">
      <SlideHeader tag="13 — Appendix" title="Supporting data & references." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="flex flex-col gap-3">
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Icon d="M3 10h18M3 6h18M3 14h18M3 18h7" size={14} />
              <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>Carriers Integrated (18)</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {carriers.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 font-medium" style={{ border: `1px solid ${BLUE}20`, color: BLUE, background: `${BLUE}05` }}>{c}</span>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Icon d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" size={14} />
              <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>Tech Stack</div>
            </div>
            <ul className="flex flex-col gap-1">
              {["React 19 + TypeScript + Vite","Tailwind CSS v4 (custom design system)","Auth: Magic link (passwordless)","Payments: Mobile Money (MoMo) — GH₵ native","Notifications: Email, WhatsApp, WhatsApp Business API","ERP/TMS: REST API (Pro tier)"].map((t) => (
                <li key={t} className="text-[11px] text-black/60 flex items-start gap-1.5">
                  <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: BLUE, opacity: 0.4 }} />{t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={14} />
              <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>Market Sources</div>
            </div>
            <ul className="flex flex-col gap-1">
              {["Global supply chain visibility: Grand View Research, 2024","Africa logistics tech growth: McKinsey Africa Logistics, 2023","Tema Port throughput: Ghana Ports & Harbours Authority (GPHA)","Demurrage benchmarks: Drewry Container Forecaster","WhatsApp business Africa: Meta Business Summit, 2023","SME importer penetration: GRA customs registration data"].map((s) => (
                <li key={s} className="text-[11px] text-black/60 flex items-start gap-1.5">
                  <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: BLUE, opacity: 0.4 }} />{s}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" size={14} />
              <div className="font-heading font-bold text-xs" style={{ color: BLUE }}>Glossary</div>
            </div>
            <ul className="flex flex-col gap-1">
              {[
                ["Demurrage", "Fee for not collecting a container from port within free time"],
                ["ETA", "Estimated Time of Arrival — projected port arrival date"],
                ["BL", "Bill of Lading — document identifying a cargo shipment"],
                ["TASA", "Tydline's Autonomous Shipping Agent — the AI intelligence layer"],
                ["ERP/TMS", "Enterprise Resource Planning / Transport Management System"],
              ].map(([term, def]) => (
                <li key={term} className="text-[11px] text-black/60"><span style={{ color: BLUE, fontWeight: 600 }}>{term}:</span> {def}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Slide components array ─────────────────────────────────────────────────────
const SLIDE_COMPONENTS = [
  SlideCover, SlideProblem, SlidePersona, SlideHacks, SlideInsights,
  SlideSolution, SlideDemo, SlideBMC, SlideMarket, SlideCompetitive,
  SlideGTM, SlideEconomics, SlideTeam, SlideAppendix,
];

// ── Main deck ──────────────────────────────────────────────────────────────────
export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const total = SLIDE_COMPONENTS.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);



  async function captureSlide(el: HTMLElement): Promise<string> {
    return toPng(el, {
      pixelRatio: 2,
      backgroundColor: "#FFF9F5",
      skipFonts: false,
    });
  }

  async function handleExportPptx() {
    if (!slideContentRef.current) return;
    setExporting(true);
    setExportProgress(0);

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.title = "Tydline — Investor Pitch 2026";
    pptx.author = "Tydline";

    const savedSlide = current;

    for (let i = 0; i < total; i++) {
      setCurrent(i);
      setExportProgress(Math.round((i / total) * 100));
      await new Promise((r) => setTimeout(r, 400));

      const el = slideContentRef.current;
      if (!el) continue;

      const imgData = await captureSlide(el);

      const slide = pptx.addSlide();
      slide.background = { color: "FFF9F5" };
      slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
      slide.addText(`${i + 1} / ${total}`, {
        x: 12.8, y: 7.2, w: 0.5, h: 0.25,
        fontSize: 7, color: "99aabb", align: "right",
      });
    }

    setCurrent(savedSlide);
    setExporting(false);
    setExportProgress(0);
    pptx.writeFile({ fileName: "Tydline-PitchDeck-2026.pptx" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")                    { e.preventDefault(); prev(); }
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const SlideContent = SLIDE_COMPONENTS[current];

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ background: OUTER }}>
      <div className="flex-1 flex flex-col mx-2 md:mx-5 overflow-hidden" style={{ backgroundImage: brickSvg, background: CREAM, border: `0.5px solid ${BLUE}30` }}>

        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 h-11 border-b" style={{ borderColor: `${BLUE}20` }}>
          <div className="flex items-center gap-2.5">
            <img src="/tydline-sqaurlogo.png" alt="Tydline" className="w-7" />
            <span className="text-[11px] text-black/35 hidden sm:block tracking-wide">Investor Pitch · 2026</span>
          </div>

          <button onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] cursor-pointer transition-colors hover:bg-[#052698]/5"
            style={{ border: `1px solid ${BLUE}20`, color: BLUE }}>
            <span className="font-heading font-extrabold">{current + 1}</span>
            <span className="text-black/30">/</span>
            <span className="text-black/50">{total}</span>
            <span className="hidden sm:block text-black/50 ml-0.5">{slides[current].label}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            <button onClick={prev} disabled={current === 0 || exporting}
              className="w-7 h-7 flex items-center justify-center cursor-pointer disabled:opacity-25 transition-colors hover:bg-[#052698]/8"
              style={{ border: `1px solid ${BLUE}20` }} aria-label="Previous">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={next} disabled={current === total - 1 || exporting}
              className="w-7 h-7 flex items-center justify-center cursor-pointer disabled:opacity-25 transition-colors hover:bg-[#052698]/8"
              style={{ border: `1px solid ${BLUE}20` }} aria-label="Next">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <button
              onClick={handleExportPptx}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 h-7 text-[11px] font-medium cursor-pointer disabled:opacity-50 disabled:cursor-wait transition-colors"
              style={{ background: BLUE, color: "#fff", border: `1px solid ${BLUE}` }}
              aria-label="Download PPTX"
            >
              {exporting ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  <span className="hidden sm:block">{exportProgress}%</span>
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span className="hidden sm:block">PPTX</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Slide menu dropdown */}
        {menuOpen && (
          <div className="absolute top-[2.75rem] right-7 z-50 w-52 overflow-y-auto shadow-lg"
            style={{ maxHeight: "70vh", background: "#fff", border: `1px solid ${BLUE}25` }}>
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => { setCurrent(i); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-[#052698]/5"
                style={{ borderBottom: `1px solid ${BLUE}08`, background: i === current ? `${BLUE}08` : undefined }}>
                <span className="font-semibold tabular-nums w-5 text-right shrink-0" style={{ color: `${BLUE}50` }}>{i + 1}</span>
                <span style={{ color: i === current ? BLUE : "inherit", fontWeight: i === current ? 700 : undefined }}>{s.label}</span>
                {i === current && <div className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BLUE }} />}
              </button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="shrink-0 h-0.5" style={{ background: `${BLUE}10` }}>
          <div className="h-full transition-all duration-300" style={{ width: `${((current + 1) / total) * 100}%`, background: BLUE }} />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto" ref={slideContentRef}>
          <div className="min-h-full">
            <SlideContent />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="shrink-0 flex items-center justify-between px-4 h-9 border-t" style={{ borderColor: `${BLUE}15` }}>
          <span className="text-[10px] text-black/25 hidden sm:block">← → to navigate · Esc to close menu</span>
          <div className="flex items-center gap-1 mx-auto sm:mx-0">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
                className="transition-all duration-200 cursor-pointer"
                style={{ width: i === current ? 18 : 5, height: 5, background: i === current ? BLUE : `${BLUE}28` }}
              />
            ))}
          </div>
          <a href="/" className="text-[10px] transition-colors hover:opacity-80 hidden sm:block" style={{ color: BLUE }}>
            tydline.com →
          </a>
        </div>
      </div>
    </div>
  );
}
