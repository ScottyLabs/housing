
export default function MapPage() {
    return (
        <div className="flex h-full px-10 sm:px-20 md:px-30 lg:px-40 justify-left mt-[26px]">
            <div className="flex flex-col px-0 overflow-hidden">
                <h1 className="font-bold text-[32px] py-3 flex-shrink-0 align-left">Housing Map</h1>
                                        <img
                            src={"/campusmap.svg"}
                            alt={"campus map"}
                            className="rounded-2xl border"
                        />
            </div>
        </div>
    );
}
