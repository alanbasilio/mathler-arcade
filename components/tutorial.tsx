"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export const Tutorial = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Info className="lg:absolute lg:left-5 lg:top-5" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>How to Play Mathler</DialogTitle>
      </DialogHeader>
      <div className="prose space-y-2 text-sm">
        <p>
          Challenge yourself to uncover the hidden calculation in just 6
          attempts!
        </p>
        <p>
          With each guess, the tile colors will shift, revealing how close you
          are to cracking the code.
        </p>
        <p className="flex gap-2">
          <Button variant="success">5</Button>
          <Button variant="accent">0</Button>
          <Button variant="success">/</Button>
          <Button variant="warning">5</Button>
          <Button variant="accent">-</Button>
          <Button variant="accent">2</Button>
        </p>
        <ul className="list-disc pl-4">
          <li>Green: Perfectly placed.</li>
          <li>Orange: Correct, but misplaced.</li>
          <li>Gray: Not part of the solution.</li>
        </ul>
        <p className="font-bold">Key Rules to Remember</p>
        <ul className="list-disc pl-4">
          <li>
            Repetition allowed: Numbers and operators may appear more than once.
          </li>
          <li>
            Order matters: Follow standard order of operations (/ or * before -
            or +).
          </li>
          <li>
            Flexibility in solutions: Commutative answers (e.g., 20+7+3 and
            3+7+20) are valid.
          </li>
          <li>
            Auto-arrangement: Commutative solutions will be automatically
            aligned with the exact answer.
          </li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);
