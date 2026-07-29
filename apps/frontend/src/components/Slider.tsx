import { useState } from "react";

function SliderMarker({
  size,
  left,
  right,
  center = true,
}: {
  size: string;
  left?: string;
  right?: string;
  center?: boolean;
}) {
  return (
    <div
      className={`absolute ${size} bg-white rounded-full pointer-events-none`}
      style={{
        border: `2px solid var(--color-brand-primary)`,
        left,
        right,
        top: "50%",
        transform: center ? "translate(-50%, -50%)" : "translateY(-50%)",
      }}
    />
  );
}

function SliderInput({
  min,
  max,
  value,
  percent,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  percent: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
      className="w-full h-11 bg-transparent appearance-none cursor-pointer slider touch-none"
      style={{
        background: `linear-gradient(to right,
                                var(--color-brand-primary) 0%,
                                var(--color-brand-primary) ${percent}%,
                                #d1d5db ${percent}%,
                                #d1d5db 100%) center / 100% 4px no-repeat`,
      }}
    />
  );
}

export default function Slider({
  min = 1,
  max = 10,
  showTicks = false,
  value: controlledValue,
  onChange: controlledOnChange,
}: {
  min?: number;
  max?: number;
  showTicks?: boolean;
  value?: number;
  onChange?: (value: number) => void;
}) {
  const [internalValue, setInternalValue] = useState(Math.floor((min + max) / 2));
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (val: number) => {
    if (controlledOnChange) {
      controlledOnChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const percent = ((value - min) / (max - min)) * 100;

  const THUMB_SIZE = 22.6;

  function getTickPosition(tickPercent: number) {
    return `calc(${tickPercent}% + ${(0.5 - tickPercent / 100) * THUMB_SIZE}px)`;
  }

  const ticks = showTicks
    ? Array.from({ length: max - min - 1 }, (_, i) => min + 1 + i)
        .filter((step) => step !== value)
        .map((step) => getTickPosition(((step - min) / (max - min)) * 100))
    : [];

  return (
    <div className="flex flex-col h-11 justify-center">
      <div className="relative flex flex-col justify-center">
        <SliderInput min={min} max={max} value={value} percent={percent} onChange={handleChange} />

        {ticks.map((left) => (
          <SliderMarker key={left} size="h-[10px] w-[10px]" left={left} />
        ))}

        {value > min && <SliderMarker size="h-[13.55px] w-[13.55px]" left="0px" center={false} />}

        {value < max && <SliderMarker size="h-[13.55px] w-[13.55px]" right="0px" center={false} />}
      </div>
    </div>
  );
}
