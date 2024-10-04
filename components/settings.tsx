"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAudio } from "@/hooks/use-audio";
import { useGame } from "@/hooks/use-game";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Settings = () => {
  const { playSound } = useAudio();
  const { mode, setMode } = useGame();
  const [open, setOpen] = useState<boolean>(false);

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "normal" | "hard");
    playSound("click");
  };

  const handleOpenChange = () => {
    playSound("click");
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={handleOpenChange}>
        <Link href="#" className="hover:text-foreground">
          <SettingsIcon
            data-cy="settings-icon"
            className="lg:absolute lg:right-5 lg:top-5"
          />
        </Link>
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
          <Button onClick={handleOpenChange} data-cy="close-settings">
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
