import { Link, useLocation } from "react-router-dom";

function mapTarget(state: unknown): string {
  if (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof state.from === "string" &&
    state.from.startsWith("/map")
  ) {
    return state.from;
  }
  return "";
}

export default function MapBackLink() {
  const target = mapTarget(useLocation().state);
  if (target === "") return null;

  return (
    <Link
      to={target}
      className="inline-flex items-center gap-1 text-[14px] text-gray-600 transition-colors duration-200 hover:text-black"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3 5 8l5 5" />
      </svg>
      Back to Campus Map
    </Link>
  );
}
