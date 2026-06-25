import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;

function useFrameScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        function updateScale() {
            setScale(Math.min(window.innerWidth / FRAME_WIDTH, window.innerHeight / FRAME_HEIGHT));
        }

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return scale;
}

export default function LaunchPage() {
    const scale = useFrameScale();

    return (
        <div className="h-screen overflow-hidden bg-white">
            <div
                className="relative h-[1080px] w-[1920px]"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    marginLeft: `calc((100vw - ${FRAME_WIDTH * scale}px) / 2)`
                }}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.95)_100%)]" />
                <div className="absolute left-[258px] top-[126px] w-[1404px]">
                    <section className="relative z-10">
                        <img src="/launch-logo.png" alt="CMU Housing" className="h-[100px] w-[592px]" />
                        <p className="mt-[13px] inline-block w-[639px] origin-left scale-x-[0.965] whitespace-nowrap text-[18px] font-semibold leading-none tracking-normal">
                            Find the perfect dorm for you. Unaffiliated with Carnegie Mellon University
                        </p>

                        <div className="mt-[30px] flex gap-5">
                            <Link
                                to="/home"
                                className="flex h-[56px] w-[321px] items-center justify-center rounded-[13px] bg-brand-primary text-center text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c]">
                                Get personalized results
                            </Link>
                            <Link
                                to="/home"
                                className="flex h-[56px] w-[260px] items-center justify-center rounded-[13px] bg-brand-buttongray text-center font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3]">
                                Continue as guest
                            </Link>
                        </div>
                    </section>

                    <div className="relative mt-[85px] h-[1137px] rounded-[18px]">
                        <img
                            src="/launch-page-preview.png"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-[1.08] rounded-[18px] object-cover object-top opacity-[0.22] grayscale blur-[66px]"
                        />
                        <div className="relative h-full overflow-hidden rounded-[18px] bg-white shadow-[0_-18.5px_81px_rgba(6,50,47,0.05),0_-73.5px_147px_rgba(6,50,47,0.04)]">
                            <img
                                src="/launch-page-preview.png"
                                alt=""
                                aria-hidden="true"
                                className="h-full w-full object-cover object-top"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
