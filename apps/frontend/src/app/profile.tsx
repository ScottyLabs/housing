import { useEffect, useState } from "react";
import client from "../api/client.ts";

type User = {
  name: string;
  andrewId: string;
};
function LogIn() {
  return (
    <a
      href="/api/auth/login"
      className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
    >
      Sign in
    </a>
  );
}
function LogOut() {
  return (
    <a
      href="/api/auth/logout"
      className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
    >
      Sign out
    </a>
  );
}
export default function Profile() {
  const [userData, setUser] = useState<User>();
  const [errorMsg, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void client.GET("/api/me").then(({ data, error }) => {
      if (error) {
        setError("Failed to load. Please try signing in");
        setIsLoading(false);
        return;
      }
      if (data !== null) {
        setUser(data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="mt-8 px-12 sm:px-24">
      <div className="w-full h-full pb-4 px-4 rounded-2xl bg-brand-menugray border border-black/10">
        <h1 className="font-bold text-[32px] py-3 shrink-0">Profile</h1>
        <div className="overflow-y-auto text-[18px]">
          {isLoading && <p>loading...</p>}

          {errorMsg !== undefined && (
            <div>
              <div className="py-3">{errorMsg}</div>
              <LogIn />
            </div>
          )}
          {userData !== undefined && (
            <div className="flex flex-col gap-2">
              <p>Name: {userData.name} </p>
              <p>Andrew ID: {userData.andrewId}</p>
              <a
                href="/survey"
                className="flex h-14 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
              >
                Edit Survey Responses
              </a>
              <LogOut />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
