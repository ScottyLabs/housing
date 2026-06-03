import { useParams } from "react-router-dom";
import { type Building, useBuildingById } from "@/components/BuildingContext";

export default function BuildingDetails({ buildingID }: { buildingID?: string }) {
    const { id } = useParams();

    const building: Building = useBuildingById(buildingID ?? id ?? "");
    if (!building) return <div>Not found</div>;
    return (
        <div className="space-y-4 overflow-x-auto min-w-40 max-w-full pb-3 pt-3 px-30">
            <h2 className="font-bold text-[24px] flex-shrink-0">{building.name}</h2>
            <div className="w-full h-[300px]">
                <div className="relative w-full h-full overflow-hidden rounded-[18px]">
                    <img className="w-full h-full object-cover" src={building.image} alt={building.name} />
                </div>
            </div>

            <div className="flex gap-3 pt-2.5 items-center">
                <img src={"/amenities.svg"} alt={"amenities"} width={36} height={36} className="w-9 h-9" />

                <div className="h-fit items-center">
                    <h1 className="font-semibold text-[20px] flex-shrink-0">Amenities</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 min-w-0">
                <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Room Types
                    {building.rooms.includes("tradSingle") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                            <img
                                src={"/unsorted-icons/room type/trad single.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Single
                            </div>
                        </div>
                    )}
                    {building.rooms.includes("semiSuiteSingle") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl2xl">
                            <img
                                src={"/unsorted-icons/room type/trad single.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Single
                            </div>
                        </div>
                    )}
                    {building.rooms.includes("tradDouble") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                            <img
                                src={"/unsorted-icons/room type/trad double.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Double
                            </div>
                        </div>
                    )}
                    {building.rooms.includes("semiSuiteDouble") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                            <img
                                src={"/unsorted-icons/room type/trad double.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Double
                            </div>
                        </div>
                    )}
                    {building.rooms.includes("tradTriple") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                            <img
                                src={"/unsorted-icons/room type/trad triple.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Triple
                            </div>
                        </div>
                    )}
                    {building.rooms.includes("semiSuiteTriple") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                            <img
                                src={"/unsorted-icons/room type/trad triple.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />

                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Triple
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Bathrooms
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img
                            src={"/unsorted-icons/toilet.svg"}
                            alt={"info"}
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />
                        <div className="text-[16px] whitespace-normal break-words ">
                            <div>{building.bathrooms.type}</div>
                            <div className="font-normal text-[16px] whitespace-normal break-words">
                                {building.bathrooms.details}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Closest Buildings
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img src={"/distance.svg"} alt={"info"} width={36} height={36} className="w-9 h-9" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[16px] whitespace-normal break-words">{building.closeBuildings}</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Air Conditioning
                    <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                        {building.AC.available && (
                            <img
                                src={"/unsorted-icons/ac/yes.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />
                        )}
                        {building.AC.available === false && (
                            <img
                                src={"/unsorted-icons/ac/none.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />
                        )}

                        <div className=" text-[16px] pt-1 pb-1">{building.AC.details}</div>
                    </div>
                </div>

                <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Kitchen
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img
                            src={"/unsorted-icons/stove.svg"}
                            alt={"info"}
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />

                        <div className="text-[16px] pb-1">{building.kitchen}</div>
                    </div>
                </div>
                <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Common Areas
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img
                            src={"/unsorted-icons/work with others.svg"}
                            alt={"info"}
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />

                        <div className="text-[16px] pt-1 pb-1">{building.lounge}</div>
                    </div>
                </div>
            </div>
            {/*             
            <div className="flex gap-3 pt-2.5 px-4 items-center">
                <img src={"/location.svg"} alt={"location"} width={48} height={48} className="w-9 h-9" />

                <div className="h-fit ">
                    <h1 className="font-semibold text-[24px] pt-[15px] pb-2.5 flex-shrink-0">Location</h1>
                </div>
            </div> */}
            <div className="flex gap-3 pt-2.5 items-center">
                <img src={"/gallery.svg"} alt={"gallery"} width={36} height={36} className="w-9 h-9" />

                <div className="h-fit ">
                    <h1 className="font-semibold text-[20px] flex-shrink-0">Photo Gallery</h1>
                </div>
            </div>
            <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-2.5 rounded-2xl bg-brand-menugray border border-black/10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {building.photoGallery.map((image) => {
                        return (
                            <div key={image.link} className="flex flex-col items-center">
                                <img src={image.link} alt={image.description} className="w-full rounded-xl" />

                                <div className="text-center text-[14px] pt-2">{image.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* <div className="flex gap-3 pt-2.5 px-4 items-center">
                <img src={"/floorplans.svg"} alt={"floorplans"} width={48} height={48} className="w-9 h-9" />

                <div className="h-fit ">
                    <h1 className="font-semibold text-[24px] pt-[15px] pb-2.5 flex-shrink-0">Floor Plan Gallery</h1>
                </div>
            </div>
            <div className="flex gap-3 pt-2.5 px-4 items-center">
                <img src={"/videos.svg"} alt={"videos"} width={48} height={48} className="w-9 h-9" />

                <div className="h-fit ">
                    <h1 className="font-semibold text-[24px] pt-[15px] pb-2.5 flex-shrink-0">Video Walkthroughs</h1>
                </div>
            </div> */}
        </div>
    );
}
