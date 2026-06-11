"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";

interface StartProps {
  onPlayDuo: () => void;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const Start = ({ onPlayDuo }: StartProps) => {
  const { startGame } = useGame();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={reduceMotion ? "show" : "hidden"}
      animate="show"
      className="flex flex-col gap-6 items-center"
    >
      {/* Arcade header bar */}
      <motion.p
        variants={item}
        className="text-foreground font-heading text-[0.5rem] md:text-[0.65rem] tracking-[0.3em] select-none"
      >
        ░░░ ARCADE ░░░
      </motion.p>

      {/* Title with neon glow + periodic glitch */}
      <motion.h1
        variants={item}
        className="text-foreground font-heading neon-glow text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none animate-glitch"
        data-cy="title"
      >
        Mathler
      </motion.h1>

      <motion.p
        variants={item}
        className="text-foreground text-base md:text-lg text-center"
        data-cy="subtitle"
      >
        Ready to crunch some numbers?
      </motion.p>

      {/* Action buttons */}
      <motion.div
        variants={item}
        className="flex max-md:flex-col gap-3 items-center mt-1"
      >
        <Button
          onClick={startGame}
          variant="pixel"
          size="lg"
          className="text-base md:text-lg lg:text-xl"
          data-cy="start"
        >
          ▶ PLAY SOLO
        </Button>
        <Button
          onClick={onPlayDuo}
          variant="pixel"
          size="lg"
          className="text-base md:text-lg lg:text-xl"
          data-cy="start-duo"
        >
          PLAY DUO
        </Button>
      </motion.div>

      {/* Footer credits */}
      <motion.p
        variants={item}
        className="text-foreground text-xs tracking-[0.2em] select-none mt-2"
      >
        © {moment().year()} · Alan Basilio
      </motion.p>
    </motion.div>
  );
};
