"use client";

import { Heart } from "lucide-react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const HIGHLIGHT_DAY = 11;

function octoberCells() {
  const firstWeekday = new Date(2026, 9, 1).getDay();
  const cells: Array<number | null> = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= 31; day += 1) {
    cells.push(day);
  }
  return cells;
}

export default function ThirdScene() {
  const cells = octoberCells();

  return (
    <section
      id="scene-3"
      className="relative flex h-dvh min-h-[100svh] w-full shrink-0 snap-start items-center justify-center overflow-hidden px-6"
    >
      <img
        src="/scene-3-bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex w-full max-w-[320px] flex-col items-center text-center">
        <p className="font-sans text-[16px] font-bold uppercase tracking-[0.22em] text-black">
          On Sunday
        </p>
        <h2 className="mt-2 font-heading text-[34px] leading-tight text-black">
          11th October 2026
        </h2>

        <div className="mt-8 w-full rounded-2xl bg-[#fff8ee]/70 px-4 py-5 shadow-[0_8px_30px_rgba(74,44,20,0.12)] backdrop-blur-[2px]">
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-black">
            October
          </p>

          <div className="grid grid-cols-7 items-center gap-y-2">
            {WEEKDAYS.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="font-sans text-[10px] font-medium tracking-[0.12em] text-black/55"
              >
                {day}
              </span>
            ))}

            {cells.map((day, index) =>
              day === HIGHLIGHT_DAY ? (
                <span
                  key={`cell-${index}`}
                  className="animate-heartbeat relative flex h-9 items-center justify-center"
                >
                  <Heart
                    className="absolute size-9 fill-heading text-heading"
                    strokeWidth={1.5}
                  />
                  <span className="relative z-10 font-sans text-[10px] font-bold text-white">
                    11
                  </span>
                </span>
              ) : (
                <span
                  key={`cell-${index}`}
                  className="flex h-8 items-center justify-center font-sans text-[12px] text-black"
                >
                  {day ?? ""}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
