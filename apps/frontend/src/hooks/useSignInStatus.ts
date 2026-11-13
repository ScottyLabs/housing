import { useEffect, useState } from "react";
import client from "@/api/client";

export type SignInStatus = "loading" | "signed-in" | "signed-out";

/** Asks the backend whether there is a signed-in session. */
export default function useSignInStatus(): [SignInStatus, (status: SignInStatus) => void] {
  const [status, setStatus] = useState<SignInStatus>("loading");

  useEffect(() => {
    let active = true;
    client.GET("/api/me").then(
      ({ response }) => {
        if (active) setStatus(response.ok ? "signed-in" : "signed-out");
      },
      () => {
        if (active) setStatus("signed-out");
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return [status, setStatus];
}

/** The sign-in URL that brings the user back to `path` afterwards. */
export function signInUrl(path: string): string {
  return `/api/auth/login?next=${encodeURIComponent(path)}`;
}
