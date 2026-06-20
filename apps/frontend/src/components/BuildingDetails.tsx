import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { type Building, useBuildingById } from "@/components/BuildingContext";

export default function BuildingDetails({ buildingID }: { buildingID?: string }) {
    const { id } = useParams();
    const building: Building = useBuildingById(buildingID ?? id ?? "");

    type GalleryItem = { link: string; description: string };
    const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

    const closeLightbox = useCallback(() => setLightbox(null), []);
    const prev = useCallback(() => setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length }), []);
    const next = useCallback(() => setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.items.length }), []);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, closeLightbox, prev, next]);

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
                    {building.photoGallery.map((image, i) => (
                        <div
                            key={image.link}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => setLightbox({ items: building.photoGallery, index: i })}
                        >
                            <img
                                src={image.link}
                                alt={image.description}
                                className="w-full rounded-xl transition-opacity group-hover:opacity-80"
                            />
                            <div className="text-center text-[14px] pt-2">{image.description}</div>
                        </div>
                    ))}
                </div>
            </div>
            {building.floorPlanGallery.length > 0 && (() => {
                const isFloorEntry = (desc: string) =>
                    /floor|level|tower|mezzanine/i.test(desc);

                const roomTypePlans = building.floorPlanGallery.filter(p => !isFloorEntry(p.description));
                const floorPlans   = building.floorPlanGallery.filter(p =>  isFloorEntry(p.description));

                const roomTypeIcon = (desc: string): string | null => {
                    const d = desc.toLowerCase();
                    if (d.includes("triple")) return "/unsorted-icons/room type/trad triple.svg";
                    if (d.includes("double")) return "/unsorted-icons/room type/trad double.svg";
                    if (d.includes("single")) return "/unsorted-icons/room type/trad single.svg";
                    return null;
                };

                const SubGrid = ({ items, label }: { items: GalleryItem[]; label: string }) =>
                    items.length === 0 ? null : (
                        <div className="space-y-2">
                            <div className="text-[14px] font-semibold text-black/50 uppercase tracking-wide px-1">{label}</div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                {items.map((plan, i) => {
                                    const icon = roomTypeIcon(plan.description);
                                    return (
                                        <div
                                            key={plan.link}
                                            className="flex flex-col cursor-pointer group bg-white rounded-xl p-2 shadow-sm border border-black/5 transition-shadow hover:shadow-md"
                                            onClick={() => setLightbox({ items, index: i })}
                                        >
                                            <img
                                                src={plan.link}
                                                alt={plan.description}
                                                className="w-full rounded-lg border border-gray-200 transition-opacity group-hover:opacity-80"
                                            />
                                            <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
                                                {icon && (
                                                    <img src={icon} alt="" width={18} height={18} className="w-[18px] h-[18px] flex-shrink-0" />
                                                )}
                                                <span className="text-center text-[14px]">{plan.description}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );

                return (
                    <>
                        <div className="flex gap-3 pt-2.5 items-center">
                            <img src={"/floorplans.svg"} alt={"floorplans"} width={36} height={36} className="w-9 h-9" />
                            <div className="h-fit">
                                <h1 className="font-semibold text-[20px] flex-shrink-0">Floor Plans</h1>
                            </div>
                        </div>
                        <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-2.5 rounded-2xl bg-brand-menugray border border-black/10 space-y-6">
                            <SubGrid items={roomTypePlans} label="Room Types" />
                            <SubGrid items={floorPlans}    label="Floors" />
                        </div>
                    </>
                );
            })()}


            {/* ── Lightbox ── */}
            {lightbox && (() => {
                const item = lightbox.items[lightbox.index];
                const hasMultiple = lightbox.items.length > 1;
                return (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* prev */}
                        {hasMultiple && (
                            <button
                                className="absolute left-4 text-white text-3xl px-3 py-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                aria-label="Previous"
                            >
                                ‹
                            </button>
                        )}

                        {/* image card */}
                        <div
                            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={item.link}
                                alt={item.description}
                                className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl"
                            />
                            <div className="text-white text-[15px]">
                                {item.description}
                                {hasMultiple && (
                                    <span className="ml-2 text-white/50 text-[13px]">
                                        {lightbox.index + 1} / {lightbox.items.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* next */}
                        {hasMultiple && (
                            <button
                                className="absolute right-4 text-white text-3xl px-3 py-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                aria-label="Next"
                            >
                                ›
                            </button>
                        )}

                        {/* close */}
                        <button
                            className="absolute top-4 right-4 text-white text-2xl px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                            onClick={closeLightbox}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                );
            })()}
        </div>
    );
}
