import { useState } from "react";

function SliderMarker( {
  size,
  left,
  right,
  center=true 
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
  onChange
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
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[4px] bg-gray-300 rounded appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right,
                                var(--color-brand-primary) 0%,
                                var(--color-brand-primary) ${percent}%,
                                #d1d5db ${percent}%,
                                #d1d5db 100%)`,
          }}
        /> 
        );
}

export default function Slider({
  min = 1,
  max = 10,
  showTicks = false,
}: {
  min?: number;
  max?: number;
  showTicks?: boolean;
}) {
  const [value, setValue] = useState(Math.floor((min + max) / 2));
  const percent = ((value - min) / (max - min)) * 100;

  const THUMB_SIZE = 22.6;

  function getTickPosition(percent: number) {
    return `calc(${percent}% + ${(0.5 - percent / 100) * THUMB_SIZE}px)`;
  }

  const ticks = showTicks
    ? Array.from({ length: max - min - 1 }, (_, i) => min + 1 + i)
        .filter((step) => step !== value)
        .map((step) => getTickPosition(((step - min) / (max - min)) * 100))
    : [];

  return (
    <div className="flex flex-col h-[23px] justify-center">
      <div className="relative flex flex-col justify-center">
        <SliderInput min={min} max={max} value={value} percent={percent} onChange={setValue} />

        {ticks.map((left) => (
          <SliderMarker key={left} size="h-[10px] w-[10px]" left={left} />
        ))}

        {value > min && (
          <SliderMarker size="h-[13.55px] w-[13.55px]" left="0px" center={false}/>
        )}

        {value < max && (
          <SliderMarker size="h-[13.55px] w-[13.55px]" right="0px" center={false}/>
        )}
      </div>
    </div>
  );
}
