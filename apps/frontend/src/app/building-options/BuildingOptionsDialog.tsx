import { useEffect, useId, useRef } from "react";
import type { Building } from "../../components/BuildingContext.tsx";
import TaggedBuildingOption from "./TaggedBuildingOption.tsx";

// Open a native modal for Escape handling and focus trapping, and lock background scrolling.
function useModalDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const closeOnBackdrop = (event: MouseEvent) => {
      if (!dialog) return;
      const bounds = dialog.getBoundingClientRect();
      // Backdrop clicks target the dialog too; only clicks outside its bounds should close it.
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      ) {
        dialog.close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    dialog?.addEventListener("click", closeOnBackdrop);
    return () => {
      dialog?.removeEventListener("click", closeOnBackdrop);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return dialogRef;
}

// "See More" displays every building in the selected category, using the current filter results.
export default function BuildingOptionsDialog({
  title,
  buildings,
  onClose,
}: {
  title: string;
  buildings: Building[];
  onClose: () => void;
}) {
  const dialogRef = useModalDialog();
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={(event) => {
        // Strict Mode can reopen the dialog before an earlier cleanup's close event arrives.
        if (!event.currentTarget.open) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-2xl bg-white p-0 text-black shadow-2xl backdrop:bg-black/60"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-white px-4 py-4 sm:px-6">
        <h2 id={titleId} className="text-2xl font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
          aria-label="Close building list"
          className="shrink-0 cursor-pointer rounded-full px-3 py-1 text-2xl hover:bg-brand-menugray"
        >
          &times;
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,240px)] justify-center gap-6 p-4 sm:p-6 md:grid-cols-[repeat(auto-fit,320px)]">
        {buildings.map((building) => (
          <TaggedBuildingOption key={building.id} building={building} />
        ))}
      </div>
    </dialog>
  );
}
