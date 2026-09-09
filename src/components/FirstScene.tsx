"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";

const VIDEO_SRC = "/first-scene.mp4";
const POSTER_SRC = "/first-scene-poster.webp";
const END_FRAME_SRC = "/first-scene-end.webp";
const PLAYBACK_RATE = 2;
const END_EPSILON = 0.35;
const AUTO_OPEN_MS = 2000;
const AUTO_SCROLL_AFTER_END_MS = 2200;

export default function FirstScene({
  onUnlocked,
  onScrollToNext,
  onOpen,
}: {
  onUnlocked: () => void;
  onScrollToNext: () => void;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEndedRef = useRef(false);
  const openedRef = useRef(false);
  const onUnlockedRef = useRef(onUnlocked);
  const onOpenRef = useRef(onOpen);
  const onScrollToNextRef = useRef(onScrollToNext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  onUnlockedRef.current = onUnlocked;
  onOpenRef.current = onOpen;
  onScrollToNextRef.current = onScrollToNext;

  const setPlaybackRate = (video: HTMLVideoElement) => {
    if (video.playbackRate !== PLAYBACK_RATE) {
      video.playbackRate = PLAYBACK_RATE;
    }
  };

  const markEnded = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    setHasEnded(true);
    onUnlockedRef.current();
    window.setTimeout(() => {
      onScrollToNextRef.current();
    }, AUTO_SCROLL_AFTER_END_MS);
  }, []);

  const isNearEnd = (video: HTMLVideoElement) => {
    return (
      video.ended ||
      (Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >= video.duration - END_EPSILON)
    );
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    setPlaybackRate(video);
    if (video.currentTime === 0) {
      video.currentTime = 0.001;
    }
  };

  const openInvitation = useCallback(async () => {
    const video = videoRef.current;
    if (!video || openedRef.current || hasEndedRef.current) return;
    openedRef.current = true;

    video.muted = true;
    setPlaybackRate(video);
    onOpenRef.current();

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      openedRef.current = false;
    }
  }, []);

  const handleTap = () => {
    void openInvitation();
  };

  useEffect(() => {
    let cancelled = false;

    const waitUntilReady = async () => {
      await document.fonts.ready;

      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }

      const poster = new Image();
      poster.src = POSTER_SRC;
      await poster.decode().catch(() => undefined);

      const video = videoRef.current;
      if (video && video.readyState < 2) {
        await new Promise<void>((resolve) => {
          const finish = () => resolve();
          video.addEventListener("loadeddata", finish, { once: true });
          window.setTimeout(finish, 8000);
        });
      }

      if (!cancelled) setIsLoaded(true);
    };

    void waitUntilReady();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || openedRef.current || hasEndedRef.current) return;

    const id = window.setTimeout(() => {
      void openInvitation();
    }, AUTO_OPEN_MS);

    return () => window.clearTimeout(id);
  }, [isLoaded, openInvitation]);

  useEffect(() => {
    if (!isPlaying || hasEnded) return;

    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (video && isNearEnd(video)) {
        markEnded();
      }
    }, 80);

    return () => window.clearInterval(id);
  }, [hasEnded, isPlaying, markEnded]);

  return (
    <section
      className="relative h-dvh min-h-[100svh] w-full shrink-0 snap-start overflow-hidden bg-black"
      onClick={handleTap}
    >
      <img
        src={POSTER_SRC}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <img
        src={END_FRAME_SRC}
        alt=""
        className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover ${
          hasEnded ? "opacity-100" : "opacity-0"
        }`}
      />

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
          hasEnded ? "hidden" : isPlaying ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        webkit-playsinline="true"
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={(event) => setPlaybackRate(event.currentTarget)}
        onTimeUpdate={(event) => {
          if (isNearEnd(event.currentTarget)) markEnded();
        }}
        onPause={(event) => {
          if (isNearEnd(event.currentTarget)) markEnded();
        }}
        onEnded={markEnded}
      />

      <h1
        className={`pointer-events-none absolute left-1/2 top-[23%] z-20 w-max max-w-[86%] -translate-x-1/2 border-2 border-heading bg-white px-[3px] py-[3px] text-center transition-opacity duration-500 ${
          isPlaying || hasEnded ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="block border border-heading px-4 py-1.5 font-heading text-[30px] leading-none text-black ">
          Valima Invitation
        </span>
      </h1>

      {hasEnded ? (
        <div className="pointer-events-none absolute left-1/2 top-[39%] z-30 w-[34%] -translate-x-1/2 -translate-y-1/2 transform-gpu">
          <img
            src="/bismillah-yellow.webp"
            alt="Bismillah"
            className="animate-emblem-in w-full"
          />
        </div>
      ) : null}

      {hasEnded ? (
        <div className="absolute bottom-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))] left-1/2 z-50 w-full -translate-x-1/2 transform-gpu">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onScrollToNext();
            }}
            className="relative mx-auto flex w-[180px] items-center justify-center gap-2 rounded-full border-2 border-heading bg-[#fff6ea]/85 px-5 py-2.5 text-center font-sans text-xs font-medium tracking-[0.28em] text-black shadow-[0_2px_12px_rgba(74,44,20,0.2)] backdrop-blur-[2px]"
          >
            Scroll Down
            <ChevronDown className="animate-arrow-y size-4 shrink-0 text-heading" strokeWidth={2.25} />
          </button>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute bottom-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))] left-1/2 z-30 -translate-x-1/2 transition-opacity duration-500 ${
          isPlaying || hasEnded ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="animate-tap-grow relative flex items-center gap-2 rounded-full border-2 border-heading bg-[#fff6ea]/85 px-5 py-2.5 text-center font-sans text-xs font-medium tracking-[0.28em] text-black shadow-[0_2px_12px_rgba(74,44,20,0.2)] backdrop-blur-[2px]">
          Tap to Open
        </p>
      </div>
    </section>
  );
}
