import { Link } from "react-router-dom";
import type { Building } from "../../components/BuildingContext.tsx";
import { cardSize } from "./cardSize.ts";
import { type BuildingCategory, PREVIEW_COUNT } from "./categories.ts";
import TaggedBuildingOption from "./TaggedBuildingOption.tsx";

function SeeMoreLink({ category }: { category: BuildingCategory }) {
  return (
    <Link
      to={`/building-options/${category.slug}`}
      aria-label={`See more ${category.title} buildings`}
      className={`flex flex-col items-center rounded-2xl bg-brand-menugray justify-center border border-black/10 transition-colors duration-200 hover:bg-gray-200 cursor-pointer shrink-0 ${cardSize}`}
    >
      <img src="/all-buildings-colored.svg" alt="" className="w-[38px] h-[38px]" />
      <span className="font-semibold text-black text-[24px] w-full text-center">See More</span>
    </Link>
  );
}

export default function BuildingOptionRow({
  category,
  buildings,
}: {
  category: BuildingCategory;
  buildings: Building[];
}) {
  // A "See More" page that shows nothing beyond the preview would only be a dead end.
  const showSeeMore = category.seeMore && buildings.length > PREVIEW_COUNT;

  return (
    <div className="w-full min-w-[300px] overflow-x-auto @md:overflow-visible">
      <div className="flex gap-[12px] items-center pb-[23px]">
        <img src={category.icon} alt={category.iconAlt} className="w-[37px] h-[37px]" />
        <h2 className="font-semibold text-[24px]">{category.title}</h2>
      </div>
      <div className="flex gap-[24px] items-start @md:grid @md:grid-cols-2 @3xl:grid-cols-4">
        {buildings.slice(0, PREVIEW_COUNT).map((b) => (
          <TaggedBuildingOption key={b.id} building={b} />
        ))}
        {showSeeMore && <SeeMoreLink category={category} />}
      </div>
    </div>
  );
}
