import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Profile } from "@/components/ui/profile";
import { activityTypes } from "@/utils/content/lists";
import { formatDate } from "@/utils/helpers";
import { Activity } from "@/utils/types";
import React from "react";

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <Card className="relative flex flex-col justify-between items-start gap-4 p-4 rounded-lg bg-white before:absolute before:-left-8 before:top-6 before:w-4 before:h-4 before:bg-gray-d9 before:rounded-full">
      <CardHeader className="w-full flex justify-between flex-row items-center">
        <div className="flex items-center gap-3">
          <Profile size={40} name={"Current User"} email={"s@gmail.com"} />
          <p className="text-14-500-s-black">Soufiane Azri</p>
        </div>

        <p className="text-12-500-main-gray">
          {formatDate(activity.createdAt)}
        </p>
      </CardHeader>

      <CardContent>
        {!activity.isOldState ? (
          <p className="text-14-600-black">
            {`la tâche `}
            <span className="text-14-500-gray">{`${activity?.entityTitle} `}</span>
            {`${activityTypes
              .find((t) => t.type === activity.type)
              ?.action?.toLowerCase()}`}
          </p>
        ) : (
          <p className="text-14-600-black">
            {`Le ${activityTypes
              .find((t) => t.type === activity.type)
              ?.item?.toLowerCase()} de la tashe `}
            <span className="text-14-500-gray">{`${activity.entityTitle} `}</span>
            <span>a été modifié est passé de </span>
            <span className="text-14-500-gray">{`${activity.oldState?.slice(
              0,
              30
            )}${
              activity?.oldState && activity?.oldState?.length > 30 ? "..." : ""
            } `}</span>
            <span>à</span>
            <span className="text-14-500-gray">{` ${activity.newState?.slice(
              0,
              30
            )}${
              activity?.newState && activity?.newState?.length > 30 ? "..." : ""
            } `}</span>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
};
