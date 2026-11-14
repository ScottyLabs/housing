import { useBuildingStatus, useReloadBuildings } from "@/components/BuildingContext";
import StatusMessage from "@/components/StatusMessage";

export default function BuildingGate({ children }: { children: React.ReactNode }) {
  const status = useBuildingStatus();
  const reload = useReloadBuildings();

  if (status === "loaded") return children;

  return (
    <div className="flex flex-col items-center gap-3 p-10">
      <StatusMessage
        message={status === "failed" ? "Could not load buildings." : "Loading buildings"}
        error={status === "failed"}
      />
      {status === "failed" && (
        <button
          type="button"
          onClick={reload}
          className="rounded-lg bg-brand-primary px-4 py-2 text-[16px] text-white hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
