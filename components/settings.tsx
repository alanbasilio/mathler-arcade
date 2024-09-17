"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAudio } from "@/providers/audio-provider";
import { useGameMode } from "@/providers/game-mode";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const Settings = () => {
  const { playSound } = useAudio();
  const { mode, setMode } = useGameMode();
  const handleClick = () => playSound("click");
  const [open, setOpen] = useState<boolean>(false);

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "normal" | "hard");
    playSound("click");
  };

  const handleClose = () => setOpen(!open);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild onClick={handleClick}>
        <SettingsIcon
          data-cy="settings-icon"
          className="lg:absolute lg:right-5 lg:top-5"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-base">Difficulty</h3>
          <div className="flex flex-col">
            <label>
              <input
                type="radio"
                className="nes-radio"
                name="difficulty"
                checked={mode === "normal"}
                onChange={() => handleModeChange("normal")}
                data-cy="normal-mode-radio"
              />
              <span>Normal</span>
            </label>
            <label>
              <input
                type="radio"
                className="nes-radio"
                name="difficulty"
                checked={mode === "hard"}
                onChange={() => handleModeChange("hard")}
                data-cy="hard-mode-radio"
              />
              <span>Hard (no visual feedback)</span>
            </label>
          </div>
          <Button onClick={handleClose} data-cy="close-settings">
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
