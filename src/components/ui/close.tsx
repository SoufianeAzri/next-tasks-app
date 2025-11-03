import { cn } from "@/utils/helpers";
import React from "react";

const Close = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute cursor-pointer right-4 top-4 z-10 transition ease-in-out animate-popout hover:invert",
      className
    )}
    {...props}
  >
    <div className="bg-dim-gray rounded-full h-7 w-7 after:absolute after:w-full after:h-full after:flex after:justify-center after:items-center after:content-['\2715']" />
  </div>
));
Close.displayName = "Close";

export { Close };
