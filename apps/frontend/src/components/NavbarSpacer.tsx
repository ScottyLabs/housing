export default function NavbarSpacer({ hidden }: { hidden: boolean }) {
  return (
    <div className="flex h-16 w-2 items-center justify-center">
      <div className={`h-10 w-0 border-black/20 border-1 rounded-full ${hidden ? "hidden" : ""}`} />
    </div>
  );
}
