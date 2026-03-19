import Header from "../layouts/Header";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

const channels = [
  {
    label: "General enquiries",
    value: "hello@tydline.com",
    href: "mailto:hello@tydline.com",
    note: "We reply within one business day.",
  },
  {
    label: "Sales & pricing",
    value: "sales@tydline.com",
    href: "mailto:sales@tydline.com",
    note: "Questions about plans, volume discounts, or custom quotes.",
  },
  {
    label: "Technical support",
    value: "support@tydline.com",
    href: "mailto:support@tydline.com",
    note: "Integration help, alert configuration, and account issues.",
  },
];

export default function Contact() {
  return (
    <div className="w-screen min-h-screen bg-[#F9E4D2] px-2 md:px-5">
      <div
        className="w-full min-h-screen bg-[#FFF9F5] flex flex-col border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center px-4 py-14 gap-10 max-w-2xl mx-auto w-full">

            {/* Hero */}
            <div className="text-center flex flex-col gap-3">
              <p className="text-xs font-medium tracking-widest text-[#052698]/50 uppercase">Contact us</p>
              <h1 className="text-[#052698] text-3xl font-heading font-extrabold tracking-tight leading-snug">
                We're here to help
              </h1>
              <p className="text-sm text-black/60 max-w-sm mx-auto leading-relaxed">
                Reach out with questions, feedback, or anything you need. A real person will get back to you.
              </p>
            </div>

            {/* Contact channels */}
            <div className="flex flex-col gap-4 w-full">
              {channels.map((c) => (
                <div key={c.label} className="border border-[#052698]/15 bg-[#FCFDFF] px-5 py-4 flex flex-col gap-1">
                  <p className="text-xs font-medium tracking-widest text-[#052698]/50 uppercase">{c.label}</p>
                  <a
                    href={c.href}
                    className="text-[#052698] font-heading font-bold text-base hover:underline underline-offset-2"
                  >
                    {c.value}
                  </a>
                  <p className="text-xs text-black/50">{c.note}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[#052698]/10" />

            {/* Blurb */}
            <div className="flex flex-col gap-3 text-sm text-black/60 leading-relaxed text-center max-w-md mx-auto">
              <p>
                Prefer to talk through a custom plan or an ERP integration before committing? Drop us a line at
                sales@tydline.com and we'll set up a short call.
              </p>
              <p>
                We're a small team and we take every message seriously. No support bots, no ticket queues — just a
                straightforward reply from someone who knows the product.
              </p>
            </div>

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
