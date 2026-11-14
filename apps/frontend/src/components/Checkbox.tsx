import { useState } from "react";

export default function Checkbox({
  label,
  checked: controlledChecked,
  onChange: controlledOnChange,
  disabled = false,
}: {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleChange = (checked: boolean) => {
    if (controlledOnChange) {
      controlledOnChange(checked);
    } else {
      setInternalChecked(checked);
    }
  };

  return (
    <label
      className={`flex items-center gap-[10px] w-full ${disabled ? "cursor-default opacity-50" : "cursor-pointer"}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-[24px] h-[24px] rounded-[8px] ${disabled ? "" : "transition-transform duration-75 active:scale-90"} ${
            isChecked
              ? "bg-brand-primary"
              : `bg-brand-buttongray border-[1.5px] border-black/20 ${disabled ? "" : "hover:border-brand-primary"}`
          }`}
        >
          {isChecked && (
            <div className="flex items-center justify-center h-full">
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.51567 6.48067L5.72085 12.0968L13.6474 1.63537"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {label && (
        <div>
          <span className="leading-none text-[18px]">{label}</span>
        </div>
      )}
    </label>
  );
}
