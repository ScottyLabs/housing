import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import BuildingComparison from "@/app/building-comparison/page";
import BuildingOptions from "@/app/building-options/page";
import LaunchPage from "@/app/launch-page/page";
import MapPage from "@/app/map-page";
import NotFound from "@/app/not-found";
import Home from "@/app/page";
import { BuildingProvider } from "@/components/BuildingContext";
import Navbar from "@/components/Navbar";
import BuildingDetails from "./components/BuildingDetails";

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

export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scroll({ top: 0 });
  }, [location.pathname]);
  return (
    <AppLayout showNavbar={location.pathname !== "/"}>
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LaunchPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/building-options" element={<BuildingOptions />} />
          <Route path="/building-comparison" element={<BuildingComparison />} />
          <Route path="/building/:id" element={<BuildingDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AppLayout>
  );
}
