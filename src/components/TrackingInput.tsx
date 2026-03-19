import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./ui/InputField";
import Button from "./ui/Button";

const DEMO_BL = "MSKU7234891";

function TrackingInput() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    navigate(`/track?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex flex-col items-center gap-2 w-[90%] md:w-[55%]">
      <div className="flex items-center gap-2 w-full">
        <InputField
          className="flex-1 h-11 md:h-13 text-sm md:text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="w-28 md:w-36 h-10 md:h-12 text-sm md:text-base"
          onClick={handleSearch}
        >
          Get started
        </Button>
      </div>
      <p className="text-xs text-[#545454]/60 self-start pl-0.5">
        No BL?{" "}
        <button
          onClick={() => setQuery(DEMO_BL)}
          className="text-[#052698]/70 underline underline-offset-2 cursor-pointer hover:text-[#052698] transition-colors"
        >
          Try a sample — {DEMO_BL}
        </button>
      </p>
    </div>
  );
}

export default TrackingInput;
