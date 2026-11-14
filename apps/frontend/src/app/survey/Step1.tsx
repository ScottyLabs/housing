import type { SelectOption } from "@/components/DropdownButton";
import SurveyField from "@/components/SurveyField";
import { MAJORS } from "@/data/majors";
import { GENDER_OPTIONS, YEAR_OPTIONS } from "@/data/survey";

const MAJOR_OPTIONS: SelectOption[] = MAJORS.map((major) => ({ value: major, label: major }));

interface Step1Props {
  gender: string;
  setGender: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  major: string;
  setMajor: (val: string) => void;
}

function SurveyInfo() {
  return (
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
  );
}

export default function Step1({ gender, setGender, year, setYear, major, setMajor }: Step1Props) {
  return (
    <>
      <SurveyInfo />
      <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
        <h2 className="text-[24px] font-semibold leading-none">Who are you?</h2>
        <div className="mt-8 flex flex-col gap-8">
          <SurveyField
            icon="/survey-gender.svg"
            label="Gender"
            helper="Some buildings are limited to certain genders"
            placeholder="Pick your gender"
            options={GENDER_OPTIONS}
            value={gender}
            onChangeAction={setGender}
          />
          <SurveyField
            icon="/unsorted-icons/year.svg"
            label="Year"
            helper="The options for first-years and upperclassmen are different"
            placeholder="Pick your year"
            options={YEAR_OPTIONS}
            value={year}
            onChangeAction={setYear}
          />
          <SurveyField
            icon="/unsorted-icons/degree.svg"
            label="Major"
            helper="This lets us know where most of your classes will probably be"
            placeholder="Search or type your major"
            options={MAJOR_OPTIONS}
            value={major}
            onChangeAction={setMajor}
            searchable
          />
        </div>
      </div>
    </>
  );
}
