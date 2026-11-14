import { Link } from "react-router-dom";
import type { CurrentUser } from "@/hooks/useCurrentUser";

// Temporary: stands in for the profile page until it is built.
const itemClass = "block rounded-xl px-4 py-2 text-[14px] whitespace-nowrap hover:bg-gray-100";

function UserHeader({ user }: { user: CurrentUser }) {
  return (
    <div className="mb-1 max-w-56 border-b border-black/10 px-4 pb-2 pt-1">
      <p className="truncate text-[14px] font-semibold">{user.name}</p>
      <p className="truncate text-[12px] text-gray-500">{user.andrewId}</p>
    </div>
  );
}

export default function ProfilePanel({
  user,
  onClose,
}: {
  user: CurrentUser | undefined;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
      {user !== undefined && <UserHeader user={user} />}
      <Link to="/survey" onClick={onClose} className={itemClass}>
        Redo survey
      </Link>
      <a href="/api/auth/logout" className={itemClass}>
        Sign out
      </a>
    </div>
  );
}
