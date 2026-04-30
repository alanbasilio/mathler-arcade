"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export const Settings = () => {
  const { playSound } = useAudio();
  const { mode, setMode } = useGame();
  const [open, setOpen] = useState<boolean>(false);

  const isGameMode = (value: string): value is "normal" | "hard" =>
    value === "normal" || value === "hard";

  const handleModeChange = (newMode: string) => {
    if (isGameMode(newMode)) setMode(newMode);
    playSound("click");
  };

  const handleOpenChange = (value: boolean) => {
    playSound("click");
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Link href="#" className="hover:text-foreground">
          <SettingsIcon
            data-cy="settings-icon"
            className="lg:absolute lg:right-5 lg:top-5"
          />
        </Link>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-foreground">Settings</DialogTitle>
        </DialogHeader>
        <div className="text-foreground flex flex-col gap-4 mt-4">
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-base mb-2">Difficulty</legend>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  className="size-4 accent-foreground cursor-pointer"
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
                  className="size-4 accent-foreground cursor-pointer"
                  name="difficulty"
                  checked={mode === "hard"}
                  onChange={() => handleModeChange("hard")}
                  data-cy="hard-mode-radio"
                />
                <span>Hard (no visual feedback)</span>
              </label>
            </div>
          </fieldset>
          <Button
            onClick={() => handleOpenChange(false)}
            data-cy="close-settings"
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
