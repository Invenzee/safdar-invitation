"use client";

import { ChevronDown } from "lucide-react";
import { useRef, useState, type SyntheticEvent } from "react";

const VIDEO_SRC = "/first-scene.mp4";
const POSTER_SRC = "/first-scene-poster.webp";
const PLAYBACK_RATE = 1.2;

export default function FirstScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const setPlaybackRate = (video: HTMLVideoElement) => {
    if (video.playbackRate !== PLAYBACK_RATE) {
      video.playbackRate = PLAYBACK_RATE;
    }
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    setPlaybackRate(video);
    if (video.currentTime === 0) {
      video.currentTime = 0.001;
    }
  };

  const handleTap = async () => {
    const video = videoRef.current;
    if (!video || !video.paused || hasEnded) return;

    video.muted = true;
    setPlaybackRate(video);

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      // Ignore play() rejections from browser autoplay policies.
    }
  };

  return (
    <section
      className="relative h-dvh min-h-[100svh] w-full overflow-hidden bg-black"
      onClick={handleTap}
    >
      <img
        src={POSTER_SRC}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={(event) => setPlaybackRate(event.currentTarget)}
        onRateChange={(event) => setPlaybackRate(event.currentTarget)}
        onEnded={() => setHasEnded(true)}
      />

      {hasEnded ? (
        <div className="pointer-events-none absolute left-1/2 top-[38%] z-10 w-[34%] -translate-x-1/2 -translate-y-1/2">
          <img
            src="/bismillah-yellow.webp"
            alt="Bismillah"
            className="animate-emblem-in w-full"
          />
        </div>
      ) : null}

      {hasEnded ? (
        <div className="pointer-events-none absolute bottom-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))] left-1/2 z-10 w-full -translate-x-1/2">
          <p className="relative mx-auto flex w-[180px] items-center justify-center gap-2 rounded-full border-2 border-heading bg-[#fff6ea]/85 px-5 py-2.5 text-center font-sans text-xs font-medium tracking-[0.28em] text-black shadow-[0_2px_12px_rgba(74,44,20,0.2)] backdrop-blur-[2px]">
            Scroll Down
            <ChevronDown className="animate-arrow-y size-4 shrink-0 text-heading" strokeWidth={2.25} />
          </p>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute bottom-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))] left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="animate-tap-grow relative flex items-center gap-2 rounded-full border-2 border-heading bg-[#fff6ea]/85 px-5 py-2.5 text-center font-sans text-xs font-medium tracking-[0.28em] text-black shadow-[0_2px_12px_rgba(74,44,20,0.2)] backdrop-blur-[2px]">
          Tap to Open
        </p>
      </div>
    </section>
  );
}
