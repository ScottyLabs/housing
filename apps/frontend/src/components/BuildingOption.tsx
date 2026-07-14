import { Link } from "react-router-dom";
import type { Building } from "./BuildingContext";

export default function BuildingOption({
    building,
    width,
    height
}: {
    building: Building;
    width: number;
    height: number;
}) {
    return (
        <Link to={`/building/${building.id}`}>
            <div className="relative overflow-hidden rounded-[18px]" style={{ width: width, height: height }}>
                <img
                    src={building.media.mainImage}
                    alt={building.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                    className="
                    absolute 
                    inset-x-0 
                    bottom-0 
                    h-24
                    bg-gradient-to-t 
                    from-black/50
                    to-transparent
                    pointer-events-none
                "
                />

                <div
                    className="
                    absolute 
                    bottom-0 
                    left-0 
                    m-2 
                    text-white
                    px-6 py-2 
                    rounded
                    text-[24px]
                    font-semibold
                ">
                    {building.name}
                </div>
            </div>
        </Link>
    );
}
