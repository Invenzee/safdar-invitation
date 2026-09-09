"use client";

import { CalendarDays, Clock, MapPin, Phone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAdvanceWhenVisible } from "@/hooks/useAdvanceWhenVisible";

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-center gap-1.5">
      <Icon className="size-3.5 text-heading" strokeWidth={2} />
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-black">
        {label}
      </p>
    </div>
  );
}

export default function FourthScene({ onComplete }: { onComplete: () => void }) {
  const sectionRef = useAdvanceWhenVisible(5000, onComplete);

  return (
    <section
      ref={sectionRef}
      id="scene-4"
      className="relative flex h-dvh min-h-[100svh] w-full shrink-0 items-center justify-center overflow-hidden px-5 pt-20 pb-5"
    >
      <img
        src="/scene-4-bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex max-h-full w-full max-w-[340px] flex-col items-center text-center mb-8">
        <div className="w-full rounded-2xl bg-[#fff8ee]/72 px-4 py-3.5 shadow-[0_8px_30px_rgba(74,44,20,0.12)] backdrop-blur-[2px]">
          <SectionLabel icon={CalendarDays} label="On Sunday" />
          <h2 className="font-heading text-[23px] leading-tight text-black">
            11th October 2026
          </h2>

          <div className="my-2.5 h-px w-full bg-heading/35" />

          <SectionLabel icon={MapPin} label="Venue" />
          <h3 className="font-heading text-[23px] leading-tight text-black">
            Shayan Banquet
          </h3>
          <p className="mt-1 font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.12em] text-black">
            Near Baloch Colony Bridge,
            <br />
            Mehmoodabad No. 6, Karachi
          </p>

          <div className="my-2.5 h-px w-full bg-heading/35" />

          <SectionLabel icon={Clock} label="Program" />
          <div className="mt-1 grid grid-cols-2 gap-3">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                Gathering
              </p>
              <p className="mt-0.5 font-sans text-[13px] font-semibold text-black">
                12:00 pm
              </p>
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                Lunch
              </p>
              <p className="mt-0.5 font-sans text-[13px] font-semibold text-black">
                1:00 p.m
              </p>
            </div>
          </div>

          <div className="my-2.5 h-px w-full bg-heading/35" />

          <SectionLabel icon={Users} label="R.S.V.P." />
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-sans text-[10px] font-medium leading-snug text-black">
            <p>Mr. &amp; Mrs. Yousuf Khan</p>
            <p>Mr. &amp; Mrs. Behram Khan</p>
            <p>Mr. &amp; Mrs. Mohsin Khan</p>
            <p>Mr. &amp; Mrs. Usman Ali Khan</p>
            <p>Mr. &amp; Mrs. Jibran Ali Khan</p>
            <p>Mr. Zaid Khan</p>
            <p className="col-span-2 pt-0.5 font-semibold">&amp; All Family Members</p>
          </div>

          <div className="my-2.5 h-px w-full bg-heading/35" />

          <SectionLabel icon={Phone} label="Contact" />
          <div className="flex items-center justify-center gap-3 font-sans text-[13px] font-semibold tracking-wide text-black">
            <a href="tel:03183453356">0318-3453356</a>
            <span className="h-3 w-px bg-heading/50" />
            <a href="tel:03002338446">0300-2338446</a>
          </div>
        </div>
      </div>
    </section>
  );
}
