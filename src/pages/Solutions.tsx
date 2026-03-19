import Header from "../layouts/Header";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

const solutions = [
  {
    title: "Real-Time ETA Monitoring",
    body:
      "Tydline connects directly to your carrier's tracking system and watches every milestone — departure, customs clearance, port arrival, final delivery — so you always know where your shipment stands without manually refreshing a portal.",
  },
  {
    title: "Multi-Channel Alerts",
    body:
      "Receive notifications the moment an ETA changes or a delay is detected. Choose the channels that fit your workflow: Email, WhatsApp, WhatsApp Business, or push updates straight into your ERP or TMS through our API integration.",
  },
  {
    title: "Custom Alert Rules",
    body:
      "Not every delay is created equal. Set thresholds that matter to you — alert me only when ETA shifts by more than 48 hours, or flag any customs hold immediately. Tydline lets you define the rules so you're never over-notified or caught off guard.",
  },
  {
    title: "Multi-User Team Access",
    body:
      "Share visibility across your operations, procurement, and customer-success teams. Each member gets timely, relevant updates so no single person becomes the information bottleneck.",
  },
  {
    title: "ERP & TMS Integration",
    body:
      "For high-volume shippers, Tydline pushes shipment status directly into your existing systems. Eliminate manual data entry and keep your records up to date without touching a spreadsheet.",
  },
  {
    title: "Scalable Coverage",
    body:
      "Whether you move 10 containers a month or 450, Tydline scales with you. Start on the Starter plan and upgrade as your volume grows — your alert rules and integrations carry over seamlessly.",
  },
];

export default function Solutions() {
  return (
    <div className="w-screen min-h-screen bg-[#F9E4D2] px-4 md:px-16">
      <div
        className="w-full min-h-screen bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        <Header />

        <div className="flex flex-col items-center px-4 pt-8 pb-12 gap-6 max-w-xl mx-auto w-full scale-90 origin-top">

            {/* Hero */}
            <div className="text-center flex flex-col gap-3">
              <p className="text-xs font-medium tracking-widest text-[#052698]/50 uppercase">What we do</p>
              <h1 className="text-[#052698] text-2xl font-heading font-extrabold tracking-tight leading-snug">
                Shipment visibility, <br className="hidden sm:block" />without the manual work
              </h1>
              <p className="text-[15px] text-black/80 max-w-xl mx-auto leading-relaxed">
                Tydline monitors your cargo in real time and sends you the right alert at the right moment — so you
                can act before a delay becomes a crisis.
              </p>
            </div>

            {/* TASA feature block */}
            <div className="w-full border border-[#052698] bg-[#FCFDFF] px-6 py-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#052698] text-white text-[10px] font-medium tracking-widest px-2 py-0.5 uppercase">
                  Featured
                </span>
                <span className="text-[10px] text-[#052698]/40 tracking-widest uppercase font-medium">Powered by AI</span>
              </div>
              <h2 className="text-[#052698] font-heading font-extrabold text-xl leading-snug">
                TASA — Tydline's Autonomous Shipping Agent
              </h2>
              <p className="text-[15px] text-black/80 leading-relaxed">
                TASA is the intelligence layer behind Tydline. Rather than simply forwarding carrier status updates,
                TASA interprets them — understanding context, identifying patterns, and deciding which changes
                actually warrant your attention. It monitors your shipments continuously, correlates data across
                carriers and routes, and acts on your behalf before you even know something has changed.
              </p>
              <p className="text-[15px] text-black/80 leading-relaxed">
                When a vessel is rerouted, a port is congested, or a customs hold appears, TASA doesn't just log
                it — it evaluates the downstream impact on your specific delivery window and sends a targeted alert
                with the context you need to make a decision. No noise, no raw data dumps. Just the signal that
                matters, exactly when it matters.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[#052698]/10" />

            {/* Solution cards */}
            <div className="flex flex-col gap-6 w-full">
              {solutions.map((s, i) => (
                <div key={i} className="border border-[#052698]/15 bg-[#FCFDFF] px-6 py-5 flex flex-col gap-2">
                  <h2 className="text-[#052698] font-heading font-bold text-base">{s.title}</h2>
                  <p className="text-[15px] text-black/80 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            {/* CTA strip */}
            <div className="w-full border border-[#052698] bg-[#052698] px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-heading font-bold text-base">Ready to stop chasing updates?</p>
                <p className="text-white/80 text-[15px] mt-0.5">Try Tydline free — no credit card required.</p>
              </div>
              <a
                href="/pricing"
                className="bg-white text-[#052698] text-sm font-medium px-6 py-2.5 whitespace-nowrap hover:bg-[#FFF9F5] transition-colors"
              >
                View pricing →
              </a>
            </div>

          </div>

        <footer className="border-t border-[#052698]/15 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <p className="text-sm text-black/60">© {new Date().getFullYear()} Tydline. All rights reserved.</p>
          <a href="mailto:hello@tydline.com" className="text-sm text-black/60 hover:text-black transition-colors">
            hello@tydline.com
          </a>
        </footer>
      </div>
    </div>
  );
}
