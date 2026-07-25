import { Building, useBuildingTagsMap } from "@/components/BuildingContext";
import BuildingOption from "@/components/BuildingOption";
import { deriveTags } from "@/data/tags";

export default function TaggedBuildingOption({ building }: { building: Building }) {
  const tagMap = useBuildingTagsMap();
  const tagIds = deriveTags(building);

  return (
    <div className="flex flex-col gap-[20px] shrink-0">
      <BuildingOption
        building={building}
        className="w-[240px] h-[320px] md:w-[320px] md:h-[220px]"
      />
      <>
        {tagIds.length > 0 && (
          <div className="flex flex-col gap-[18px]">
            {tagIds
              .map((id) => {
                const someTag = tagMap.get(id);
                if (someTag === undefined) {
                  throw new Error(`Building ${building.name} contains invalid tag: ${id}`);
                }
                return someTag;
              })
              .map((tag) => (
                <div key={tag.id} className="flex gap-[5px] items-center">
                  <img src={tag.icon} alt={tag.label} className="w-[34.56px] h-[34.56px]" />
                  <h2 className="text-[18px]">{tag.label}</h2>
                </div>
              ))}
          </div>
        )}
      </>
    </div>
  );
}
