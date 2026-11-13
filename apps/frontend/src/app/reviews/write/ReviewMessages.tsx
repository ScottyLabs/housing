import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Building } from "@/components/BuildingContext";
import { signInUrl } from "@/hooks/useSignInStatus";

const primaryButton =
  "flex h-[56px] w-full items-center justify-center rounded-2xl bg-brand-primary px-6 text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-auto sm:min-w-[204px]";
const secondaryButton =
  "flex h-[56px] w-full items-center justify-center rounded-2xl bg-brand-buttongray px-6 font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3] sm:w-auto sm:min-w-[204px]";

/** Page title with a link back to the building picker, shared by every review form state. */
export function ReviewPageHeader({ title }: { title: string }) {
  return (
    <>
      <Link to="/reviews" className="text-[14px] text-gray-700 hover:underline">
        &lsaquo; All buildings
      </Link>
      <h1 className="mt-2 text-[32px] font-bold leading-none">{title}</h1>
    </>
  );
}

/** The info banner at the top of the survey, reused for review notes. */
export function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-6">
      <img
        src="/unsorted-icons/info.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 flex-shrink-0"
      />
      <p className="text-[18px] font-semibold leading-snug">{children}</p>
    </div>
  );
}

function MessageCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-tight">{title}</h2>
      {children}
    </div>
  );
}

export function SignInPrompt({ building, returnPath }: { building: Building; returnPath: string }) {
  return (
    <MessageCard title={`Sign in to review ${building.name}`}>
      <p className="mt-3 max-w-[640px] text-[18px] leading-snug">
        Reviews are tied to your Andrew ID so each student reviews a building once. Other students
        only see your first name and last initial.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href={signInUrl(returnPath)} className={primaryButton}>
          Sign in
        </a>
        <Link to="/reviews" className={secondaryButton}>
          Back
        </Link>
      </div>
    </MessageCard>
  );
}

export function ReviewPosted({ building, wasEdit }: { building: Building; wasEdit: boolean }) {
  return (
    <MessageCard title={wasEdit ? "Your review is updated" : "Thanks for your review!"}>
      <p className="mt-3 text-[18px] leading-snug">
        Your review of {building.name} is posted. You can come back to this page to change it.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link to={`/building/${building.id}`} className={primaryButton}>
          Back to {building.name}
        </Link>
        <Link to="/reviews" className={secondaryButton}>
          Review another building
        </Link>
      </div>
    </MessageCard>
  );
}

export function BuildingNotFound() {
  return (
    <MessageCard title="We couldn't find that building">
      <div className="mt-8">
        <Link to="/reviews" className={primaryButton}>
          Pick a building
        </Link>
      </div>
    </MessageCard>
  );
}
