import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import client from "@/api/client";
import posthog, { isPostHogInitialized } from "@/posthog";
import BuildingComparison from "@/app/building-comparison/page";
import BuildingOptions from "@/app/building-options/page";
import LaunchPage from "@/app/launch-page/page";
import MapPage from "@/app/map-page";
import NotFound from "@/app/not-found";
import Home from "@/app/page";
import Survey from "@/app/survey/page";
import { BuildingProvider } from "@/components/BuildingContext";
import Navbar from "@/components/Navbar";
import BuildingDetails from "./components/BuildingDetails";
import ReviewsPage from "./app/reviews/page";

let identifiedUserId: string | undefined;

function PostHogUserIdentification() {
  useEffect(() => {
    const url = new URL(globalThis.location.href);
    if (url.searchParams.has("logged_out")) {
      if (isPostHogInitialized) posthog.reset();
      identifiedUserId = undefined;
      url.searchParams.delete("logged_out");
      globalThis.history.replaceState(null, "", url);
      return;
    }

    if (!isPostHogInitialized) return;

    void client.GET("/api/me").then(({ data }) => {
      if (!data) return;

      const userId = String(data.id);
      if (identifiedUserId === userId) return;

      identifiedUserId = userId;
      posthog.identify(userId, {
        name: data.name,
        andrew_id: data.andrewId,
      });
    });
  }, []);

  return null;
}

function AppLayout({ children, showNavbar }: { children: React.ReactNode; showNavbar: boolean }) {
  return (
    <div className="antialiased min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}
      <div>
        <BuildingProvider>
          <main className="flex-1 overflow-hidden pb-20 md:pb-0">{children}</main>
        </BuildingProvider>
      </div>
    </div>
  );
}

function ScrollToTop() {
  useEffect(() => {
    globalThis.scroll({ top: 0 });
  }, []);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <PostHogUserIdentification />
      <AppLayout showNavbar={location.pathname !== "/"}>
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<LaunchPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/building-options" element={<BuildingOptions />} />
            <Route path="/building-comparison" element={<BuildingComparison />} />
            <Route path="/building/:id" element={<BuildingDetails />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
        </div>
      </AppLayout>
    </>
  );
}
