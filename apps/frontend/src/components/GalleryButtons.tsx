import { useState } from "react";
import type { Building } from "@/components/BuildingContext";
import Lightbox, { type LightboxItem, type LightboxState } from "@/components/Lightbox";

function OpenButton({
  icon,
  label,
  count,
  onClickAction,
}: {
  icon: string;
  label: string;
  count: number;
  onClickAction: () => void;
}) {
  return (
    <button
      type="button"
      disabled={count === 0}
      onClick={() => {
        onClickAction();
      }}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-brand-menugray px-3 py-2 text-[14px] font-medium transition-colors hover:bg-brand-buttongray disabled:cursor-not-allowed disabled:opacity-40"
    >
      <img src={icon} alt="" aria-hidden="true" className="h-5 w-5" />
      {label}
    </button>
  );
}

export default function GalleryButtons({ building }: { building: Building }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const { photos, floorPlans } = building.media;
  const open = (items: LightboxItem[]) => {
    setLightbox({ items, index: 0 });
  };

  return (
    <div className="flex gap-2">
      <OpenButton
        icon="/gallery.svg"
        label="Photos"
        count={photos.length}
        onClickAction={() => {
          open(photos);
        }}
      />
      <OpenButton
        icon="/floorplans.svg"
        label="Floor Plans"
        count={floorPlans.length}
        onClickAction={() => {
          open(floorPlans);
        }}
      />
      {lightbox !== null && (
        <Lightbox
          state={lightbox}
          onChangeAction={setLightbox}
          onCloseAction={() => {
            setLightbox(null);
          }}
        />
      )}
    </div>
  );
}
