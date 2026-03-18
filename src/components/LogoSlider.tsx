import maersk from "../assets/shippinglineicons/maersk.webp";
import cma from "../assets/shippinglineicons/cma.webp";
import hapag from "../assets/shippinglineicons/happag.webp";
import oocl from "../assets/shippinglineicons/oocl.webp";
import cosco from "../assets/shippinglineicons/cosco.webp";
import grimaldi from "../assets/shippinglineicons/grimaldi.webp";
import msc from "../assets/shippinglineicons/msc.webp";
import arkas from "../assets/shippinglineicons/arkas.webp";
import pil from "../assets/shippinglineicons/pil.webp";
import safmarine from "../assets/shippinglineicons/safmarine.webp";
import bbc from "../assets/shippinglineicons/BBC.webp";
import ael from "../assets/shippinglineicons/AEL.webp";
import goldStar from "../assets/shippinglineicons/gold star.webp";
import one from "../assets/shippinglineicons/one.webp";
import zim from "../assets/shippinglineicons/zim.webp";
import mol from "../assets/shippinglineicons/mol.webp";
import nildutch from "../assets/shippinglineicons/nildutch.webp";
import evergreen from "../assets/shippinglineicons/flag.webp";

const topRow = [
  { src: maersk,   alt: "Maersk",         scale: 1.5 },
  { src: cma,      alt: "CMA CGM" },
  { src: hapag,    alt: "Hapag-Lloyd" },
  { src: oocl,     alt: "OOCL",           scale: 0.5 },
  { src: cosco,    alt: "COSCO" },
  { src: grimaldi, alt: "Grimaldi Group" },
  { src: msc,      alt: "MSC" },
  { src: arkas,    alt: "Arkas",           scale: 0.8 },
  { src: pil,      alt: "PIL",             scale: 0.5 },
];

const bottomRow = [
  { src: safmarine, alt: "Safmarine",       scale: 0.5 },
  { src: bbc,       alt: "BBC Chartering",  scale: 2 },
  { src: ael,       alt: "Africa Express Line" },
  { src: goldStar,  alt: "Gold Star Line" },
  { src: one,       alt: "ONE" },
  { src: zim,       alt: "ZIM" },
  { src: mol,       alt: "MOL" },
  { src: nildutch,  alt: "NileDutch" },
  { src: evergreen, alt: "Evergreen",       scale: 2 },
];

function LogoSlider() {
  const allLogos = [...topRow, ...bottomRow];

  return (
    <section className="w-[calc(100%+1rem)] -mx-2 md:w-[calc(100%+2.5rem)] md:-mx-5 mt-auto mb-0">
      <p className="text-center text-xs tracking-widest  uppercase py-2 bg-white border border-[#052698]/15 font-body">
        Connected across various shipping lines
      </p>

      {/* Desktop: two-row marquee */}
      <div className="hidden md:block overflow-hidden relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-48 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-48 z-10 bg-gradient-to-l from-white to-transparent" />
        {/* Top row — scrolls left */}
        <div className="flex animate-marquee w-max" style={{ animationDuration: "60s" }}>
          {[...topRow, ...topRow].map((logo, i) => (
            <div
              key={`top-${logo.alt}-${i}`}
              className="h-[60px] w-[130px] flex items-center justify-center p-3 shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain"
                style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
              />
            </div>
          ))}
        </div>
        {/* Bottom row — scrolls right */}
        <div className="flex animate-marquee-reverse w-max" style={{ animationDuration: "70s" }}>
          {[...bottomRow, ...bottomRow].map((logo, i) => (
            <div
              key={`bottom-${logo.alt}-${i}`}
              className="h-[60px] w-[130px] flex items-center justify-center p-3 shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain"
                style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal marquee slider */}
      <div className="md:hidden overflow-hidden relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-white to-transparent" />
        <div className="flex animate-marquee w-max" style={{ animationDuration: "80s" }}>
          {[...allLogos, ...allLogos].map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="h-[50px] w-[70px] flex items-center justify-center p-2 shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain"
                style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoSlider;
