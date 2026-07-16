import { useState } from "react";
import DropdownButton, { SelectOption } from "@/components/DropdownButton";

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "nb-male", label: "Non-Binary (male dorms)" },
  { value: "nb-female", label: "Non-Binary (female dorms)" },
  { value: "nb-inclusive", label: "Non-Binary (gender inclusive)" },
];

const YEAR_OPTIONS: SelectOption[] = [
  { value: "first-year", label: "First-Year" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
];

// TODO: figure out how to add all majors
const MAJOR_OPTIONS: SelectOption[] = [
  { value: "cfa", label: "CFA" },
  { value: "arch", label: "Arch" },
  { value: "design", label: "Design" },
  { value: "dietrich", label: "Dietrich" },
  { value: "cee", label: "CEE" },
  { value: "ece", label: "ECE" },
  { value: "scs", label: "SCS" },
];

function Field({
  icon,
  label,
  helper,
  placeholder,
  options,
  value,
  onChangeAction,
}: {
  icon: string;
  label: string;
  helper: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChangeAction: (value: string) => void;
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
          />
        </div>
      </div>
    </div>
  );
}

function SurveyInfo() {

  return (
    <>
      <div className="flex items-center gap-4 rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-6">
        <img
          src="/unsorted-icons/info.svg"
          alt=""
          aria-hidden="true"
          className="h-12 w-12 flex-shrink-0"
        />
        <p className="text-[18px] font-semibold leading-snug">
          We need some information about you in order to offer recommended buildings
        </p>
      </div>
    </>
  );
}

export default function Step1() {
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");

  return (
    <>
      <SurveyInfo />
    
      <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
        <h2 className="text-[24px] font-semibold leading-none">Who are you?</h2>
        <div className="mt-8 flex flex-col gap-8">
          <Field
            icon="/survey-gender.svg"
            label="Gender"
            helper="Some buildings are limited to certain genders"
            placeholder="Pick your gender"
            options={GENDER_OPTIONS}
            value={gender}
            onChangeAction={setGender}
          />
          <Field
            icon="/unsorted-icons/year.svg"
            label="Year"
            helper="The options for first-years and upperclassmen are different"
            placeholder="Pick your year"
            options={YEAR_OPTIONS}
            value={year}
            onChangeAction={setYear}
          />
          <Field
            icon="/unsorted-icons/degree.svg"
            label="Major"
            helper="This lets us know where most of your classes will probably be"
            placeholder="Pick your major"
            options={MAJOR_OPTIONS}
            value={major}
            onChangeAction={setMajor}
          />
        </div>
      </div>
    </>
  );
}
