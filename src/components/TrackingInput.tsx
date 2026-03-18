import InputField from "./ui/InputField";
import Button from "./ui/Button";

function TrackingInput() {
  return (
    <div className="flex items-center justify-center gap-2 w-[90%] md:w-[55%]">
      <InputField className="flex-1 h-11 md:h-13 text-sm md:text-base" />
      <Button className="w-28 md:w-36 h-10 md:h-12 text-sm md:text-base" />
    </div>
  );
}

export default TrackingInput;
