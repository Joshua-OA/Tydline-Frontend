interface InputFieldProps {
  placeholder?: string;
  className?: string;
}

function InputField({ placeholder, className }: InputFieldProps) {
  return (
    <input
      type="text"
      className={` border-[#052698] border-[0.45px] px-4 py-2 text-[#545454] bg-white ${className}`}
      placeholder={
        placeholder ??
        "Input your Bill of Lading or Container Number to Begin tracking"
      }
    />
  );
}

export default InputField;
