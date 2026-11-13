export function StaticFilterHeader({
  name,
  desc,
  icon,
}: {
  name: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="flex w-full items-center gap-[12px]">
      <img src={icon} alt="" aria-hidden="true" className="h-[38.4px] w-[38.4px]" />
      <div className="h-fit">
        <h2 className="text-[18px] font-semibold leading-none">{name}</h2>
        {desc !== "" && <h3 className="pt-1 text-[12px] leading-none text-gray-500">{desc}</h3>}
      </div>
    </div>
  );
}

export default function FilterHeader({
  name,
  desc,
  icon,
  isOpen,
  contentId,
  badge,
  onToggleAction,
}: {
  name: string;
  desc: string;
  icon: string;
  isOpen: boolean;
  contentId: string;
  badge: number;
  onToggleAction: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={onToggleAction}
      className="flex w-full cursor-pointer items-center gap-[12px] border-none bg-transparent p-0 text-left"
    >
      <img src={icon} alt="" aria-hidden="true" className="h-[38.4px] w-[38.4px]" />
      <span className="block h-fit flex-1">
        <span className="block text-[18px] font-semibold leading-none">{name}</span>
        {desc !== "" && (
          <span className="block pt-1 text-[12px] leading-none text-gray-500">{desc}</span>
        )}
      </span>
      {badge > 0 && (
        <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[12px] font-medium text-white">
          <span className="sr-only">Selected: </span>
          {badge}
        </span>
      )}
      <img
        src="/dropdown-closed.svg"
        alt=""
        aria-hidden="true"
        className={`h-[8px] w-[14px] transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}
