import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helpers";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
  percentage?: string;
  headerStyles?: string;
  percentageStyles: string;
  arrow: string | "arrow";
}

export const StatsCard = ({
  className,
  value,
  title,
  headerStyles,
  percentage,
  percentageStyles,
  arrow
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden min-w-[200px] grow", className)}>
      <div className="flex flex-col gap-2 pl-2">
        <CardHeader
          className={cn(
            `before:absolute before:h-[calc(100%-10px)] before:w-2.5 before:-left-6.75 before:rounded-lg`,
            headerStyles
          )}
        >
          <CardTitle>{title}</CardTitle>
          <h2 className="text-34-800-s-black">{value}</h2>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                `w-[25px] h-[25px] rounded-full fx-centered`,
                percentageStyles
              )}
            >
              <div className={`arrow -rotate-135`} />
            </div>
            <p className="text-xl font-light translate-y-0.5">{percentage}%</p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
