import type { MapMarker, MarkerState } from "./places";

const CHIP_STYLES: Record<MarkerState, string> = {
  default: "bg-[#0c8987] text-white",
  origin: "bg-brand-primary text-white",
  selected: "bg-brand-primary text-white ring-2 ring-white",
};

const HOUSE_STYLES: Record<MarkerState, string> = {
  default: "fill-[#0c8987] stroke-[#0c8987]",
  origin: "fill-brand-primary stroke-brand-primary",
  selected: "fill-brand-primary stroke-brand-primary",
};

const HOUSE_PATH = "M24 4 L44 20 V40 H4 V20 Z";

function CircleBody({ code, state }: { code: string; state: MarkerState }) {
  return (
    <span
      className={`flex h-9 min-w-9 items-center justify-center rounded-full px-1 text-[10px] font-semibold shadow ${CHIP_STYLES[state]}`}
    >
      {code}
    </span>
  );
}

function HouseBody({ code, state }: { code: string; state: MarkerState }) {
  return (
    <span className="relative flex h-11 w-12 items-center justify-center">
      <svg
        viewBox="0 0 48 44"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full drop-shadow-md"
      >
        {state === "selected" && (
          <path
            d={HOUSE_PATH}
            className="fill-white stroke-white"
            strokeWidth={7}
            strokeLinejoin="round"
          />
        )}
        <path
          d={HOUSE_PATH}
          className={HOUSE_STYLES[state]}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative mt-3 text-[10px] font-semibold text-white">{code}</span>
    </span>
  );
}

export default function MarkerBody({ marker }: { marker: MapMarker }) {
  if (marker.kind === "housing") return <HouseBody code={marker.code} state={marker.state} />;
  return <CircleBody code={marker.code} state={marker.state} />;
}
