import { Building, useBuildings } from "./BuildingContext";
import DropdownButton, { SelectOption } from "@/components/DropdownButton";
import { ACLevel, BathroomType, RoomType } from "@/data/buildingTypes";

const bathroomTypeLabel: Record<BathroomType, string> = {
  [BathroomType.Communal]: "Communal",
  [BathroomType.SharedSuite]: "Shared Suite",
  [BathroomType.Private]: "Private",
};

export default function BuildingColumn({
  building,
  onChangeAction,
}: {
  building: Building;
  onChangeAction: (id: string) => void;
}) {
  const buildings: Building[] = useBuildings().sort((b1, b2) =>
    b1.name.toLowerCase().localeCompare(b2.name.toLowerCase()),
  );
  const buildingOptions: SelectOption[] = buildings.map((b) => ({ value: b.id, label: b.name }));

  return (
    <>
      <img
        src={building.media.mainImage}
        alt={building.name}
        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "18px" }}
      />

      <DropdownButton
        options={buildingOptions}
        onChangeAction={onChangeAction}
        value={building.id}
      />

      <div className="flex items-center gap-4 mt-2">
        <img src={"/amenities.svg"} alt={"amenities"} width={36} height={36} className="w-9 h-9" />
        <h1 className="font-semibold text-[20px]">Amenities</h1>
      </div>

      <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
        Room Types
        {building.amenities.roomTypes.includes(RoomType.TradSingle) && (
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad single.svg"}
              alt={"trad single"}
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
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad single.svg"}
              alt={"semi-suite single"}
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
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad double.svg"}
              alt={"trad double"}
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
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad double.svg"}
              alt={"semi-suite double"}
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
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad triple.svg"}
              alt={"trad triple"}
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
          <div className="flex gap-3 pt-2.5 pb-1 items-center">
            <img
              src={"/unsorted-icons/room type/trad triple.svg"}
              alt={"semi-suite triple"}
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
          <div className="text-[16px] pb-1">{building.amenities.kitchen.details}</div>
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
          <div className="text-[16px] whitespace-normal break-words">
            <div>
              {building.amenities.bathrooms.types.map((t) => bathroomTypeLabel[t]).join(", ")}
            </div>
            <div className="font-normal text-[16px] whitespace-normal break-words">
              {building.amenities.bathrooms.details}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
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
          <div className="text-[16px] pt-1 pb-1">{building.amenities.ac.details}</div>
        </div>
      </div>
    </>
  );
}
