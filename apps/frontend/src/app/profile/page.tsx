import { useEffect, useState } from "react";
import client from "@/api/client";

export default function ProfilePage() {
  const [status, setStatus] = useState<"loading" | "loggedIn" | "loggedOut">("loading");

  useEffect(() => {
    client
      .GET("/api/me")
      .then(({ response }) => setStatus(response.ok ? "loggedIn" : "loggedOut"))
      .catch(() => setStatus("loggedOut"));
  }, []);

  return (
    <div className="flex md:h-full px-4 sm:px-20 md:px-30 lg:px-40 justify-left mt-[26px]">
      <div className="flex flex-col md:h-full w-full">
        <h1 className="font-bold text-[24px] md:text-[32px] py-3 flex-shrink-0 align-left">
          Profile
        </h1>
        {status === "loggedIn" && "Coming soon!"}
        {status === "loggedOut" && (
          <p>
            You're not logged in.{" "}
            <a href="/api/auth/login" className="font-medium text-brand-primary underline">
              Log in
            </a>{" "}
            to see your profile.
          </p>
        )}
      </div>
    </div>
  );
}