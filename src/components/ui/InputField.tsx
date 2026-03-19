interface InputFieldProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

function InputField({ placeholder, className, value, onChange, onKeyDown, type = "text", disabled = false }: InputFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`border-[#052698] border-[0.45px] px-4 py-2 text-[#545454] bg-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      placeholder={
        placeholder ??
        "Input your Bill of Lading or Container Number to Begin tracking"
      }
    />
  );
}

export default InputField;
