import { useEffect, useState } from "react";
import client from "@/api/client";

export interface CurrentUser {
  name: string;
  andrewId: string;
}

/** The signed-in user, or undefined while loading and when nobody is signed in. */
export default function useCurrentUser(): CurrentUser | undefined {
  const [user, setUser] = useState<CurrentUser>();

  useEffect(() => {
    let active = true;
    client.GET("/api/me").then(
      ({ data }) => {
        if (active && data !== undefined) setUser({ name: data.name, andrewId: data.andrewId });
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);

  return user;
}
