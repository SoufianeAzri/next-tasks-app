import { Profile } from "@/components/ui/profile";
import { cn, numbersFormatter } from "@/utils/helpers";
import { User } from "@/utils/types";
import React from "react";

interface MembersCollectionProps {
  count?: number;
  members: User[] | [];
}

export const MembersCollection = ({
  members,
  count = 2,
}: MembersCollectionProps) => {
  return (
    <div className="flex items-center">
      {members.length !== 0 &&
        members.map(
          (m: User, index) =>
            index < count && (
              <Profile
                key={m.id}
                size={30}
                name={m.name}
                email={m.email}
                className={cn(`z-${index} -translate-x-${index}`)}
                move={index * -4}
              />
            )
        )}
      {members.length > count && (
        <div className="w-[30px] h-[30px] rounded-full bg-black/60 flex justify-center items-center -translate-x-2 z-2 cursor-pointer">
          <span className="text-[10px] mt-0.5 text-white">
            +{numbersFormatter(members.length - count)}
          </span>
        </div>
      )}
    </div>
  );
};
