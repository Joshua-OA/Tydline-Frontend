import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border border-[#052698] bg-white ring-1 ring-[#052698]/30 ring-offset-2 px-4 py-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children ?? "Get Started"}
    </button>
  );
}

export default Button;
