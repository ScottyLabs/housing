import { type ReactNode, useId, useState } from "react";
import FilterHeader, { StaticFilterHeader } from "./FilterHeader.tsx";

export default function CollapsibleSection({
  name,
  desc,
  icon,
  activeCount,
  startOpen,
  children,
}: {
  name: string;
  desc: string;
  icon: string;
  activeCount: number;
  startOpen: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(startOpen);
  const contentId = useId();

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <FilterHeader
        name={name}
        desc={desc}
        icon={icon}
        isOpen={isOpen}
        contentId={contentId}
        badge={isOpen ? 0 : activeCount}
        onToggleAction={() => {
          setIsOpen((open) => !open);
        }}
      />
      {isOpen && (
        <div id={contentId} className="flex w-full flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

export function StaticSection({
  name,
  desc,
  icon,
  children,
}: {
  name: string;
  desc: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-[18px]">
      <StaticFilterHeader name={name} desc={desc} icon={icon} />
      <div className="flex w-full flex-col">{children}</div>
    </div>
  );
}
