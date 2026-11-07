import { useBuildings } from "../../components/BuildingContext.tsx";
import BuildingOption from "../../components/BuildingOption.tsx";

export default function ReviewsPage() {
  const allBuildings = useBuildings();
  const buildings = [...allBuildings].toSorted((b1, b2) =>
    b1.name.toLowerCase().localeCompare(b2.name.toLowerCase()),
  );

  return (
    <div className="flex justify-center md:h-full px-4 md:px-0 mt-[26px]">
      <div className="flex flex-col w-full md:w-auto md:overflow-hidden">
        <h1 className="hidden md:block font-bold text-[32px] py-3 flex-shrink-0">Reviews</h1>
        <div className="md:overflow-y-auto">
          <div className="flex flex-col gap-[16px] items-center sm:items-start pb-2">
            <div className="space-y-4 pb-3">
              <div className="flex gap-[12px] items-center">
                <h2 className="font-semibold text-[24px]">Review your building!</h2>
              </div>
              <div className="grid grid-cols-2 gap-[12px] md:grid-cols-[repeat(3,419.79px)]">
                {buildings.map((b) => (
                  <BuildingOption
                    key={b.id}
                    building={b}
                    className="w-full aspect-[3/4] md:aspect-[419.79/286.33]"
                    to={`/rating?building=${b.id}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
