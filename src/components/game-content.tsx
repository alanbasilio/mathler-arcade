"use client";

import { Heart, Moon, MusicIcon, Sun, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMediaQuery } from "usehooks-ts";
import { GameBoard } from "@/components/game-board";
import { Keyboard } from "@/components/keyboard";
import { Settings } from "@/components/settings";
import { Tutorial } from "@/components/tutorial";
import { useAudio } from "@/hooks/use-audio";
import { useGame } from "@/hooks/use-game";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const GameContent = () => {
  const { theme, setTheme } = useTheme();
  const { gameWon, targetResult, targetEquation, revealEquation } = useGame();
  const { stopAudio, toggleAudio, playSound, ambientActive } = useAudio();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleThemeToggle = () => {
    playSound("click");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeToggleIcon = theme === "dark" ? Sun : Moon;
  const AudioIcon = stopAudio ? VolumeOff : Volume2;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-4 z-10 items-center",
        ambientActive && "pb-12",
      )}
    >
      <div className="text-center space-y-2">
        <div className="flex gap-4 items-center justify-center">
          <Tutorial />
          <Link
            href="#"
            onClick={handleThemeToggle}
            className="hover:text-foreground"
          >
            <ThemeToggleIcon className="lg:absolute lg:right-5 lg:bottom-14" />
          </Link>
          <h1
            className="text-foreground text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic leading-none tracking-tighter"
            data-cy="title"
          >
            Mathler
          </h1>
          <Settings />
          <Link
            href="#"
            onClick={toggleAudio}
            className="hover:text-foreground"
          >
            <AudioIcon className="lg:absolute lg:left-5 lg:bottom-14" />
          </Link>
        </div>
        <h2
          className="text-foreground text-xs lg:text-base leading-none tracking-tighter"
          data-cy="subtitle"
        >
          {revealEquation ? (
            <>
              The answer is{" "}
              <span
                className="bg-foreground text-background p-1"
                data-cy="revealed-equation"
              >
                {targetEquation} = {targetResult}
              </span>
            </>
          ) : isDesktop ? (
            <>
              Solve the hidden equation{" "}
              <span className="bg-foreground text-background p-1">
                that results in {targetResult}
              </span>
            </>
          ) : (
            <>
              Find the hidden calculation{" "}
              <span className="bg-foreground text-background p-1">
                that equals {targetResult}
              </span>
            </>
          )}
        </h2>
      </div>
      <GameBoard />
      <Keyboard />
      {gameWon && (
        <div
          className="mt-2 px-4 py-3 border-4 border-success bg-success/10 text-success font-bold text-center text-xs md:text-sm animate-pop"
          data-cy="success-message"
        >
          You&apos;ve solved today&apos;s equation! <br />
          Come back tomorrow for a new challenge!
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button asChild variant="link" size="xs">
          <Link
            href="https://github.com/alanbasilio/mathler-arcade"
            target="_blank"
            className="text-foreground!"
          >
            <Image
              className="dark:invert"
              src="/images/github.svg"
              alt="Github"
              width={12}
              height={12}
            />
            Github
          </Link>
        </Button>
        <span className="text-foreground!">|</span>
        <Button asChild variant="link" size="xs">
          <Link
            href="https://plaza.one/"
            target="_blank"
            className="text-foreground!"
          >
            <MusicIcon className="size-3" />
            Radio by Nightwave Plaza
          </Link>
        </Button>
        <span className="text-foreground!">|</span>
        <Button asChild variant="link" size="xs">
          <Link
            href="https://alanbasilio.com"
            target="_blank"
            className="text-foreground!"
          >
            <Heart className="size-3" />
            Made by Alan Basilio
          </Link>
        </Button>
      </div>
    </div>
  );
};
