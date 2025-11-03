import { Button, ButtonText } from "@/components/ui/button";
import { cn } from "@/utils/helpers";
import React from "react";

export const AddTaskButton = ({ onAction }: { onAction: () => void }) => {
  return (
    <Button
      variant="dashed"
      className={cn("overflow-hidden rounded-3xl py-3")}
      onClick={onAction}
    >
      <ButtonText className={cn("text-12-500-main-gray")}>
        Ajouter une tâche +
      </ButtonText>
    </Button>
  );
};
