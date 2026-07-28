import { Link } from "react-router-dom";

export default function LaunchPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-white">
      <div className="mx-auto flex h-full max-w-[1404px] flex-col px-6 pt-24 sm:px-10 lg:pt-[126px]">
        <img src="/launch-logo.svg" alt="CMU Housing" className="h-auto w-[592px] max-w-full" />
        <p className="mt-[13px] text-[18px] font-semibold leading-none text-black">
          Find the perfect dorm for you. Unaffiliated with Carnegie Mellon University
        </p>

        <div className="mt-[30px] flex flex-col gap-4 sm:flex-row sm:gap-5">
          <a
            href="/api/auth/login"
            className="flex h-[56px] w-full items-center justify-center rounded-[13px] bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-[321px]"
          >
            Get personalized results
          </a>
          <Link
            to="/home"
            className="flex h-[56px] w-full items-center justify-center rounded-[13px] bg-brand-buttongray font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3] sm:w-[260px]"
          >
            Continue as guest
          </Link>
        </div>

        <div className="relative mt-[85px] min-h-0 flex-1">
          <img
            src="/launch-page-preview.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-[1.08] rounded-[18px] object-cover object-top opacity-[0.22] blur-[66px] grayscale"
          />
          <div className="relative h-full overflow-hidden rounded-[18px] bg-white shadow-[0_-18.5px_81px_rgba(6,50,47,0.05),0_-73.5px_147px_rgba(6,50,47,0.04)]">
            <img
              src="/launch-page-preview.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
