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
    <div
      className={cn(
        "pointer-events-none fixed size-full overflow-hidden opacity-50 [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="fixed inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid [height:300vh] [width:600vw] [margin-left:-50%] [transform-origin:100%_0_0]",
            "[background-size:60px_60px] [inset:0%_0px]",
            // Light styles
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]",
            // Dark styles
            "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]"
          )}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-black" />
    </div>
  );
}
