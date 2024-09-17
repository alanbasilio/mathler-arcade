"use client";

import { GameBoard } from "@/components/game-board";
import { Keyboard } from "@/components/keyboard";
import RetroGrid from "@/components/retro-grid";
import { Settings } from "@/components/settings";
import { Start } from "@/components/start";
import { Tutorial } from "@/components/tutorial";
import { useGame } from "@/hooks/use-game";
import { useAudio } from "@/providers/audio-provider";
import { evaluate } from "@/utils/evaluate";
import { getNumberOfTheDay } from "@/utils/numbers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Heart, Moon, MusicIcon, Sun, Volume2, VolumeOff } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const targetEquation = getNumberOfTheDay();
const targetResult = evaluate(targetEquation);

export default function Mathler() {
  const { theme, setTheme } = useTheme();
  const {
    playGame,
    guesses,
    currentGuess,
    gameOver,
    winGame,
    keyboardFeedback,
    handleKeyPress,
    startGame,
  } = useGame();
  const { stopAudio, toggleAudio, playSound } = useAudio();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = ["Enter", "Backspace", ...Array.from("0123456789+-*/")];
      if (validKeys.includes(event.key)) {
        handleKeyPress(event.key);
        setActiveKey(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  useEffect(() => {
    if (activeKey) {
      const timer = setTimeout(() => setActiveKey(""), 100);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);

  const handleTheme = () => {
    playSound("click");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeToggleIcon = theme === "dark" ? Moon : Sun;
  const AudioIcon = stopAudio ? VolumeOff : Volume2;

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0">
      <div className="fixed inset-0 bg-[url('/images/noise.gif')] bg-cover z-0 opacity-40" />
      {!gameOver && !winGame && <RetroGrid />}
      {playGame ? (
        gameOver ? (
          <div className="flex flex-col items-center">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic leading-none tracking-tighter z-10"
              data-cy="title"
            >
              Game Over
            </h1>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4 z-10 items-center">
            <div className="text-center space-y-2">
              <div className="flex gap-4 items-center justify-center">
                <Tutorial />
                <ThemeToggleIcon
                  className="lg:absolute lg:right-5 lg:bottom-5"
                  onClick={handleTheme}
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
            {winGame && (
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
              |
              <Link
                href="https://www.youtube.com/watch?v=aQkPcPqTq4M"
                target="_blank"
                className="text-xs flex items-center gap-2"
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
        )
      ) : (
        <Start startGame={startGame} />
      )}
      <GoogleAnalytics gaId="G-R20575MFZH" />
    </div>
  );
}
