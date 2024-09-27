"use client";

import { GameBoard } from "@/components/game-board";
import { Keyboard } from "@/components/keyboard";
import { Settings } from "@/components/settings";
import { Tutorial } from "@/components/tutorial";
import { useAudio } from "@/hooks/use-audio";
import { useGame } from "@/hooks/use-game";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Heart, Moon, MusicIcon, Sun, Volume2, VolumeOff } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

export const GameContent = () => {
  const { theme, setTheme } = useTheme();
  const {
    guesses,
    currentGuess,
    gameWon,
    keyboardFeedback,
    handleKeyPress,
    targetResult,
    activeKey,
  } = useGame();
  const { stopAudio, toggleAudio, playSound } = useAudio();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleThemeToggle = () => {
    playSound("click");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeToggleIcon = theme === "dark" ? Moon : Sun;
  const AudioIcon = stopAudio ? VolumeOff : Volume2;

  return (
    <div className="flex flex-col gap-6 p-4 z-10 items-center">
      <div className="text-center space-y-2">
        <div className="flex gap-4 items-center justify-center">
          <Tutorial />
          <ThemeToggleIcon
            className="lg:absolute lg:right-5 lg:bottom-5"
            onClick={handleThemeToggle}
          />
          <h1
            className="text-3xl md:text-4xl lg:text-5xl italic leading-none tracking-tighter"
            data-cy="title"
          >
            Mathler
          </h1>
          <Settings />
          <AudioIcon
            onClick={toggleAudio}
            className="lg:absolute lg:left-5 lg:bottom-5"
          />
        </div>
        <h2
          className="text-xs lg:text-base leading-none tracking-tighter"
          data-cy="subtitle"
        >
          {isDesktop ? (
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
      <GameBoard guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onKeyPress={handleKeyPress}
        feedback={keyboardFeedback}
        activeKey={activeKey}
        highlightEnter={currentGuess.length === 6}
      />
      {gameWon && (
        <p
          className="mt-4 text-success font-bold text-center"
          data-cy="success-message"
        >
          You&apos;ve solved today&apos;s equation! <br />
          Come back tomorrow for a new challenge!
        </p>
      )}
      <div className="flex items-center gap-2">
        <Link
          href="https://github.com/alanbasilio/mathler-arcade"
          target="_blank"
          className="text-xs flex items-center gap-2"
        >
          <GitHubLogoIcon className="w-3 h-3" />
          Github
        </Link>
        <span className="max-md:hidden">|</span>
        <Link
          href="https://vektroid.bandcamp.com/track/420"
          target="_blank"
          className="text-xs flex items-center gap-2 max-md:hidden"
        >
          <MusicIcon className="w-3 h-3" />
          Music by Macintosh Plus
        </Link>
        |
        <Link
          href="https://www.alanbasilio.com"
          target="_blank"
          className="text-xs flex items-center gap-2"
        >
          <Heart className="w-3 h-3" />
          Made by Alan Basilio
        </Link>
      </div>
    </div>
  );
};
