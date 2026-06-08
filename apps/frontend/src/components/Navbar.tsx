import { Link, useLocation } from "react-router-dom";
import NavButton from "./NavButton";
import NavbarSpacer from "./NavbarSpacer";

export default function Navbar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="w-full">
            <div className="flex items-center h-24 whitespace-nowrap">
                <Link
                    to="/"
                    className="px-6 py-3 gap-2 min-w-max relative rounded-2xl flex items-center cursor-pointer transition-colors duration-200 hover:bg-gray-100">
                    <img src="/cmuhousingdog.svg" alt="CMU Housing" className="w-10 h-10" />
                    <div className="hidden lg:block">
                        <img src="/logo.svg" alt="CMU Housing" className="relative w-42 h-8 top-1" />
                    </div>
                </Link>

                <div className="flex flex-1 items-center justify-between mx-10 sm:mx-22 lg:mx-24">
                    <NavButton
                        href="/building-options"
                        name="All Building Options"
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
                        name="Building Comparison"
                        icon="/comparison.svg"
                        isActive={pathname === "/building-comparison"}
                    />
                    <NavbarSpacer left_nbr_path="/building-comparison" right_nbr_path="/map" pathname={pathname} />
                    <NavButton href="/map" name="Campus Map" icon="/map.svg" isActive={pathname === "/map"} />
                    <NavbarSpacer left_nbr_path="/map" right_nbr_path="/roommates" pathname={pathname} />
                    <NavButton
                        href="/roommates"
                        name="Roommates"
                        icon="/person.svg"
                        isActive={pathname === "/roommates"}
                    />
                </div>
                <div className="flex gap-1 items-center mx-2 ">
                    {/* TODO: add share link */}
                    <Link
                        to="/"
                        className="py-3 px-3 h-full rounded-2xl border select-none cursor-pointer transition-colors duration-200 bg-brand-menugray hover:bg-gray-200 border-black/10">
                        <div className="flex gap-2 items-center whitespace-normal h-full text-xs">
                            <img src="/share.svg" alt="Share Icon" className="brightness-100 min-w-max" />
                            <div className="whitespace-normal hidden lg:block">Share with friends!</div>
                        </div>
                    </Link>
                    <Link to="/profile" className="min-w-max">
                        <img src="/profile.svg" alt="profile" className="rounded-full w-10 h-10  mx-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
