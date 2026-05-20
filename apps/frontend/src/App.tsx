import { Routes, Route } from "react-router-dom";
import { BuildingProvider } from "@/components/BuildingContext";
import Navbar from "@/components/Navbar";
import Home from "@/app/page";
import BuildingOptions from "@/app/building-options/page";
import NotFound from "@/app/not-found";

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
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/building-options" element={<BuildingOptions />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppLayout>
    );
}
