"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useAudio } from "@/hooks/use-audio";
import { formatRadioTime } from "@/utils/plaza-radio";

export const RadioNowPlaying = () => {
  const {
    ambientActive,
    nowPlaying,
    nowPlayingPosition,
    radioPlaying,
    toggleRadio,
  } = useAudio();

  if (!ambientActive || !nowPlaying) return null;

  const elapsed = nowPlayingPosition;
  const total = nowPlaying.length;
  const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
  const trackLabel = `${nowPlaying.title} — ${nowPlaying.artist}`;
  const isLong = trackLabel.length > 42;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-background/92 backdrop-blur-md"
      data-cy="radio-now-playing"
    >
      {/* Progress bar */}
      <div className="h-px bg-foreground/8" aria-hidden>
        <div
          className="h-full bg-foreground/40 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Player row */}
      <div className="mx-auto flex h-10 max-w-3xl items-center gap-2.5 px-3">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={toggleRadio}
          aria-label={radioPlaying ? "Pause radio" : "Play radio"}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-sm text-foreground/50 hover:text-foreground/90 hover:bg-foreground/6 transition-colors"
        >
          {radioPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </button>

        {/* Artwork */}
        {nowPlaying.artworkUrl ? (
          <Image
            src={nowPlaying.artworkUrl}
            alt=""
            width={22}
            height={22}
            unoptimized
            className="size-[22px] shrink-0 object-cover opacity-75"
          />
        ) : (
          <div className="size-[22px] shrink-0 bg-foreground/10" />
        )}

        {/* Track info — scrolls when long */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {isLong ? (
            <div className="overflow-hidden">
              <span className="radio-marquee inline-flex gap-12 whitespace-nowrap text-[0.62rem] leading-none tracking-tight">
                <span>
                  <span className="text-foreground/90">{nowPlaying.title}</span>
                  <span className="text-foreground/35"> — </span>
                  <span className="text-foreground/55">
                    {nowPlaying.artist}
                  </span>
                </span>
                {/* Duplicate for seamless loop */}
                <span aria-hidden>
                  <span className="text-foreground/90">{nowPlaying.title}</span>
                  <span className="text-foreground/35"> — </span>
                  <span className="text-foreground/55">
                    {nowPlaying.artist}
                  </span>
                </span>
              </span>
            </div>
          ) : (
            <p className="truncate text-[0.62rem] leading-none tracking-tight">
              <span className="text-foreground/90">{nowPlaying.title}</span>
              <span className="text-foreground/35"> — </span>
              <span className="text-foreground/55">{nowPlaying.artist}</span>
            </p>
          )}
        </div>

        {/* Time display: elapsed / total */}
        <div className="shrink-0 flex items-center gap-1 font-mono tabular-nums select-none">
          <span className="text-foreground/70 text-[0.6rem]">
            {formatRadioTime(elapsed)}
          </span>
          <span className="text-foreground/20 text-[0.5rem]">/</span>
          <span className="text-foreground/40 text-[0.6rem]">
            {formatRadioTime(total)}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes radio-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .radio-marquee {
          animation: radio-marquee 14s linear infinite;
        }
      `}</style>
    </div>
  );
};
