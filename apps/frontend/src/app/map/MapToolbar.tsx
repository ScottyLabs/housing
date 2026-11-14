import DropdownButton, { type SelectOption } from "@/components/DropdownButton";
import HousingClassToggle from "@/components/HousingClassToggle";
import type { CampusBuilding, HousingClass } from "@/data/buildingTypes";
import { originOptions } from "./places";

const originSelectOptions: SelectOption[] = originOptions.map((campus) => ({
  value: campus.id,
  label: campus.name,
}));

function SearchField({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <label className="flex h-[44px] w-full items-center gap-2 rounded-xl border border-black/10 bg-brand-buttongray px-3 focus-within:border-brand-primary md:w-[200px]">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] shrink-0 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </svg>
      <span className="sr-only">Search buildings</span>
      <input
        type="search"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
        }}
        placeholder="Search Buildings"
        autoComplete="off"
        className="w-full bg-transparent text-[14px] outline-none placeholder:text-gray-500"
      />
    </label>
  );
}

export default function MapToolbar({
  origin,
  query,
  housingClass,
  onOriginChange,
  onQueryChange,
  onHousingClassChange,
}: {
  origin: CampusBuilding;
  query: string;
  housingClass: HousingClass;
  onOriginChange: (id: string) => void;
  onQueryChange: (query: string) => void;
  onHousingClassChange: (housingClass: HousingClass) => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="w-full md:mr-auto md:w-72">
        <HousingClassToggle value={housingClass} onChange={onHousingClassChange} />
      </div>
      <span className="text-[15px]">Sort by Distance from</span>
      <div className="w-full md:w-[260px]">
        <DropdownButton
          compact
          options={originSelectOptions}
          value={origin.id}
          subtitle={origin.subtitle}
          maxHeight="max-h-80"
          onChangeAction={onOriginChange}
        />
      </div>
      <SearchField query={query} onQueryChange={onQueryChange} />
    </div>
  );
}
