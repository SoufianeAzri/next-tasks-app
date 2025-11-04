"use client";

import React from "react";
import Image from "next/image";
import Avatar from "boring-avatars";
import { cn } from "@/utils/helpers";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email?: string;
  image?: string | null;
  size?: number;
  move?: number;
}

const Profile = React.forwardRef<HTMLDivElement, ProfileProps>(
  ({ name, email, image, translate, move=0, size = 48, className, ...props }, ref) => {
    return (
      <div
        className={cn("relative rounded-full overflow-hidden border border-solid border-dim-gray flex-shrink-0", className)}
        style={{ width: size, height: size, transform: `translateX(${move}px)` }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes={`${size}px`}
            className="object-cover rounded-full"
          />
        ) : (
          <Avatar
            size={size}
            name={name}
            variant="beam"
            colors={["#A3A1FB", "#FFB3B3", "#FFD700", "#B3FFB3", "#B3E5FF"]}
          />
        )}
      </div>
    );
  }
);

Profile.displayName = "Profile";

export { Profile };
