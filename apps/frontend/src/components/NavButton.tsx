import { Link } from "react-router-dom";

export default function NavButton({
  href,
  name,
  icon,
  isActive,
  horizontal = false,
}: {
  href: string;
  name: string;
  icon: string;
  isActive: boolean;
  // Desktop layout: icon beside the label, hugging its text.
  horizontal?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`
                flex rounded-2xl transition-colors duration-200 items-center justify-center
                ${horizontal ? "h-13 px-4.5 min-[1280px]:px-3 min-[1700px]:px-5.5" : "p-3"}
                ${isActive ? "bg-brand-primary text-white" : "hover:bg-gray-100"}
            `}
    >
      <div
        className={`flex items-center whitespace-normal ${
          horizontal
            ? "gap-2 text-left text-sm leading-tight min-[1700px]:text-base"
            : "flex-col gap-1 text-center text-xs lg:text-sm"
        }`}
      >
        <img
          src={icon}
          alt={`${name} Icon`}
          className={`${horizontal ? "shrink-0" : ""} ${isActive ? "brightness-0 invert" : "brightness-100"}`}
        />
        <div className={horizontal ? "hidden xl:block" : ""}>{name}</div>
      </div>
    </Link>
  );
}
