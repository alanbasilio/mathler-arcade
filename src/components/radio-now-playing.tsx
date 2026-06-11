"use client";

import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
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
    radioVolume,
    setRadioVolume,
  } = useAudio();

  if (!ambientActive || !nowPlaying) return null;

  const elapsed = nowPlayingPosition;
  const total = nowPlaying.length;
  const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
  const trackLabel = `${nowPlaying.title} — ${nowPlaying.artist}`;
  const isLong = trackLabel.length > 42;

  const VolumeIcon =
    radioVolume === 0 ? VolumeX : radioVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-foreground bg-background/92 backdrop-blur-md"
      data-cy="radio-now-playing"
    >
      {/* Progress bar */}
      <div className="h-0.5 bg-foreground/10" aria-hidden>
        <div
          className="h-full bg-neon-cyan transition-[width] duration-1000 ease-linear"
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
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-sm text-foreground/70 hover:text-foreground hover:bg-foreground/6 transition-colors"
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
              <span className="radio-marquee inline-flex gap-12 whitespace-nowrap text-xs leading-none tracking-tight">
                <span>
                  <span className="text-foreground">{nowPlaying.title}</span>
                  <span className="text-foreground/45"> — </span>
                  <span className="text-foreground/70">
                    {nowPlaying.artist}
                  </span>
                </span>
                {/* Duplicate for seamless loop */}
                <span aria-hidden>
                  <span className="text-foreground">{nowPlaying.title}</span>
                  <span className="text-foreground/45"> — </span>
                  <span className="text-foreground/70">
                    {nowPlaying.artist}
                  </span>
                </span>
              </span>
            </div>
          ) : (
            <p className="truncate text-xs leading-none tracking-tight">
              <span className="text-foreground">{nowPlaying.title}</span>
              <span className="text-foreground/45"> — </span>
              <span className="text-foreground/70">{nowPlaying.artist}</span>
            </p>
          )}
        </div>

        {/* Time display */}
        <div className="shrink-0 flex items-center gap-1 font-mono tabular-nums select-none">
          <span className="text-neon-cyan text-[0.7rem]">
            {formatRadioTime(elapsed)}
          </span>
          <span className="text-foreground/40 text-[0.6rem]">/</span>
          <span className="text-foreground/60 text-[0.7rem]">
            {formatRadioTime(total)}
          </span>
        </div>

        {/* Volume control */}
        <div className="shrink-0 flex items-center gap-1.5">
          <VolumeIcon className="size-3 text-foreground/60 shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={radioVolume}
            onChange={(e) => setRadioVolume(Number(e.target.value))}
            aria-label="Radio volume"
            className="radio-volume-slider"
          />
        </div>
      </div>
    </div>
  );
};
