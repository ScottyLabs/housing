import type { HousingClass } from "@/data/buildingTypes";
import { housingClassLabel, housingClasses } from "@/data/housing";

export default function HousingClassToggle({
  value,
  onChange,
}: {
  value: HousingClass;
  onChange: (housingClass: HousingClass) => void;
}) {
  return (
    <fieldset className="flex w-full rounded-full border border-black/10 bg-brand-buttongray p-1">
      <legend className="sr-only">Show housing for</legend>
      {housingClasses.map((housingClass) => (
        <label key={housingClass} className="flex-1 cursor-pointer">
          <input
            type="radio"
            name="housing-class"
            value={housingClass}
            checked={value === housingClass}
            onChange={() => {
              onChange(housingClass);
            }}
            className="peer sr-only"
          />
          <span className="block rounded-full px-5 py-2 text-center text-[16px] font-medium leading-none transition-colors duration-200 hover:bg-black/5 peer-checked:bg-brand-primary peer-checked:hover:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-black/50">
            {housingClassLabel[housingClass]}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
