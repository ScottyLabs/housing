import { useEffect, useState } from "react";
import client from "../api/client.ts";
import { useSurveyData } from "../app/survey/page.tsx";

type User = {
  name: string;
  andrewId: string;
  createdTime: Record<string, never> | string | number;
};

function formatCreatedTime(createdTime: User["createdTime"]) {
  if (typeof createdTime === "string" || typeof createdTime === "number") {
    const parsedTime = new Date(createdTime);
    return Number.isNaN(parsedTime.getTime()) ? "Unknown" : parsedTime.toDateString();
  }

  return "Unknown";
}

function LogIn() {
  return (
    <a
      href="/api/auth/login"
      className="flex h-10 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
    >
      Sign in
    </a>
  );
}
function LogOut() {
  return (
    <a
      href="/api/auth/logout"
      className="flex h-10 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
    >
      Sign out
    </a>
  );
}
function ShowSurveyData() {
  const { data } = useSurveyData();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-semibold text-[20px] flex-shrink-0">Survey Info</h1>
      <p>Gender: {data.gender}</p>
      <p>Year: {data.year}</p>
      <p>Major: {data.major}</p>
      <p>Accomodations: {data.accommodations?.length ? data.accommodations.join(", ") : "None"}</p>
      <p>
        Preffered Amenities:{" "}
        {data.preferredAmenities?.length ? data.preferredAmenities.join(", ") : "None"}
      </p>
      <a
        href="/survey"
        className="flex h-10 w-full items-center justify-center rounded-[13px] bg-brand-primary font-medium text-white transition-colors hover:bg-[#f1872c] sm:w-80.25"
      >
        Edit Survey Responses
      </a>
    </div>
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
      <div className="w-full h-full pb-4 px-4">
        <h1 className="font-bold text-[32px] shrink-0">Profile</h1>
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
              <h1 className="font-semibold text-[20px] flex-shrink-0">Personal info</h1>
              <p>Name: {userData.name} </p>
              <p>Andrew ID: {userData.andrewId}</p>
              <p>Account created: {formatCreatedTime(userData.createdTime)}</p>
              <LogOut />
              <ShowSurveyData />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
