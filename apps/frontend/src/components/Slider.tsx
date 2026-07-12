import { useState } from "react";

export default function Slider({ min = 1, max = 10, showTicks = false }: { min?: number; max?: number; showTicks?: boolean }) {
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
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full h-[4px] bg-gray-300 rounded appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right,
                                var(--color-brand-primary) 0%,
                                var(--color-brand-primary) ${percent}%,
                                #d1d5db ${percent}%,
                                #d1d5db 100%)`
                    }}
                />

                {ticks.map((left) => (
                    <div
                        key={left}
                        className="absolute w-[10px] h-[10px] bg-white rounded-full pointer-events-none"
                        style={{
                            border: `2px solid var(--color-brand-primary)`,
                            left,
                            top: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                ))}

                {value > min && (
                    <div
                        className="absolute w-[13.55px] h-[13.55px] bg-white rounded-full pointer-events-none"
                        style={{
                            border: `2px solid var(--color-brand-primary)`,
                            left: "0px",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    />
                )}

                {value < max && (
                    <div
                        className="absolute w-[13.55px] h-[13.55px] bg-white rounded-full pointer-events-none"
                        style={{
                            border: `2px solid var(--color-brand-primary)`,
                            right: "0px",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    />
                )}
            </div>
        </div>
    );
}
