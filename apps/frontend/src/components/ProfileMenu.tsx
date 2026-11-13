import { type RefObject, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Temporary: stands in for the profile page until it is built.
const itemClass = "block rounded-xl px-4 py-2 text-[14px] whitespace-nowrap hover:bg-gray-100";

function useDismiss(container: RefObject<HTMLDivElement | null>, onDismiss: () => void) {
  useEffect(() => {
    const dismiss = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      const { target } = event;
      const inside = target instanceof Node && container.current?.contains(target) === true;
      if (event instanceof MouseEvent && inside) return;
      onDismiss();
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [container, onDismiss]);
}

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const close = () => {
    setIsOpen(false);
  };
  useDismiss(container, close);

  return (
    <div ref={container} className="relative min-w-max">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open);
        }}
        className="cursor-pointer"
      >
        <img src="/profile.svg" alt="Profile menu" className="rounded-full w-10 h-10 mx-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
          <Link to="/survey" onClick={close} className={itemClass}>
            Redo survey
          </Link>
          <a href="/api/auth/logout" className={itemClass}>
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
