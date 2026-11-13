import { useState } from "react";
import type { FilterState, HousingClass } from "../../data/buildingTypes.ts";
import {
  AccommodationsSection,
  AmenitiesSection,
  AtmosphereSection,
  ClassStandingSection,
  DistanceSection,
  HousingTypeSection,
  RoomTypeSection,
} from "./FilterSections.tsx";

function PanelHeader({
  mobileOpen,
  onToggleAction,
  onToggleMobileAction,
}: {
  mobileOpen: boolean;
  onToggleAction: () => void;
  onToggleMobileAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between w-full flex-shrink-0 pt-[24px] pb-[16px] px-5 md:pt-[31px] md:pb-[24px]">
      <h2 className="font-semibold text-[24px] leading-none">Filter Buildings</h2>
      <button
        type="button"
        className="hidden md:block cursor-pointer bg-transparent border-none p-0"
        onClick={onToggleAction}
      >
        <img src="/hide-sidebar-v2.svg" alt="hide sidebar" className="w-[22.4px] h-[22.4px]" />
      </button>
      <button
        type="button"
        className="md:hidden cursor-pointer bg-transparent border-none p-0"
        onClick={onToggleMobileAction}
      >
        <img
          src="/dropdown-closed.svg"
          alt="toggle filters"
          className={`w-[22.4px] h-[22.4px] transition-transform ${mobileOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

function CollapsedRail({ onOpenAction }: { onOpenAction: () => void }) {
  return (
    <div className="hidden md:flex flex-col gap-[20px] overflow-hidden bg-brand-menugray border border-black/10 rounded-xl w-[75px] h-[83vh] py-6 items-center">
      <button
        type="button"
        className="cursor-pointer bg-transparent border-none p-0"
        onClick={onOpenAction}
      >
        <img src="/hide-sidebar-v2.svg" alt="hide sidebar" className="w-[22.4px] h-[22.4px]" />
      </button>
      <img
        src="/unsorted-icons/degree.svg"
        alt="class standing"
        className="w-[38.4px] h-[38.4px]"
      />
      <img src="/distance.svg" alt="distance from" className="w-[38.4px] h-[38.4px]" />
      <img src="/atmosphere.svg" alt="atmosphere" className="w-[38.4px] h-[38.4px]" />
      <img src="/survey-gender.svg" alt="housing type" className="w-[38.4px] h-[38.4px]" />
      <img src="/accomadations.svg" alt="accomadations" className="w-[38.4px] h-[38.4px]" />
      <img
        src="/unsorted-icons/room-type/trad-single.svg"
        alt="room type"
        className="w-[38.4px] h-[38.4px]"
      />
      <img src="/amenities.svg" alt="amenities" className="w-[38.4px] h-[38.4px]" />
    </div>
  );
}

export default function BuildingFilter({
  filters,
  onChangeAction,
  housingClass,
  onChangeHousingClassAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
  housingClass: HousingClass;
  onChangeHousingClassAction: (housingClass: HousingClass) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pb-6 md:pb-10">
      <div
        className={`flex flex-col overflow-hidden bg-brand-menugray border border-black/10 rounded-xl w-full h-auto ${
          isOpen ? "md:w-[320px]" : "md:hidden"
        }`}
      >
        <PanelHeader
          mobileOpen={mobileOpen}
          onToggleAction={() => setIsOpen(!isOpen)}
          onToggleMobileAction={() => setMobileOpen(!mobileOpen)}
        />
        <div className={`${mobileOpen ? "block" : "hidden"} md:block px-[24px] pb-[24px]`}>
          <div className="flex flex-col gap-[38px] items-center sm:items-start">
            <ClassStandingSection
              housingClass={housingClass}
              onChangeAction={onChangeHousingClassAction}
            />
            <DistanceSection filters={filters} onChangeAction={onChangeAction} />
            <AtmosphereSection filters={filters} onChangeAction={onChangeAction} />
            <HousingTypeSection filters={filters} onChangeAction={onChangeAction} />
            <AccommodationsSection filters={filters} onChangeAction={onChangeAction} />
            <RoomTypeSection filters={filters} onChangeAction={onChangeAction} />
            <AmenitiesSection filters={filters} onChangeAction={onChangeAction} />
          </div>
        </div>
      </div>
      {!isOpen && <CollapsedRail onOpenAction={() => setIsOpen(true)} />}
    </div>
  );
}
