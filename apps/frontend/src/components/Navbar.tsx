import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavButton from "./NavButton";
import NavbarSpacer from "./NavbarSpacer";
import ShareDropdown from "./ShareDropdown";

export default function Navbar() {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b-2 border-gray-200 md:hidden">
        <Link to="/home" className="flex items-center gap-2">
          <img src="/cmuhousingdog.svg" alt="CMU Housing" className="w-10 h-10" />
          <img src="/logo.svg" alt="CMU Housing" className="h-8" />
        </Link>
        <Link to="/profile">
          <img src="/profile.svg" alt="profile" className="rounded-full w-10 h-10" />
        </Link>
      </div>

      <div className="hidden w-full border-b-2 border-gray-200 md:block">
        <div className="flex items-center h-24 whitespace-nowrap px-4">
          <Link
            to="/home"
            className="px-6 py-3 gap-2 min-w-max relative rounded-2xl flex items-center cursor-pointer transition-colors duration-200 hover:bg-gray-100"
          >
            <img src="/cmuhousingdog.svg" alt="CMU Housing" className="w-10 h-10" />
            <div className="hidden lg:block">
              <img src="/logo.svg" alt="CMU Housing" className="relative w-42 h-8 top-1" />
            </div>
          </Link>

          <div className="flex flex-1 items-center justify-between mx-10 sm:mx-22 lg:mx-24">
            <NavButton
              href="/building-options"
              name="Buildings"
              icon="/all-buildings.svg"
              isActive={pathname === "/building-options"}
            />
            <NavbarSpacer
              left_nbr_path="/building-options"
              right_nbr_path="/building-comparison"
              pathname={pathname}
            />
            <NavButton
              href="/building-comparison"
              name="Compare"
              icon="/comparison.svg"
              isActive={pathname === "/building-comparison"}
            />
            <NavbarSpacer
              left_nbr_path="/building-comparison"
              right_nbr_path="/map"
              pathname={pathname}
            />
            <NavButton href="/map" name="Map" icon="/map.svg" isActive={pathname === "/map"} />
            <NavbarSpacer left_nbr_path="/map" right_nbr_path="/reviews" pathname={pathname} />
            <NavButton
              href="/reviews"
              name="Reviews"
              icon="/write-review.svg"
              isActive={pathname === "/reviews"}
            />
          </div>
          <div className="flex gap-1 items-center mx-2 ">
            {/* TODO: add share link */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="py-3 px-3 h-full rounded-2xl border select-none cursor-pointer transition-colors duration-200 bg-brand-menugray hover:bg-gray-200 border-black/10"
              >
                <div className="flex gap-2 items-center whitespace-normal h-full text-xs">
                  <img src="/share.svg" alt="Share Icon" className="brightness-100 min-w-max" />
                  <div className="whitespace-normal hidden lg:block">Share with friends!</div>
                </div>
              </button>
              <ShareDropdown isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
            </div>
            <Link to="/profile" className="min-w-max">
              <img src="/profile.svg" alt="profile" className="rounded-full w-10 h-10  mx-2" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around h-20 bg-white border-t-2 border-gray-200 md:hidden">
        <NavButton href="/home" name="Home" icon="/home.svg" isActive={pathname === "/home"} />
        <NavButton
          href="/building-options"
          name="Buildings"
          icon="/all-buildings.svg"
          isActive={pathname === "/building-options"}
        />
        <NavButton
          href="/building-comparison"
          name="Compare"
          icon="/comparison.svg"
          isActive={pathname === "/building-comparison"}
        />
        <NavButton href="/map" name="Map" icon="/map.svg" isActive={pathname === "/map"} />
        <NavButton
          href="/reviews"
          name="Reviews"
          icon="/write-review.svg"
          isActive={pathname === "/reviews"}
        />
      </nav>
    </>
  );
}
