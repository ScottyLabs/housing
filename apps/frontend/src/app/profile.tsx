import useSWR, { preload } from "swr";

type User = {
  name?: string;
  andrewId?: string;
};

type FetchError = Error & {
  status: number;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if ("name" in value) {
    const name = value.name;
    if (typeof name !== "string") return false;
  }

  if ("andrewId" in value) {
    const andrewId = value.andrewId;
    if (typeof andrewId !== "string") return false;
  }

  return true;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error("Request failed") as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  const json: unknown = await res.json();

  if (!isUser(json)) {
    throw new Error("Invalid response");
  }

  return json;
};

void preload("/api/me", fetcher);

export default function Profile() {
  const { data, error, isLoading } = useSWR<User, FetchError>("/api/me", fetcher, {
    shouldRetryOnError: false,
  });
  console.log(data);
  console.log(error);
  //TODO: add edit survey responce button
  return (
    <div className="flex h-full justify-left mt-8 px-24">
      <div className="flex flex-col px-0 overflow-hidden">
        <h1 className="font-bold text-[32px] py-3 flex-shrink-0">Profile</h1>
        <div className="overflow-y-auto">
          {isLoading && <p>loading...</p>}

          {error && (
            <div>
              <div className="py-3">Failed to load profile. Try signing in or reloading</div>
              <a
                href="/api/auth/login"
                className="flex h-[56px] w-full items-center justify-center rounded-[13px] bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-[321px]"
              >
                Sign in
              </a>
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-2">
              <p>Name: {data.name} </p>
              <p>Andrew ID: {data.andrewId}</p>
              <a
                href="/api/auth/logout"
                className="flex h-[56px] w-full items-center justify-center rounded-[13px] bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-[321px]"
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
