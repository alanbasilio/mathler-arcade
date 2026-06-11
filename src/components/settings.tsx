"use client";

import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          data-cy="settings-icon"
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-foreground">Settings</DialogTitle>
        </DialogHeader>
        <div className="text-foreground flex flex-col gap-4 mt-4">
          <RadioGroup
            defaultValue={mode}
            onValueChange={setMode}
            className="w-fit"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="normal"
                id="r1"
                data-cy="hard-mode-radio"
              />
              <Label htmlFor="r1">Normal</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="hard" id="r2" data-cy="hard-mode-radio" />
              <Label htmlFor="r2">Hard (no visual feedback)</Label>
            </div>
          </RadioGroup>
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
