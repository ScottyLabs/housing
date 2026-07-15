
export default function MapPage() {
    return (
        <div className="flex h-full px-10 sm:px-20 md:px-30 lg:px-40 justify-left mt-[26px]">
            <div className="flex flex-col h-full px-0">
                <h1 className="font-bold text-[32px] py-3 flex-shrink-0 align-left">Housing Map</h1>
                
                    Hover over buildings
                    <div className="py-3">
                    <iframe
                        src="/housingmap.svg"
                        title="Housing map"
                        width="1165"
                        height="1016"
                        scrolling="no"
                        className="rounded-2xl border"
                    />
                </div>
            </div>
        </div>
    );
}
