"use client";

export const GameOver = () => (
  <>
    <div className="fixed inset-0 bg-[url('/images/static.gif')] bg-cover z-0" />
    <div className="flex flex-col items-center">
      <h1
        className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic leading-none tracking-tighter z-10"
        data-cy="title"
      >
        Game Over
      </h1>
    </div>
  </>
);
