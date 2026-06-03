import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import BuildingOptions from "@/app/building-options/page";
import NotFound from "@/app/not-found";
import Home from "@/app/page";
import { BuildingProvider } from "@/components/BuildingContext";
import Navbar from "@/components/Navbar";
import BuildingDetails from "./components/BuildingDetails";

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" />
            </head>
            <body className="antialiased min-h-screen flex flex-col bg-white">
                <div className="border-b-2 border-gray-200">
                    <Navbar />
                </div>
                <div>
                    <BuildingProvider>
                        <main className="flex-1 overflow-hidden">{children}</main>
                    </BuildingProvider>
                </div>
            </body>
        </html>
    );
}

export default function App() {
    const location = useLocation();
    useEffect(() => {
        window.scroll({ top: 0 });
    }, []);
    return (
        <AppLayout>
            <div key={location.pathname}>
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/building-options" element={<BuildingOptions />} />
                    <Route path="/building/:id" element={<BuildingDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </AppLayout>
    );
}
