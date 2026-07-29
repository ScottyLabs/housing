import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { type Building, useBuildingById, useBuildings } from "@/components/BuildingContext";
import { ACLevel, BathroomType, RoomType } from "@/data/buildingTypes";

const bathroomTypeLabel: Record<BathroomType, string> = {
  [BathroomType.Communal]: "Communal",
  [BathroomType.SharedSuite]: "Shared Suite",
  [BathroomType.Private]: "Private",
};

export default function BuildingDetails({ buildingID }: { buildingID?: string }) {
  const { id } = useParams();
  const building: Building = useBuildingById(buildingID ?? id ?? "");
  const allBuildings = useBuildings();

  type GalleryItem = { link: string; description: string; virtualTourLink?: string };
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox(
        (lb) => lb && { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length },
      ),
    [],
  );
  const next = useCallback(
    () => setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.items.length }),
    [],
  );

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

  const closeBuildingNames = building.location.closeBuildings
    .map((closeId) => allBuildings.find((b) => b.id === closeId))
    .filter((b): b is Building => b !== undefined);

  return (
    <div className="space-y-4 overflow-x-auto min-w-40 max-w-full pb-3 pt-3 px-4 sm:px-10 md:px-20 lg:px-30">
      <h2 className="font-bold text-[24px] flex-shrink-0">{building.name}</h2>
      <div className="w-full h-[300px]">
        <div className="relative w-full h-full overflow-hidden rounded-[18px]">
          <img
            className="w-full h-full object-cover"
            src={building.media.mainImage}
            alt={building.name}
          />
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
          {building.amenities.roomTypes.includes(RoomType.TradSingle) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-single.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.SemiSuiteSingle) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl2xl">
              <img
                src={"/unsorted-icons/room-type/trad-single.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.TradDouble) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-double.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.SemiSuiteDouble) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-double.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.TradTriple) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-triple.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.SemiSuiteTriple) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-triple.svg"}
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
          {building.amenities.roomTypes.includes(RoomType.SemiSuiteQuad) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-triple.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />

              <div className="text-[16px] whitespace-normal break-words">
                <span className="font-normal">Semi-Suite</span> Quad
              </div>
            </div>
          )}
          {building.amenities.roomTypes.includes(RoomType.ApartmentTriple) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-triple.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />

              <div className="text-[16px] whitespace-normal break-words">
                <span className="font-normal">Apartment</span> Triple
              </div>
            </div>
          )}
          {building.amenities.roomTypes.includes(RoomType.StudioApartmentSingle) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-single.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />

              <div className="text-[16px] whitespace-normal break-words">
                <span className="font-normal">Studio Apartment</span> Single
              </div>
            </div>
          )}
          {building.amenities.roomTypes.includes(RoomType.StudioApartmentDouble) && (
            <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
              <img
                src={"/unsorted-icons/room-type/trad-double.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />

              <div className="text-[16px] whitespace-normal break-words">
                <span className="font-normal">Studio Apartment</span> Double
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
              <div>
                {building.amenities.bathrooms.types.map((t) => bathroomTypeLabel[t]).join(", ")}
              </div>
              <div className="font-normal text-[16px] whitespace-normal break-words">
                {building.amenities.bathrooms.details}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
          Closest Buildings
          <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
            <img src={"/distance.svg"} alt={"info"} width={36} height={36} className="w-9 h-9" />
            <div className="min-w-0 flex-1">
              {building.location.note && (
                <div className="text-[16px] whitespace-normal break-words">
                  {building.location.note}
                </div>
              )}
              {closeBuildingNames.length > 0 && (
                <div className="flex flex-wrap gap-x-2 text-[14px] pt-1">
                  {closeBuildingNames.map((b) => (
                    <Link
                      key={b.id}
                      to={`/building/${b.id}`}
                      className="text-brand-primary underline"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
          Air Conditioning
          <div className="flex gap-3 pt-2.5 pb-1 items-center rounded-2xl">
            {building.amenities.ac.level !== ACLevel.None && (
              <img
                src={"/unsorted-icons/ac/yes.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />
            )}
            {building.amenities.ac.level === ACLevel.None && (
              <img
                src={"/unsorted-icons/ac/none.svg"}
                alt={"info"}
                width={36}
                height={36}
                className="w-9 h-9"
              />
            )}

            <div className=" text-[16px] pt-1 pb-1">{building.amenities.ac.details}</div>
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

            <div className="text-[16px] pb-1">{building.amenities.kitchen.details}</div>
          </div>
        </div>
        <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
          Common Areas
          <div className="flex gap-3 pt-1 pb-1 items-center rounded-2xl">
            <img
              src={"/unsorted-icons/work-with-others.svg"}
              alt={"info"}
              width={36}
              height={36}
              className="w-9 h-9"
            />

            <div className="text-[16px] pt-1 pb-1">{building.amenities.commonAreas.details}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2.5 items-center">
        <img src={"/gallery.svg"} alt={"gallery"} width={36} height={36} className="w-9 h-9" />

        <div className="h-fit ">
          <h1 className="font-semibold text-[20px] flex-shrink-0">Photo Gallery</h1>
        </div>
      </div>
      <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-2.5 rounded-2xl bg-brand-menugray border border-black/10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {building.media.photos.map((image, i) => (
            <div
              key={image.link}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setLightbox({ items: building.media.photos, index: i })}
            >
              <img
                src={image.link}
                alt={image.description}
                className="w-full rounded-xl transition-opacity group-hover:opacity-80"
              />
              <div className="text-center text-[16px] pt-2">{image.description}</div>
            </div>
          ))}
        </div>
      </div>
      {building.media.floorPlans.length > 0 &&
        (() => {
          const roomTypePlans = building.media.floorPlans.filter((p) => p.category === "roomType");
          const floorPlans = building.media.floorPlans.filter((p) => p.category === "floor");

          const roomTypeIcon = (desc: string): string | null => {
            const d = desc.toLowerCase();
            if (d.includes("triple")) return "/unsorted-icons/room-type/trad-triple.svg";
            if (d.includes("double")) return "/unsorted-icons/room-type/trad-double.svg";
            if (d.includes("single")) return "/unsorted-icons/room-type/trad-single.svg";
            return null;
          };

          const SubGrid = ({
            items,
            label,
            gridClass,
          }: {
            items: GalleryItem[];
            label: string;
            gridClass: string;
          }) =>
            items.length === 0 ? null : (
              <div className="space-y-2">
                <div className="font-semibold text-[16px] px-1">{label}</div>
                <div className={`grid grid-cols-1 gap-4 ${gridClass}`}>
                  {items.map((plan, i) => {
                    const icon = roomTypeIcon(plan.description);
                    return (
                      <div
                        key={plan.link}
                        className="flex flex-col cursor-pointer group bg-white rounded-xl p-2 shadow-sm border border-black/5 transition-shadow hover:shadow-md"
                        onClick={() => setLightbox({ items, index: i })}
                      >
                        <div className="relative">
                          <img
                            src={plan.link}
                            alt={plan.description}
                            className="w-full rounded-lg border border-gray-200 transition-opacity group-hover:opacity-80"
                          />
                          <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border border-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 3 L17 3 Q21 3 21 7 L21 13" />
                              <path d="M13 21 L7 21 Q3 21 3 17 L3 11" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-2 pb-1">
                          {icon && (
                            <img
                              src={icon}
                              alt=""
                              width={18}
                              height={18}
                              className="w-[18px] h-[18px] flex-shrink-0"
                            />
                          )}
                          <span className="font-normal text-[16px]">{plan.description}</span>
                        </div>
                        {plan.virtualTourLink && (
                          <a
                            href={plan.virtualTourLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full text-center text-white text-[16px] bg-brand-primary hover:opacity-90 transition-opacity rounded-lg py-1.5 mt-1 mb-1"
                          >
                            Virtual Tour
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );

          return (
            <>
              <div className="flex gap-3 pt-2.5 items-center">
                <img
                  src={"/floorplans.svg"}
                  alt={"floorplans"}
                  width={36}
                  height={36}
                  className="w-9 h-9"
                />
                <div className="h-fit">
                  <h1 className="font-semibold text-[20px] flex-shrink-0">Floor Plans</h1>
                </div>
              </div>
              <div className="flex-1 text-[16px] pt-2.5 pb-2.5 px-2.5 rounded-2xl bg-brand-menugray border border-black/10 space-y-6">
                <SubGrid
                  items={roomTypePlans}
                  label="Room Types"
                  gridClass="sm:grid-cols-2 md:grid-cols-3"
                />
                <SubGrid items={floorPlans} label="Floors" gridClass="sm:grid-cols-2" />
              </div>
            </>
          );
        })()}

      {lightbox &&
        (() => {
          const item = lightbox.items[lightbox.index];
          const hasMultiple = lightbox.items.length > 1;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              {hasMultiple && (
                <button
                  className="absolute left-4 text-white text-3xl px-3 py-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous"
                >
                  &lt;
                </button>
              )}

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

              {hasMultiple && (
                <button
                  className="absolute right-4 text-white text-3xl px-3 py-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next"
                >
                  &gt;
                </button>
              )}

              <button
                className="absolute top-4 right-4 text-white text-2xl px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                onClick={closeLightbox}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          );
        })()}
    </div>
  );
}
