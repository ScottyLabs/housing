import { useState } from "react";
import { useBuildings } from "../../components/BuildingContext.tsx";
import Checkbox from "../../components/Checkbox.tsx";
import DropdownButton, { type SelectOption } from "../../components/DropdownButton.tsx";
import Slider from "../../components/Slider.tsx";
import type { FilterState } from "../../data/buildingTypes.ts";
import FilterHeader from "./FilterHeader.tsx";

function DistanceSection({
  filters,
  onChangeAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}) {
  const allBuildings = useBuildings();
  const buildings = [...allBuildings].sort((b1, b2) =>
    b1.name.toLowerCase().localeCompare(b2.name.toLowerCase()),
  );
  const buildingOptions: SelectOption[] = buildings.map((b) => ({ value: b.id, label: b.name }));

  return (
    <div className="flex flex-col w-full gap-[18px]">
      <FilterHeader name="Distance from" desc="" icon="/distance.svg" />
      <DropdownButton
        options={buildingOptions}
        onChangeAction={(distanceFrom) => onChangeAction({ ...filters, distanceFrom })}
        value={filters.distanceFrom}
      />
    </div>
  );
}

function AtmosphereSection({
  filters,
  onChangeAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-[24px]">
      <FilterHeader
        name="Atmosphere"
        desc="Data based on what students say"
        icon="/atmosphere.svg"
      />
      <div className="flex flex-col w-full">
        <h2 className="text-[18px]">Socialness</h2>
        <Slider
          min={1}
          max={5}
          value={filters.socialness ?? 3}
          onChange={(socialness) => onChangeAction({ ...filters, socialness })}
        />
      </div>
      <div className="flex flex-col w-full">
        <h2 className="text-[18px]">Noise Level</h2>
        <Slider
          min={1}
          max={5}
          value={filters.noiseLevel ?? 3}
          onChange={(noiseLevel) => onChangeAction({ ...filters, noiseLevel })}
        />
      </div>
    </div>
  );
}

function AccommodationsSection({
  filters,
  onChangeAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-[14px]">
      <FilterHeader
        name="Accommodations"
        desc="Requirements for you"
        icon="/accomadations.svg"
      />
      <div className="flex flex-col gap-[26px] w-full sm:items-start pl-1">
        <Checkbox
          label="Service Animal"
          checked={filters.serviceAnimal}
          onChange={(checked) => onChangeAction({ ...filters, serviceAnimal: checked })}
        />
        <Checkbox
          label="Wheelchair accessible"
          checked={filters.wheelchairAccessible}
          onChange={(checked) => onChangeAction({ ...filters, wheelchairAccessible: checked })}
        />
        <Checkbox
          label="Single room"
          checked={filters.singleRoom}
          onChange={(checked) => onChangeAction({ ...filters, singleRoom: checked })}
        />
      </div>
    </div>
  );
}

function AmenitiesSection({
  filters,
  onChangeAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-[14px]">
      <FilterHeader name="Amenities" desc="Preferences" icon="/amenities.svg" />
      <div className="flex flex-col gap-[26px] w-full sm:items-start pl-1">
        <Checkbox
          label="Air conditioning"
          checked={filters.airConditioning}
          onChange={(checked) => onChangeAction({ ...filters, airConditioning: checked })}
        />
        <Checkbox
          label="Laundry on each floor"
          checked={filters.laundryEachFloor}
          onChange={(checked) => onChangeAction({ ...filters, laundryEachFloor: checked })}
        />
        <Checkbox
          label="En suite bathroom"
          checked={filters.enSuiteBathroom}
          onChange={(checked) => onChangeAction({ ...filters, enSuiteBathroom: checked })}
        />
      </div>
    </div>
  );
}

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
      <img src="/distance.svg" alt="distance from" className="w-[38.4px] h-[38.4px]" />
      <img src="/atmosphere.svg" alt="atmosphere" className="w-[38.4px] h-[38.4px]" />
      <img src="/accomadations.svg" alt="accomadations" className="w-[38.4px] h-[38.4px]" />
      <img src="/amenities.svg" alt="amenities" className="w-[38.4px] h-[38.4px]" />
    </div>
  );
}

export default function BuildingFilter({
  filters,
  onChangeAction,
}: {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pb-6 md:pb-10">
      <div
        className={`flex flex-col overflow-hidden bg-brand-menugray border border-black/10 rounded-xl w-full h-auto md:h-[83vh] ${
          isOpen ? "md:w-[385px]" : "md:hidden"
        }`}
      >
        <PanelHeader
          mobileOpen={mobileOpen}
          onToggleAction={() => setIsOpen(!isOpen)}
          onToggleMobileAction={() => setMobileOpen(!mobileOpen)}
        />
        <div
          className={`${mobileOpen ? "block" : "hidden"} md:block flex-1 overflow-y-auto px-[24px] pb-[24px]`}
        >
          <div className="flex flex-col gap-[38px] items-center sm:items-start">
            <DistanceSection filters={filters} onChangeAction={onChangeAction} />
            <AtmosphereSection filters={filters} onChangeAction={onChangeAction} />
            <AccommodationsSection filters={filters} onChangeAction={onChangeAction} />
            <AmenitiesSection filters={filters} onChangeAction={onChangeAction} />
          </div>
        </div>
      </div>
      {!isOpen && <CollapsedRail onOpenAction={() => setIsOpen(true)} />}
    </div>
  );
}
