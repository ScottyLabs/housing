import { useState } from "react";
import { Building, useBuildings } from "./BuildingContext";
import DropdownButton, { SelectOption } from "@/components/DropdownButton";

export default function BuildingComparison({building}: {building: Building;}) {
    const buildings: Building[] = useBuildings().sort((b1, b2) =>
            b1.name.toLowerCase().localeCompare(b2.name.toLowerCase())
        );
    const buildlingOptions: SelectOption[] = buildings.map((b) => ({ value: b.id, label: b.name }));

    const [buildingId, setBuilding] = useState(building.id);
    const selectedBuilding = buildings.find((b) => b.id === buildingId) ?? building;

    const handleDistanceFromChange = (value: string) => {
        setBuilding(value);
    };

    return (
        <div className="px-[15px] pb-[24px] pt-[15px]">
            <div className="flex flex-col gap-2 w-[280px]">
                <img
                    src={selectedBuilding.image}
                    alt={selectedBuilding.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "18px" }}
                />

                <DropdownButton
                    options={buildlingOptions}
                    onChangeAction={handleDistanceFromChange}
                    value={buildingId}
                />

                <div className="flex items-center gap-4 mt-2">
                    <img src={"/amenities.svg"} alt={"amenities"} width={36} height={36} className="w-9 h-9" />
                    <h1 className="font-semibold text-[20px]">Amenities</h1>
                </div>

                <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Room Types
                    {selectedBuilding.rooms.includes("tradSingle") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad single.svg"} alt={"trad single"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Single
                            </div>
                        </div>
                    )}
                    {selectedBuilding.rooms.includes("semiSuiteSingle") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad single.svg"} alt={"semi-suite single"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Single
                            </div>
                        </div>
                    )}
                    {selectedBuilding.rooms.includes("tradDouble") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad double.svg"} alt={"trad double"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Double
                            </div>
                        </div>
                    )}
                    {selectedBuilding.rooms.includes("semiSuiteDouble") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad double.svg"} alt={"semi-suite double"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Double
                            </div>
                        </div>
                    )}
                    {selectedBuilding.rooms.includes("tradTriple") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad triple.svg"} alt={"trad triple"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Traditional</span> Triple
                            </div>
                        </div>
                    )}
                    {selectedBuilding.rooms.includes("semiSuiteTriple") && (
                        <div className="flex gap-3 pt-2.5 pb-1 items-center">
                            <img src={"/unsorted-icons/room type/trad triple.svg"} alt={"semi-suite triple"} width={36} height={36} className="w-9 h-9" />
                            <div className="text-[16px] whitespace-normal break-words">
                                <span className="font-normal">Semi-Suite</span> Triple
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Kitchen
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img
                            src={"/unsorted-icons/stove.svg"}
                            alt={"info"}
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />

                        <div className="text-[16px] pb-1">{selectedBuilding.kitchen}</div>
                    </div>
                </div>
                <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Bathroom
                    <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
                        <img
                            src={"/unsorted-icons/toilet.svg"}
                            alt={"info"}
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />
                        <div className="text-[16px] whitespace-normal break-words ">
                            <div>{selectedBuilding.bathrooms.type}</div>
                            <div className="font-normal text-[16px] whitespace-normal break-words">
                                {selectedBuilding.bathrooms.details}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
                    Air Conditioning
                    <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
                        {selectedBuilding.AC.available && (
                            <img
                                src={"/unsorted-icons/ac/yes.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />
                        )}
                        {selectedBuilding.AC.available === false && (
                            <img
                                src={"/unsorted-icons/ac/none.svg"}
                                alt={"info"}
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />
                        )}

                        <div className=" text-[16px] pt-1 pb-1">{selectedBuilding.AC.details}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
