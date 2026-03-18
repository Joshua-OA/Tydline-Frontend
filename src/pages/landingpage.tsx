import Header from "../layouts/Header";
import CTA from "../layouts/CTA";

const brickSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='0' y='0' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='-30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3Crect x='30' y='15' width='60' height='15' fill='none' stroke='%23052698' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`;

function LandingPage() {
  return (
    <div className="w-screen h-screen overflow-hidden md:overflow-hidden bg-[#F9E4D2] relative px-2 md:px-5">
      {/* Inner content area with lighter background + brick pattern */}
      <div
        className="w-full h-full bg-[#FFF9F5] flex flex-col items-center overflow-y-auto md:overflow-hidden border-x-[0.5px] border-[#052698]/30"
        style={{ backgroundImage: brickSvg }}
      >
        <Header />
        <CTA />
      </div>
    </div>
  );
}

export default LandingPage;
