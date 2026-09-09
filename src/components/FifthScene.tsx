export default function FifthScene() {
  return (
    <section
      id="scene-5"
      className="relative h-dvh min-h-[100svh] w-full shrink-0 overflow-hidden"
    >
      <img
        src="/scene-5-bg.webp"
        alt=""
        className="h-full w-full object-cover"
      />

      <div className="absolute left-1/2 top-24 z-10 w-[86%] max-w-[360px] -translate-x-1/2 text-center">
        <img
          src="/fifth-scene-dua.webp"
          alt="Dua"
          className="mx-auto w-4/5"
        />
        <p className="mt-4 font-sans text-[12px] font-medium leading-relaxed tracking-[0.04em] text-black max-w-[90%] mx-auto">
          May Allah bless them, and shower His blessings upon them, and join them
          together in goodness.
        </p>
      </div>
    </section>
  );
}
