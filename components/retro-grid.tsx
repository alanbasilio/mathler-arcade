"use client";

import { cn } from "@/utils/cn";

export default function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed size-full overflow-hidden opacity-50 perspective-[200px]",
          className
        )}
        style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
      >
        <div className="fixed inset-0 [transform:rotateX(var(--grid-angle))]">
          <div
            className={cn(
              "animate-grid h-[300vh] w-[600vw] ml-[-50%] origin-[100%_0_0]",
              "bg-size-[60px_60px] inset-[0%_0px]",
              "bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]",
              "dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]"
            )}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-white to-transparent dark:from-black" />
      </div>
    </>
  );
}
