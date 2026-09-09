"use client";

import { useEffect, useRef } from "react";

export function useAdvanceWhenVisible(delay: number, onComplete: () => void) {
  const ref = useRef<HTMLElement>(null);
  const firedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firedRef.current) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          timer = window.setTimeout(() => {
            if (firedRef.current) return;
            firedRef.current = true;
            onCompleteRef.current();
          }, delay);
        } else if (timer) {
          window.clearTimeout(timer);
          timer = undefined;
        }
      },
      { root: node.closest("main"), threshold: [0.4, 0.55, 0.7] },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [delay]);

  return ref;
}
