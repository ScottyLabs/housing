import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";
const MIN_SCALE = 0.45;

export default function useFitToViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const applied = el.style.zoom;
    el.style.zoom = "";
    const { top, height } = el.getBoundingClientRect();
    const available = window.innerHeight - (top + window.scrollY) - 1;
    const fits = !window.matchMedia(DESKTOP_QUERY).matches || height <= available;

    if (fits) {
      el.style.zoom = applied;
      setScale(1);
      return;
    }

    let next = Math.max(MIN_SCALE, available / height);
    el.style.zoom = String(next);
    const actual = el.getBoundingClientRect().height;

    if (actual > available) next = Math.max(MIN_SCALE, (next * available) / actual);
    el.style.zoom = applied;
    setScale(next);
  }, []);

  useLayoutEffect(() => {
    fit();
  }, [fit]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    // Web fonts change text height once they load.
    void document.fonts.ready.then(fit);
    return () => {
      window.removeEventListener("resize", fit);
    };
  }, [fit]);

  return { ref, scale };
}
