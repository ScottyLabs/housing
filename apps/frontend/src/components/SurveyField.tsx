import DropdownButton, { type SelectOption } from "@/components/DropdownButton";

/** A labelled dropdown question with an icon, as used in the survey and the review form. */
export default function SurveyField({
  icon,
  label,
  helper,
  placeholder,
  options,
  value,
  onChangeAction,
  searchable = false,
}: {
  icon: string;
  label: string;
  helper: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChangeAction: (value: string) => void;
  searchable?: boolean;
}) {
  return (
    <div className="flex items-start gap-[18px]">
      <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 flex-shrink-0" />
      <div className="flex w-full max-w-[600px] flex-col gap-2">
        <span className="text-[20px] font-semibold leading-none">{label}</span>
        <span className="text-[14px] leading-none text-black">{helper}</span>
        <div className="mt-2 w-full max-w-[423px]">
          <DropdownButton
            options={options}
            placeholder={placeholder}
            value={value}
            onChangeAction={onChangeAction}
            searchable={searchable}
          />
        </div>
      </div>
    </div>
  );
}
