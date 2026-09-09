"use client";

import { useRef, useState } from "react";

const VIDEO_SRC = "/first scene video.mp4";
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
      className="relative h-dvh w-full overflow-hidden bg-black"
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="pointer-events-none h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onLoadedMetadata={(event) => setPlaybackRate(event.currentTarget)}
        onPlay={(event) => setPlaybackRate(event.currentTarget)}
        onRateChange={(event) => setPlaybackRate(event.currentTarget)}
        onEnded={() => setHasEnded(true)}
      />

      {hasEnded ? (
        <img
          src="/bismillah-black.webp"
          alt="Bismillah"
          className="animate-emblem-in pointer-events-none absolute left-1/2 top-[23%] z-10 w-[34%] max-w-[180px] -translate-x-1/2 -translate-y-1/2 object-contain"
        />
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
