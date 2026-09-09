"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FirstScene from "@/components/FirstScene";
import SecondScene from "@/components/SecondScene";
import ThirdScene from "@/components/ThirdScene";
import FourthScene from "@/components/FourthScene";
import FifthScene from "@/components/FifthScene";

const SCENE_COUNT = 5;
const SCROLL_MS = 820;

function SceneDivider({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none relative z-40 h-0 w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src="/divider.webp"
        alt=""
        className="absolute left-1/2 top-0 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function animateScroll(element: HTMLElement, to: number, duration: number, onDone: () => void) {
  const start = element.scrollTop;
  const change = to - start;
  if (Math.abs(change) < 1) {
    onDone();
    return;
  }

  const startTime = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    element.scrollTop = start + change * easeOutCubic(progress);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onDone();
    }
  };

  requestAnimationFrame(tick);
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const scrollerRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sceneIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const touchStartYRef = useRef(0);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.muted = false;
    void audio.play().catch(() => {
      // Autoplay can still be blocked; the next tap/swipe retries.
    });
  }, []);

  useEffect(() => {
    const retryMusic = () => startMusic();
    document.addEventListener("pointerdown", retryMusic);
    document.addEventListener("touchstart", retryMusic);
    document.addEventListener("keydown", retryMusic);
    return () => {
      document.removeEventListener("pointerdown", retryMusic);
      document.removeEventListener("touchstart", retryMusic);
      document.removeEventListener("keydown", retryMusic);
    };
  }, [startMusic]);

  const goToScene = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller || animatingRef.current) return;

    const next = Math.max(0, Math.min(SCENE_COUNT - 1, index));
    const target = next * scroller.clientHeight;
    if (Math.abs(scroller.scrollTop - target) < 2) {
      sceneIndexRef.current = next;
      return;
    }

    animatingRef.current = true;
    sceneIndexRef.current = next;
    animateScroll(scroller, target, SCROLL_MS, () => {
      animatingRef.current = false;
    });
  }, []);

  const goToNextIfOn = useCallback(
    (fromIndex: number) => {
      if (sceneIndexRef.current === fromIndex) {
        goToScene(fromIndex + 1);
      }
    },
    [goToScene],
  );

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

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !unlocked) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (animatingRef.current || Math.abs(event.deltaY) < 10) return;
      goToScene(sceneIndexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (animatingRef.current) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      if (Math.abs(delta) < 36) return;
      goToScene(sceneIndexRef.current + (delta > 0 ? 1 : -1));
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
    };
  }, [goToScene, unlocked]);

  return (
    <main
      ref={scrollerRef}
      className={`invitation-scroll no-scrollbar h-dvh w-full overflow-x-hidden overscroll-none bg-black ${
        unlocked ? "overflow-y-auto" : "overflow-y-hidden"
      }`}
    >
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        loop
        preload="auto"
        playsInline
      />
      <FirstScene
        onUnlocked={() => setUnlocked(true)}
        onScrollToNext={() => goToNextIfOn(0)}
        onOpen={startMusic}
      />
      <SceneDivider visible={unlocked} />
      <SecondScene onComplete={() => goToNextIfOn(1)} />
      <SceneDivider visible={unlocked} />
      <ThirdScene onComplete={() => goToNextIfOn(2)} />
      <SceneDivider visible={unlocked} />
      <FourthScene onComplete={() => goToNextIfOn(3)} />
      <SceneDivider visible={unlocked} />
      <FifthScene />
    </main>
  );
}
