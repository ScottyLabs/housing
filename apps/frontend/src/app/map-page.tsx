export default function MapPage() {
  return (
    <div className="flex md:h-full px-4 sm:px-20 md:px-30 lg:px-40 justify-left mt-[26px]">
      <div className="flex flex-col md:h-full w-full">
        <h1 className="font-bold text-[24px] md:text-[32px] py-3 flex-shrink-0 align-left">
          Housing Map
        </h1>
        Hover over buildings
        <div className="py-3 w-full max-w-[1165px]">
          <div className="w-full aspect-[1162.9287/1014.8657]">
            <iframe
              src="/housingmap.svg"
              title="Housing map"
              className="w-full h-full rounded-2xl border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
