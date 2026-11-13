import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import BuildingComparison from "@/app/building-comparison/page";
import BuildingReviewsPage from "@/app/building-reviews/page";
import BuildingCategoryPage from "@/app/building-options/BuildingCategoryPage";
import BuildingOptions from "@/app/building-options/page";
import LaunchPage from "@/app/launch-page/page";
import MapPage from "@/app/map-page";
import NotFound from "@/app/not-found";
import Home from "@/app/page";
import Survey from "@/app/survey/page";
import { BuildingProvider } from "@/components/BuildingContext";
import { FilterProvider } from "@/components/FilterContext";
import Navbar from "@/components/Navbar";
import BuildingDetails from "./components/BuildingDetails";
import ReviewsPage from "./app/reviews/page";
import WriteReviewPage from "./app/reviews/write/page";

function AppLayout({ children, showNavbar }: { children: React.ReactNode; showNavbar: boolean }) {
  return (
    <div className="antialiased min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}
      <div>
        <BuildingProvider>
          <FilterProvider>
            <main className="flex-1 overflow-hidden pb-20 md:pb-0">{children}</main>
          </FilterProvider>
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

// The review form used to live at /rating?building=<id>; keep those links working.
function OldRatingLink() {
  const [searchParams] = useSearchParams();
  const building = searchParams.get("building");
  const to =
    building === null || building === "" ? "/reviews" : `/reviews/${encodeURIComponent(building)}`;
  return <Navigate replace to={to} />;
}

export default function App() {
  const location = useLocation();
  return (
    <AppLayout showNavbar={location.pathname !== "/"}>
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LaunchPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/rating" element={<OldRatingLink />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/building-options" element={<BuildingOptions />} />
          <Route path="/building-options/:category" element={<BuildingCategoryPage />} />
          <Route path="/building-comparison" element={<BuildingComparison />} />
          <Route path="/building/:id" element={<BuildingDetails />} />
          <Route path="/building/:id/reviews" element={<BuildingReviewsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<WriteReviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
      </div>
    </AppLayout>
  );
}
