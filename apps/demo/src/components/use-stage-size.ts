"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures an element's rendered size and keeps it in sync across resizes /
 * layout shifts (breakpoint changes, font loads, etc). Thought trails are
 * authored in percent-of-stage coordinates, so they need this to convert to
 * absolute px at render time — same stage the QuoteCards absolutely-position
 * against.
 */
export function useStageSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}
