import {
  FieldContainer,
  FieldTitle,
  InputField,
} from "@/components/ui/input-field";
import { Subtask, Task, User } from "@/utils/types";
import React, { FormEvent, useState } from "react";
import { UsersSearch } from "./UsersSearch";
import { Button, ButtonText, LoadingDots } from "@/components/ui/button";
import { cn } from "@/utils/helpers";
import { addSubtask } from "../services";
import { toast_messages } from "@/utils/content/messages";
import { useToast } from "@/components/ui/toast-message";

interface AddSubTaskProps {
  setAddSubTask: (value: boolean) => void;

  setTasks: React.Dispatch<React.SetStateAction<Task[] | []>>;

  task?: Task | null;
}

export const AddSubtask = ({
  setAddSubTask,
  setTasks,
  task,
}: AddSubTaskProps) => {
  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [manager, setManager] = useState<User[]>([]);

  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  const { showToast } = useToast();

  const onAddSubTask = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      setIsLoading(true);
      if (task?.id && title && manager[0]?.id) {
        const subtaskData: Subtask = {
          title: title,
          managerId: manager[0]?.id,
          taskId: task?.id,
          teamMembersIds:
            teamMembers
              .map((m: User) => m.id)
              .filter((id): id is string => Boolean(id)) || [],
        };

        const res = await addSubtask(task?.id, subtaskData);

        if (res) {
          setTasks((prev) =>
            prev.map((t: Task) => {
              if (t.id === task?.id) {
                return {
                  ...t,
                  subtasks:
                    t?.subtasks && t?.subtasks?.length !== 0
                      ? [...t?.subtasks, res]
                      : [res],
                };
              }
              return t;
            })
          );

          showToast(
            toast_messages.tasks.add_subtask.message,
            toast_messages.tasks.add_subtask.title,
            "1"
          );

          setAddSubTask(false);
        }
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-3">
        <div
          className="cursor-pointer flex items-baseline gap-2"
          onClick={() => setAddSubTask(false)}
        >
          <div className="arrow rotate-90 translate-y-px" />
          <p className="text-14-500-gray">Retour</p>
        </div>
        <h2 className="text-20-700-s-black">Ajouter la sous tache</h2>

        <div className="w-[70px] h-2" />
      </div>

      <form className="flex flex-col gap-3" onSubmit={onAddSubTask}>
        <FieldContainer>
          <FieldTitle>Title</FieldTitle>
          <InputField
            id="title"
            name="title"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FieldContainer>

        <UsersSearch
          title="Select Manager"
          placeholder="Select .."
          selectedUsers={manager}
          setSelectedUsers={setManager}
          type="single"
          mode="offline"
          defaultList={task?.teamMembers}
        />

        <UsersSearch
          title="Select Team Members"
          placeholder="Select .."
          selectedUsers={teamMembers}
          setSelectedUsers={setTeamMembers}
          mode="offline"
          defaultList={task?.teamMembers}
        />

        <Button
          variant="primary"
          className={cn("overflow-hidden rounded-3xl py-3 mt-3")}
          type="submit"
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <ButtonText className={cn("text-[14px] text-gray-d9")}>
              Ajouter une sous tashe
            </ButtonText>
          )}
        </Button>
      </form>
    </div>
  );
};
