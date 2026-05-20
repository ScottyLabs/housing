import "./globals.css";
import { BuildingProvider } from "@/components/BuildingContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="antialiased min-h-screen flex flex-col bg-white">
            <div className="border-b-2 border-gray-200">
                <Navbar />
            </div>
            <div>
                <BuildingProvider>
                    <main className="flex-1 overflow-hidden">{children}</main>
                </BuildingProvider>
            </div>
        </div>
    );
}
