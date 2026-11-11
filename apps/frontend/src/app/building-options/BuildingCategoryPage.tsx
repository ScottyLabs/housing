import { Link, useParams } from "react-router-dom";
import NotFound from "../not-found.tsx";
import BuildingOptionsLayout from "./BuildingOptionsLayout.tsx";
import { buildingCategories } from "./categories.ts";
import TaggedBuildingOption from "./TaggedBuildingOption.tsx";
import useBuildingGroups from "./useBuildingGroups.ts";

function BackLink() {
  return (
    <Link
      to="/building-options"
      className="inline-flex items-center gap-1 text-[14px] text-gray-600 transition-colors duration-200 hover:text-black"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3 5 8l5 5" />
      </svg>
      All Building Options
    </Link>
  );
}

// The "See More" page of a category: every building in it, in the order of the user's preferences.
export default function BuildingCategoryPage() {
  const { category: slug } = useParams();
  const groups = useBuildingGroups();
  const category = buildingCategories.find((c) => c.seeMore && c.slug === slug);

  if (category === undefined) return <NotFound />;

  return (
    <BuildingOptionsLayout>
      <div className="flex-shrink-0 pt-[15px] pb-[28px]">
        <BackLink />
      </div>
      <div className="flex-1 md:overflow-y-auto pb-[60px]">
        <div className="flex gap-[12px] items-center pb-[28px]">
          <img src={category.icon} alt={category.iconAlt} className="w-[37px] h-[37px]" />
          <h1 className="font-bold text-[24px] md:text-[32px]">{category.title}</h1>
        </div>
        <div className="flex flex-wrap gap-x-[24px] gap-y-[36px] justify-center sm:justify-start @md:grid @md:grid-cols-2 @md:items-start @3xl:grid-cols-4">
          {category.pick(groups).map((building) => (
            <TaggedBuildingOption key={building.id} building={building} />
          ))}
        </div>
      </div>
    </BuildingOptionsLayout>
  );
}
