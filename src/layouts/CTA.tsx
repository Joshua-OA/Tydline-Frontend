import HeadingSection from "../components/HeadingSection";
import HeroCard from "../components/HeroCard";
import TrackingInput from "../components/TrackingInput";
import herocardimg from "../assets/herocardimg.webp";
import gmail from "../assets/iconpack/gmail.svg";
import outlook from "../assets/iconpack/outlook.svg";
import whatsapp from "../assets/iconpack/whatsapp.svg";
import whatsappBusiness from "../assets/iconpack/whatsappbusines.svg";
import plug from "../assets/iconpack/plug.svg";
import settings from "../assets/iconpack/settings.svg";
import LogoSlider from "../components/LogoSlider";

function CTA() {
  return (
    <div className="w-full flex-1 flex flex-col items-center -mt-2 md:-mt-6">
      {/* Middle content — clustered together in center */}
      <div className="flex-1 flex flex-col items-center justify-center w-full gap-5 md:gap-8 pb-4 md:pb-0">
        <HeadingSection />
        <HeroCard
          image={herocardimg}
          articles={[
            {
              iconLeft: whatsapp,
              iconRight: whatsappBusiness,
              description: "Your shipment has arrived ETA didnt change",
            },
            {
              iconLeft: gmail,
              iconRight: outlook,
              description: "Update: The ETA changed to this new date",
            },
            {
              iconLeft: plug,
              iconRight: settings,
              description: "Tracker Connected Successfully",
            },
          ]}
        />
        <TrackingInput />
      </div>

      <LogoSlider />
    </div>
  );
}

export default CTA;
