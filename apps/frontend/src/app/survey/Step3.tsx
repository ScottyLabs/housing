import Checkbox from "@/components/Checkbox";

const ACCOMMODATIONS = [
  "Service Animal",
  "En suite kitchen",
  "Ground floor room",
  "Strobe fire alarm & doorbell",
  "Wheelchair accessible",
  "Climate control: AC",
  "En suite bathroom",
  "Elevator access",
  "Single room",
  "Personal care assistant",
];

const AMENITIES = [
  "Air conditioning",
  "En suite bathroom",
  "En suite kitchen",
  "Common areas",
  "Kitchen access",
];

interface Step3Props {
  accommodations: string[];
  setAccommodations: (val: string[]) => void;
  preferredAmenities: string[];
  setPreferredAmenities: (val: string[]) => void;
}

function AccommodationsSection({
  accommodations,
  setAccommodations,
}: {
  accommodations: string[];
  setAccommodations: (val: string[]) => void;
}) {
  const toggleAccommodation = (item: string, checked: boolean) => {
    if (checked) {
      setAccommodations([...accommodations, item]);
    } else {
      setAccommodations(accommodations.filter((a) => a !== item));
    }
  };

  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">Do you need any accommodations?</h2>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-[18px] sm:grid-cols-2">
        {ACCOMMODATIONS.map((label) => (
          <Checkbox
            key={label}
            label={label}
            checked={accommodations.includes(label)}
            onChange={(checked) => {
              toggleAccommodation(label, checked);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AmenitiesSection({
  preferredAmenities,
  setPreferredAmenities,
}: {
  preferredAmenities: string[];
  setPreferredAmenities: (val: string[]) => void;
}) {
  const toggleAmenity = (item: string, checked: boolean) => {
    if (checked) {
      setPreferredAmenities([...preferredAmenities, item]);
    } else {
      setPreferredAmenities(preferredAmenities.filter((a) => a !== item));
    }
  };

  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">
        Do you have any preferred amenities?
      </h2>
      <p className="mt-3 text-[18px] font-medium leading-none">
        We&apos;ll try to recommend buildings with everything you want.
      </p>
      <div className="mt-6 flex flex-col gap-[18px]">
        {AMENITIES.map((label) => (
          <Checkbox
            key={label}
            label={label}
            checked={preferredAmenities.includes(label)}
            onChange={(checked) => {
              toggleAmenity(label, checked);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Step3({
  accommodations,
  setAccommodations,
  preferredAmenities,
  setPreferredAmenities,
}: Step3Props) {
  return (
    <>
      <AccommodationsSection
        accommodations={accommodations}
        setAccommodations={setAccommodations}
      />
      <AmenitiesSection
        preferredAmenities={preferredAmenities}
        setPreferredAmenities={setPreferredAmenities}
      />
    </>
  );
}
