import React from "react";
import { useState } from "react";
export default function ShareDropdown({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [copiedName, setCopiedName] = useState<string | null>(null);
    const [showEmbed, setShowEmbed] = useState(false);
    if (!isOpen) return null;
    type socialMedia = {
        name: string;
        icon: string;
        action: () => void;
    };
    const options: socialMedia[] = [
        {
            name: "URL",
            icon: "/unsorted-icons/link.svg",
            action: async () => {
                await navigator.clipboard.writeText(globalThis.location.href);
                setCopiedName("URL");
                setTimeout(() => setCopiedName(null), 2000);
            }
        },
        {
            name: "SMS",
            icon: "/unsorted-icons/sms.svg",
            action: () => {
                globalThis.location.href = "sms:?&body=" + encodeURIComponent("Find your perfect dorm at " + globalThis.location.href);
            }
        },
        {
            name: "Email",
            icon: "/unsorted-icons/email.svg",
            action: () => {
                globalThis.location.href = "mailto:?subject=" + encodeURIComponent("Check this CMU Housing website out!") + "&body=" + encodeURIComponent("Find your perfect dorm at " + globalThis.location.href);
            }
        },
        {
            name: "Embed",
            icon: "/unsorted-icons/embed.svg",
            action: () => {
                setShowEmbed(true);
            }
        }
    ];
    return (
        <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl p-4 shadow-xl border border-black/10">
            {showEmbed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Embed</h2>
                            <button
                                type="button"
                                onClick={() => setShowEmbed(false)}
                                className="text-gray-500 hover:text-black text-xl cursor-pointer">
                                ×
                            </button>
                        </div>
                        <div className="w-full mt-2 h-28 p-2 text-xs border border-black/10 rounded-lg font-mono whitespace-normal">
                            {`<iframe src="${globalThis.location.href}" width="100%" height="600"></iframe>`}
                        </div>
                        <div className="flex justify-end mt-1">
                            <button
                                type="button"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(`<iframe src="${globalThis.location.href}" width="100%" height="600"></iframe>`);
                                    setCopiedName("Embed Code");
                                    setTimeout(() => setCopiedName(null), 2000);
                                }}
                                className="px-3 py-2 rounded-xl border border-black/10 text-sm hover:bg-gray-100 cursor-pointer">
                                {copiedName === "Embed Code" ? "Copied!" : "Copy embed code"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Share via</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:text-black text-lg leading-none cursor-pointer">
                    ×
                </button>
            </div>
            <div className="flex gap-1 pb-4">
                {options.map((option) => (
                    <button
                        key={option.name}
                        type="button"
                        onClick={option.action}
                        className="shrink-0 w-20 flex flex-col items-center px-4 py-3 rounded-xl border border-black/10 text-sm hover:bg-gray-100 cursor-pointer transition-colors">
                        <img src={option.icon} alt={"This is the logo for " + option.name} className="w-6 h-6"/>
                        {copiedName === option.name ? "Copied!" : option.name}
                    </button>
                ))}
            </div>
        </div>
    );
}