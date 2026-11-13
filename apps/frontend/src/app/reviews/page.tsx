import { useMemo, useState } from "react";
import { type Building, useBuildings } from "@/components/BuildingContext";
import BuildingOption from "@/components/BuildingOption";
import { buildingsForClass, housingClassLabel, housingClasses } from "@/data/housing";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-shrink-0 text-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BuildingSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex h-[56px] w-full items-center gap-3 rounded-2xl border border-black/10 bg-brand-buttongray px-4 sm:w-[350px]">
      <SearchIcon />
      <span className="sr-only">Search buildings</span>
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Search"
        className="h-full w-full bg-transparent text-[18px] outline-none placeholder:text-gray-500"
      />
    </label>
  );
}

function BuildingSection({ title, buildings }: { title: string; buildings: Building[] }) {
  return (
    <div className="mt-8 first:mt-6">
      <h3 className="text-[20px] font-medium leading-none">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {buildings.map((building) => (
          <BuildingOption
            key={building.id}
            building={building}
            to={`/reviews/${building.id}`}
            className="aspect-[4/3] w-full hover:outline-[3px] hover:outline-offset-2 hover:outline-brand-primary"
          />
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const buildings = useBuildings();
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => buildings.toSorted((first, second) => first.name.localeCompare(second.name)),
    [buildings],
  );
  const search = query.trim().toLowerCase();
  const sections = housingClasses
    .map((housingClass) => ({
      housingClass,
      buildings: buildingsForClass(sorted, housingClass).filter((b) =>
        b.name.toLowerCase().includes(search),
      ),
    }))
    .filter((section) => section.buildings.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <h1 className="text-[32px] font-bold leading-none">Write a Review</h1>
      <section className="mt-6 rounded-[18px] border border-black/10 bg-brand-menugray px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[24px] font-semibold leading-tight">
            Which building do you want to review?
          </h2>
          <BuildingSearch value={query} onChange={setQuery} />
        </div>
        {sections.length === 0 && (
          <p className="mt-8 text-[18px]">No buildings match &ldquo;{query.trim()}&rdquo;.</p>
        )}
        {sections.map(({ housingClass, buildings: matches }) => (
          <BuildingSection
            key={housingClass}
            title={`${housingClassLabel[housingClass]} Buildings`}
            buildings={matches}
          />
        ))}
      </section>
    </div>
  );
}
