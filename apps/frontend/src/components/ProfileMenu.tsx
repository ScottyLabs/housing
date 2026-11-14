import { type RefObject, useEffect, useRef, useState } from "react";
import type { CurrentUser } from "@/hooks/useCurrentUser";
import ProfilePanel from "./ProfilePanel";

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

export default function ProfileMenu({ user }: { user: CurrentUser | undefined }) {
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
      {isOpen && <ProfilePanel user={user} onClose={close} />}
    </div>
  );
}
