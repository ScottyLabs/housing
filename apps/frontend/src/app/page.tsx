import BuildingPanelDemo from "./BuildingPanelDemo";

export default function Home() {
  return (
    <div className="flex justify-center md:h-full px-4 md:px-0 mt-[26px]">
      <div className="flex flex-col w-full md:w-auto md:overflow-hidden">
        <h1 className="hidden md:block font-bold text-[32px] py-3 flex-shrink-0">Home</h1>
        <div className="md:overflow-y-auto">
          <div className="flex flex-col gap-[16px] items-center sm:items-start pb-2">
            <BuildingPanelDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
