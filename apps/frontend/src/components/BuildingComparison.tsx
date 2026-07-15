import { Building, useBuildings } from "./BuildingContext";
import DropdownButton, { SelectOption } from "@/components/DropdownButton";

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
        src={building.image}
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
        {building.rooms.includes("tradSingle") && (
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
        {building.rooms.includes("semiSuiteSingle") && (
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
        {building.rooms.includes("tradDouble") && (
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
        {building.rooms.includes("semiSuiteDouble") && (
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
        {building.rooms.includes("tradTriple") && (
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
        {building.rooms.includes("semiSuiteTriple") && (
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
          <div className="text-[16px] pb-1">{building.kitchen}</div>
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
            <div>{building.bathrooms.type}</div>
            <div className="font-normal text-[16px] whitespace-normal break-words">
              {building.bathrooms.details}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[16px] pt-2.5 pb-2.5 px-4 rounded-2xl bg-brand-menugray border border-black/10">
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
          <div className="text-[16px] pt-1 pb-1">{building.AC.details}</div>
        </div>
      </div>
    </>
  );
}
