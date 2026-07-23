import { BestFit, DecentFit, WildCard } from "@/app/building-options/BuildingRowsDemo";
import BuildingFilter from "./BuildingFilter";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row md:h-full px-4 md:px-0 md:pl-[24px] mt-[26px]">
      <div className="flex-shrink-0">
        <BuildingFilter />
      </div>

      <div className="flex-1 flex flex-col px-0 md:px-5 md:overflow-hidden">
        <h1 className="font-bold text-[24px] md:text-[32px] pt-[15px] pb-[28px] flex-shrink-0">
          All Building Options
        </h1>
        <div className="flex-1 md:overflow-y-auto pb-[60px]">
          <div className="flex flex-col gap-[36px] items-center sm:items-start">
            <BestFit />
            <DecentFit />
            <WildCard />
          </div>
        </div>
      </div>
    </div>
  );
}
