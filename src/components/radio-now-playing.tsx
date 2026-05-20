"use client";

import Image from "next/image";
import Link from "next/link";
import { useAudio } from "@/hooks/use-audio";
import { formatRadioTime } from "@/utils/plaza-radio";

export const RadioNowPlaying = () => {
  const { ambientActive, nowPlaying, nowPlayingPosition, stopAudio } =
    useAudio();

  if (!ambientActive || !nowPlaying) return null;

  const progress =
    nowPlaying.length > 0
      ? Math.min(100, (nowPlayingPosition / nowPlaying.length) * 100)
      : 0;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-background/85 backdrop-blur-md"
      data-cy="radio-now-playing"
    >
      <div className="h-0.5 bg-foreground/10" aria-hidden>
        <div
          className="h-full bg-foreground/45 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex h-9 max-w-3xl items-center gap-2.5 px-3">
        {nowPlaying.artworkUrl ? (
          <Image
            src={nowPlaying.artworkUrl}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6 shrink-0 object-cover opacity-90"
          />
        ) : (
          <div className="size-6 shrink-0 bg-foreground/10" />
        )}
        <p className="min-w-0 flex-1 truncate text-foreground/80 text-[0.65rem] leading-none tracking-tight">
          <span className="text-foreground">{nowPlaying.title}</span>
          <span className="text-foreground/40"> — </span>
          <span>{nowPlaying.artist}</span>
        </p>
        <span className="shrink-0 text-foreground/45 text-[0.6rem] tabular-nums">
          {formatRadioTime(nowPlayingPosition)}
          {stopAudio ? " · off" : ""}
        </span>
        <Link
          href="https://plaza.one/"
          target="_blank"
          className="shrink-0 text-foreground/35 text-[0.55rem] uppercase tracking-widest hover:text-foreground/60"
        >
          plaza
        </Link>
      </div>
    </div>
  );
};
