export default function NavbarSpacer({
    left_nbr_path,
    right_nbr_path,
    pathname
}: {
    left_nbr_path: string;
    right_nbr_path: string;
    pathname: string;
}) {
    return (
        <div className="flex h-16 w-2 items-center justify-center">
            <div
                className={`h-10 w-0 border-black/20 border-1 rounded-full
                                ${pathname === left_nbr_path || pathname === right_nbr_path ? "hidden" : ""}`}
            />
        </div>
    );
}
