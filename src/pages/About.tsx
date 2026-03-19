import Header from "../layouts/Header";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

const values = [
  {
    title: "Clarity over noise",
    body:
      "We send you one meaningful alert instead of a dozen system pings. Every notification you receive from Tydline tells you something actionable.",
  },
  {
    title: "Built for operations teams",
    body:
      "We design for the people who actually manage freight — not for dashboards that look impressive in a slide deck but slow you down in practice.",
  },
  {
    title: "Simple by default, powerful when needed",
    body:
      "You can be up and running in minutes. Advanced alert rules, ERP integrations, and multi-user access are there when your operation demands them.",
  },
];

export default function About() {
  return (
    <div className="w-screen min-h-screen bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full min-h-screen bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        <Header />

        <div className="flex flex-col items-center px-4 py-14 gap-10 max-w-2xl mx-auto w-full">

            {/* Hero */}
            <div className="text-center flex flex-col gap-3">
              <p className="text-xs font-medium tracking-widest text-[#052698]/50 uppercase">About us</p>
              <h1 className="text-[#052698] text-3xl font-heading font-extrabold tracking-tight leading-snug">
                We built Tydline because tracking shipments shouldn't be a full-time job
              </h1>
            </div>

            {/* Story */}
            <div className="flex flex-col gap-5 text-[15px] text-black/80 leading-relaxed">
              <p>
                Every freight team we spoke to was doing the same thing: logging into carrier portals multiple times
                a day, copy-pasting ETAs into spreadsheets, and forwarding update emails to colleagues who needed the
                information just as urgently. It was repetitive, error-prone, and frankly, beneath the skill level of
                the people doing it.
              </p>
              <p>
                Tydline was created to fix that. We built a layer that sits between your carriers and your team,
                watching every shipment around the clock and surfacing the changes that actually matter — through
                whatever channel you already use, whether that's email, WhatsApp, or your ERP system.
              </p>
              <p>
                Our focus is narrow on purpose. We do one thing — shipment visibility and alerting — and we do it
                well. We're not trying to replace your TMS or become another all-in-one logistics platform. We want
                to be the quiet, reliable tool your team trusts to keep them informed without demanding their
                constant attention.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[#052698]/10" />

            {/* Values */}
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xs font-medium tracking-widest text-[#052698]/50 uppercase mb-2">What guides us</p>
              {values.map((v, i) => (
                <div key={i} className="border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4 flex flex-col gap-1.5">
                  <h2 className="text-[#052698] font-heading font-bold text-sm">{v.title}</h2>
                  <p className="text-[15px] text-black/80 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>

            {/* Contact nudge */}
            <div className="w-full border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[15px] text-black/80">Have a question or want to learn more?</p>
              <a
                href="/contact"
                className="text-sm font-medium text-[#052698] border border-[#052698]/30 px-4 py-2 hover:bg-[#052698]/5 transition-colors whitespace-nowrap"
              >
                Contact us →
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
