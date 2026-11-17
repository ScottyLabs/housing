import { useCampusBuildings } from "../../components/BuildingContext.tsx";
import Checkbox from "../../components/Checkbox.tsx";
import DropdownButton, { type SelectOption } from "../../components/DropdownButton.tsx";
import HousingClassToggle from "../../components/HousingClassToggle.tsx";
import Slider from "../../components/Slider.tsx";
import {
  type FeatureFilter,
  type FilterState,
  GenderHousing,
  type HousingClass,
} from "../../data/buildingTypes.ts";
import { BUILDING_CARD_ROWS, type CardRowSpec, EXPERIENCE_CARD_ROWS } from "../../data/reviews.ts";
import { withMinRating } from "../../data/scoring.ts";
import CollapsibleSection, { StaticSection } from "./CollapsibleSection.tsx";

interface SectionProps {
  filters: FilterState;
  onChangeAction: (filters: FilterState) => void;
}

export function ClassStandingSection({
  housingClass,
  onChangeAction,
}: {
  housingClass: HousingClass;
  onChangeAction: (housingClass: HousingClass) => void;
}) {
  return (
    <StaticSection name="Class Standing" desc="" icon="/unsorted-icons/degree.svg">
      <HousingClassToggle value={housingClass} onChange={onChangeAction} />
    </StaticSection>
  );
}

export function DistanceSection({ filters, onChangeAction }: SectionProps) {
  const campusBuildings = useCampusBuildings();
  const buildings = campusBuildings.toSorted((b1, b2) =>
    b1.name.toLowerCase().localeCompare(b2.name.toLowerCase()),
  );
  const buildingOptions: SelectOption[] = buildings.map((b) => ({ value: b.id, label: b.name }));

  return (
    <StaticSection name="Distance from" desc="" icon="/distance.svg">
      <DropdownButton
        options={buildingOptions}
        onChangeAction={(distanceFrom) => {
          onChangeAction({ ...filters, distanceFrom });
        }}
        value={filters.distanceFrom}
      />
    </StaticSection>
  );
}

function RatingFiltersSection({
  name,
  icon,
  rows,
  filters,
  onChangeAction,
}: SectionProps & { name: string; icon: string; rows: CardRowSpec[] }) {
  const activeCount = rows.filter(({ key }) => filters.minRatings[key] !== null).length;

  return (
    <CollapsibleSection
      name={name}
      desc="Minimum student rating"
      icon={icon}
      activeCount={activeCount}
      startOpen
    >
      <div className="flex w-full flex-col gap-[24px]">
        {rows.map(({ key, label }) => (
          <div key={key} className="flex flex-col w-full">
            <h2 className="text-[18px]">{label}</h2>
            <Slider
              min={1}
              max={5}
              value={filters.minRatings[key] ?? 3}
              ariaLabel={label}
              onChange={(value) => {
                onChangeAction(withMinRating(filters, key, value));
              }}
            />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

export function ExperienceRatingsSection(props: SectionProps) {
  return (
    <RatingFiltersSection
      {...props}
      name="Experience Ratings"
      icon="/unsorted-icons/ranking.svg"
      rows={EXPERIENCE_CARD_ROWS}
    />
  );
}

export function BuildingRatingsSection(props: SectionProps) {
  return (
    <RatingFiltersSection
      {...props}
      name="Building Ratings"
      icon="/unsorted-icons/ranking.svg"
      rows={BUILDING_CARD_ROWS}
    />
  );
}

interface FeatureOption {
  feature: FeatureFilter;
  label: string;
}

function FeatureSection({
  name,
  desc,
  icon,
  options,
  filters,
  onChangeAction,
}: SectionProps & { name: string; desc: string; icon: string; options: FeatureOption[] }) {
  const toggle = (feature: FeatureFilter, checked: boolean) => {
    onChangeAction({ ...filters, [feature]: checked });
  };
  const activeCount = options.filter(({ feature }) => filters[feature]).length;

  return (
    <CollapsibleSection
      name={name}
      desc={desc}
      icon={icon}
      activeCount={activeCount}
      startOpen={false}
    >
      <div className="flex w-full flex-col gap-[26px] pl-1 sm:items-start">
        {options.map(({ feature, label }) => (
          <Checkbox
            key={feature}
            label={label}
            checked={filters[feature]}
            onChange={(checked) => {
              toggle(feature, checked);
            }}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
}

const accommodationOptions: FeatureOption[] = [
  { feature: "serviceAnimal", label: "Service Animal" },
  { feature: "wheelchairAccessible", label: "Wheelchair accessible" },
  { feature: "groundFloor", label: "Ground floor room" },
];

const roomTypeOptions: FeatureOption[] = [
  { feature: "singleRoom", label: "Single room" },
  { feature: "doubleRoom", label: "Double room" },
  { feature: "tripleOrLarger", label: "Triple or larger" },
  { feature: "studioApartment", label: "Studio apartment" },
];

const amenityOptions: FeatureOption[] = [
  { feature: "airConditioning", label: "Air conditioning" },
  { feature: "centralAC", label: "Central air conditioning" },
  { feature: "laundryEachFloor", label: "Laundry on each floor" },
  { feature: "enSuiteBathroom", label: "En suite bathroom" },
  { feature: "privateBathroom", label: "Private bathroom" },
  { feature: "enSuiteKitchen", label: "En suite kitchen" },
  { feature: "kitchenAccess", label: "Kitchen access" },
  { feature: "commonAreas", label: "Common areas" },
  { feature: "gym", label: "Gym" },
];

export function AccommodationsSection(props: SectionProps) {
  return (
    <FeatureSection
      {...props}
      name="Accommodations"
      desc="Requirements for you"
      icon="/accomadations.svg"
      options={accommodationOptions}
    />
  );
}

export function RoomTypeSection(props: SectionProps) {
  return (
    <FeatureSection
      {...props}
      name="Room Type"
      desc="Size and style"
      icon="/unsorted-icons/room-type/trad-single.svg"
      options={roomTypeOptions}
    />
  );
}

export function AmenitiesSection(props: SectionProps) {
  return (
    <FeatureSection
      {...props}
      name="Amenities"
      desc="Preferences"
      icon="/amenities.svg"
      options={amenityOptions}
    />
  );
}

const housingChoices: Array<{ housing: GenderHousing | null; label: string; value: string }> = [
  { housing: null, label: "No preference", value: "" },
  { housing: GenderHousing.WomenOnly, label: "Women only", value: "women_only" },
  { housing: GenderHousing.MenOnly, label: "Men only", value: "men_only" },
  { housing: GenderHousing.GenderInclusive, label: "Gender inclusive", value: "gender_inclusive" },
];

const housingOptions: SelectOption[] = housingChoices.map((choice) => ({
  label: choice.label,
  value: choice.value,
}));

export function HousingTypeSection({ filters, onChangeAction }: SectionProps) {
  const selected = housingChoices.find((choice) => choice.housing === filters.genderHousing);

  return (
    <CollapsibleSection
      name="Housing Type"
      desc="Who you want to live with"
      icon="/survey-gender.svg"
      activeCount={filters.genderHousing === null ? 0 : 1}
      startOpen={false}
    >
      <DropdownButton
        options={housingOptions}
        value={selected?.value ?? ""}
        onChangeAction={(value) => {
          const choice = housingChoices.find((candidate) => candidate.value === value);
          onChangeAction({ ...filters, genderHousing: choice?.housing ?? null });
        }}
      />
    </CollapsibleSection>
  );
}
