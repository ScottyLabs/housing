import type { ReactNode } from "react";
import type { TravelMinutes } from "@/data/distance";

function TravelItem({
  label,
  minutes,
  children,
}: {
  label: string;
  minutes: number;
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
      <span className="sr-only">{label}</span>
      <span>{minutes} min</span>
    </span>
  );
}

export default function TravelTimes({ travel }: { travel: TravelMinutes }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px]">
      <TravelItem label="Walking" minutes={travel.walk}>
        <circle cx="12" cy="5" r="1.8" />
        <path d="M12 8v6l-3 6M12 14l3 6M8.5 11l3.5-3 3.5 3" />
      </TravelItem>
      <TravelItem label="Biking" minutes={travel.bike}>
        <circle cx="6" cy="16" r="3.5" />
        <circle cx="18" cy="16" r="3.5" />
        <path d="M6 16l4-8h5M10 8l3 8h5M15 8l3 8" />
      </TravelItem>
      <TravelItem label="Driving" minutes={travel.drive}>
        <path d="M4 16v-3l2-5h12l2 5v3zM4 13h16" />
        <circle cx="7.5" cy="16" r="1.5" />
        <circle cx="16.5" cy="16" r="1.5" />
      </TravelItem>
    </span>
  );
}
