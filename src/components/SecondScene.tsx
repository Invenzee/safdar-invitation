"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BODY_CLASS =
  "font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-black";
const HEADING_CLASS = "font-heading leading-tight text-black";
const TYPE_MS = 14;
const HEADING_MS = 700;

type Block =
  | { kind: "body"; text: string; className: string }
  | { kind: "heading"; text: string; className: string; as: "h2" | "h3" };

const BLOCKS: Block[] = [
  {
    kind: "body",
    text: "In the name of Allah the most beneficent\n& the most merciful",
    className: `${BODY_CLASS} tracking-[0.22em]`,
  },
  {
    kind: "heading",
    text: "Mr. & Mrs. Ibn-e-Ali",
    as: "h2",
    className: `mt-2 text-[36px] ${HEADING_CLASS}`,
  },
  {
    kind: "body",
    text: "Request the honour of your presence\n& blessing at the",
    className: `mt-2 ${BODY_CLASS} tracking-[0.18em]`,
  },
  {
    kind: "heading",
    text: "Valima Reception",
    as: "h3",
    className: `mt-2 text-[26px] ${HEADING_CLASS}`,
  },
  {
    kind: "body",
    text: "Of their beloved son",
    className: `mt-2 ${BODY_CLASS}`,
  },
  {
    kind: "heading",
    text: "Safdar Ali Khan",
    as: "h3",
    className: `mt-2 text-[36px] ${HEADING_CLASS}`,
  },
  {
    kind: "body",
    text: "With",
    className: `mt-2 ${BODY_CLASS} tracking-[0.28em]`,
  },
  {
    kind: "heading",
    text: "Daughter of",
    as: "h3",
    className: `mt-2 text-[36px] ${HEADING_CLASS}`,
  },
  {
    kind: "body",
    text: "Sarwar Khan",
    className: "mt-2 font-sans text-[14px] font-semibold uppercase tracking-[0.22em] text-black",
  },
];

function TypedBody({
  text,
  className,
  active,
  complete,
  onDone,
}: {
  text: string;
  className: string;
  active: boolean;
  complete: boolean;
  onDone: () => void;
}) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || complete) return;
    doneRef.current = false;
    setCount(0);

    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= text.length && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(id);
        onDone();
      }
    }, TYPE_MS);

    return () => window.clearInterval(id);
  }, [active, complete, onDone, text]);

  const shown = complete ? text : active ? text.slice(0, count) : "";

  return (
    <div className="relative w-full">
      <p className={`${className} invisible whitespace-pre-line`} aria-hidden>
        {text}
      </p>
      <p className={`absolute inset-0 whitespace-pre-line ${className}`}>
        {shown}
        {active && !complete ? (
          <span className="ml-0.5 inline-block w-[0.45em] animate-pulse bg-black align-baseline">
            &nbsp;
          </span>
        ) : null}
      </p>
    </div>
  );
}

function AnimatedHeading({
  text,
  className,
  as,
  active,
  complete,
  onDone,
}: {
  text: string;
  className: string;
  as: "h2" | "h3";
  active: boolean;
  complete: boolean;
  onDone: () => void;
}) {
  const doneRef = useRef(false);
  const Tag = as;

  useEffect(() => {
    if (!active || complete) return;
    doneRef.current = false;
    const id = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, HEADING_MS);
    return () => window.clearTimeout(id);
  }, [active, complete, onDone]);

  return (
    <Tag
      className={`${className} ${
        active || complete ? "animate-heading-in" : "opacity-0 translate-y-4"
      }`}
    >
      {text}
    </Tag>
  );
}

export default function SecondScene({ onComplete }: { onComplete: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  const advance = useCallback(() => {
    setStep((current) => Math.min(current + 1, BLOCKS.length));
  }, []);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          setInView(true);
        }
      },
      { root: node.closest("main"), threshold: [0.35, 0.5, 0.7] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (step < BLOCKS.length) return;

    const id = window.setTimeout(() => {
      onCompleteRef.current();
    }, 1600);

    return () => window.clearTimeout(id);
  }, [step]);

  return (
    <section
      ref={sectionRef}
      id="scene-2"
      className="relative flex h-dvh min-h-[100svh] w-full shrink-0 snap-start items-center justify-center overflow-hidden px-6"
    >
      <img
        src="/scene-2-bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex max-w-[360px] flex-col items-center text-center">
        {BLOCKS.map((block, index) => {
          const active = inView && step === index;
          const complete = step > index;

          if (block.kind === "body") {
            return (
              <TypedBody
                key={block.text}
                text={block.text}
                className={block.className}
                active={active}
                complete={complete}
                onDone={advance}
              />
            );
          }

          return (
            <AnimatedHeading
              key={block.text}
              text={block.text}
              className={block.className}
              as={block.as}
              active={active}
              complete={complete}
              onDone={advance}
            />
          );
        })}
      </div>
    </section>
  );
}
