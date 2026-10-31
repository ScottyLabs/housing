import { useState } from "react";
import type { Building } from "../../components/BuildingContext.tsx";
import BuildingOptionsDialog from "./BuildingOptionsDialog.tsx";
import TaggedBuildingOption from "./TaggedBuildingOption.tsx";

function SeeMoreButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`See more ${title} buildings`}
      aria-haspopup="dialog"
      className="flex flex-col items-center rounded-2xl bg-brand-menugray justify-center border border-black/10 transition-colors duration-200 hover:bg-gray-200 cursor-pointer shrink-0 w-[240px] h-[320px] md:w-[320px] md:h-[220px]"
    >
      <img src="/all-buildings-colored.svg" alt="" className="w-[38px] h-[38px]" />
      <span className="font-semibold text-black text-[24px] w-full text-center">See More</span>
    </button>
  );
}

export default function BuildingOptionRow({
  title,
  icon,
  icon_alt,
  buildings,
  see_more,
}: {
  title: string;
  icon: string;
  icon_alt: string;
  buildings: Building[];
  see_more: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-x-auto min-w-[300px] max-w-full">
      <div className="flex gap-[12px] items-center pb-[23px]">
        <img src={icon} alt={icon_alt} className="w-[37px] h-[37px]" />
        <h2 className="font-semibold text-[24px]">{title}</h2>
      </div>
      <div className="flex gap-[24px] ">
        {buildings.slice(0, 3).map((b) => (
          <TaggedBuildingOption key={b.id} building={b} />
        ))}
        {see_more && (
          <SeeMoreButton
            title={title}
            onClick={() => {
              setExpanded(true);
            }}
          />
        )}
      </div>
      {expanded && (
        <BuildingOptionsDialog
          title={title}
          buildings={buildings}
          onClose={() => {
            setExpanded(false);
          }}
        />
      )}
    </div>
  );
}
