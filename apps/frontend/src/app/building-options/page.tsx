import BuildingOptionRow from "./BuildingOptionRow";
import BuildingOptionsLayout from "./BuildingOptionsLayout";
import { buildingCategories } from "./categories";
import useBuildingGroups from "./useBuildingGroups";

export default function Home() {
  const groups = useBuildingGroups();

  return (
    <BuildingOptionsLayout>
      <h1 className="hidden md:block font-bold text-[24px] md:text-[32px] pt-[15px] pb-[28px] flex-shrink-0">
        All Building Options
      </h1>
      <div className="flex-1 md:overflow-y-auto pb-[60px]">
        <div className="flex flex-col gap-[36px] items-center sm:items-start">
          {buildingCategories.map((category) => (
            <BuildingOptionRow
              key={category.slug}
              category={category}
              buildings={category.pick(groups)}
            />
          ))}
        </div>
      </div>
    </BuildingOptionsLayout>
  );
}
