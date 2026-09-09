"use client";

import { useEffect, useState } from "react";
import FirstScene from "@/components/FirstScene";
import SecondScene from "@/components/SecondScene";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (unlocked) {
      html.classList.remove("scroll-locked");
      body.classList.remove("scroll-locked");
      return;
    }

    html.classList.add("scroll-locked");
    body.classList.add("scroll-locked");

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      html.classList.remove("scroll-locked");
      body.classList.remove("scroll-locked");
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [unlocked]);

  return (
    <main
      className={`no-scrollbar w-full overflow-x-hidden bg-black ${
        unlocked
          ? "h-dvh overflow-y-auto snap-y snap-mandatory overscroll-y-contain"
          : "h-dvh overflow-y-hidden overscroll-none"
      }`}
    >
      <FirstScene onUnlocked={() => setUnlocked(true)} />
      <div
        className={`pointer-events-none relative z-40 h-0 w-full transition-opacity duration-700 ${
          unlocked ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="/divider.webp"
          alt=""
          className="absolute left-1/2 top-0 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <SecondScene />
    </main>
  );
}
