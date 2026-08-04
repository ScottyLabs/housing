type User = {
  name?: string;
  andrewId?: string;
};

export default function Profile() {
  const isLoading = false;
  const error = false;
  const data: User = { name: "Nikhil", andrewId: "nramanuj" };

  //TODO: add edit survey responce button
  return (
    <div className="flex justify-center sm:justify-left mt-8 px-12 sm:px-24">
      <div className="w-full h-full pb-4 px-4 rounded-2xl bg-brand-menugray border border-black/10">
        <h1 className="font-bold text-[32px] py-3 shrink-0">Profile</h1>
        <div className="overflow-y-auto text-[18px]">
          {isLoading && <p>loading...</p>}

          {error && (
            <div>
              <div className="py-3">Failed to load profile. Try signing in or reloading</div>
              <a
                href="/api/auth/login"
                className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
              >
                Sign in
              </a>
            </div>
          )}

          {data !== null && (
            <div className="flex flex-col gap-2">
              <p>Name: {data.name} </p>
              <p>Andrew ID: {data.andrewId}</p>
              <a
                href="/survey"
                className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
              >
                Edit Survey Responces
              </a>
              <a
                href="/api/auth/logout"
                className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
