import { Button, ButtonIcon } from "@/components/ui/button";
import { Close } from "@/components/ui/close";
import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import { CustomItem } from "@/components/ui/list";
import { useToast } from "@/components/ui/toast-message";
import { periorities } from "@/utils/content/lists";
import { toast_messages } from "@/utils/content/messages";
import { cn, formatDate, getDaysDifference } from "@/utils/helpers";
import { Periorite, State, Subtask, Task, User } from "@/utils/types";
import React, { useState } from "react";
import { changeSubtaskStatus, deleteSubtask, editTask } from "../services";
import { ItemsList } from "@/components/ui/list";
import { Profile } from "@/components/ui/profile";
import { Modal } from "@/components/ui/modal";
import { AddSubtask } from "./AddSubtask";
import { MembersCollection } from "./MembersCollection";
import {
  ProgreesBarText,
  ProgressBar,
  ProgressBarContainer,
  ProgressContent,
} from "@/components/ui/progress-bar";
import { LoadingContainer, LoadingSpinner } from "@/components/ui";

interface TaskDetailsProps {
  task: Task | null;
  taskPeriorite: Periorite | undefined;
  states?: State[] | [];

  setTaskDetails: (value: boolean) => void;

  taskProgress: number;

  setTasks?: React.Dispatch<React.SetStateAction<Task[] | []>>;

  changeTaskPeriorite: (value: string) => void;

  isProcessLoading?: boolean | false;

  onChangeSubtaskStatus: (id: string, status: boolean) => void;

  editable?: boolean | false;
}

export const TaskDetails = ({
  task,
  taskPeriorite,
  states,
  setTasks,
  taskProgress,
  changeTaskPeriorite,
  setTaskDetails,
  onChangeSubtaskStatus,
  isProcessLoading,
  editable = true,
}: TaskDetailsProps) => {
  const [open, setOpen] = useState(false);

  const [openStates, setOpenStates] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [addSubtask, setAddSubTask] = useState(false);

  const { showToast } = useToast();

  const changeTaskState = async (stateId: string) => {
    if (task?.stateId === stateId) return;

    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await editTask(task?.id, {
        stateId: stateId,
      });

      if (setTasks)
        setTasks((prev) =>
          prev.map((t: Task) => (t?.id === task?.id ? { ...t, ...res } : t))
        );

      showToast(
        toast_messages.tasks.edit_task_periorite.message,
        toast_messages.tasks.edit_task_periorite.title,
        "1"
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onDeleteSubTask = async (subtaskId: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await deleteSubtask(subtaskId);

      if (setTasks)
        setTasks((prev) =>
          prev.map((t: Task) =>
            t?.id === task?.id
              ? {
                  ...t,
                  subtasks: t.subtasks?.filter(
                    (s: Subtask) => s.id !== subtaskId
                  ),
                }
              : t
          )
        );

      showToast(
        toast_messages.tasks.subtask_delete.message,
        toast_messages.tasks.subtask_delete.title,
        "1"
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (isLoading || isProcessLoading)
    return (
      <LoadingContainer className="h-[50vh]">
        <LoadingSpinner />
      </LoadingContainer>
    );

  return (
    <>
      <div className="w-full">
        <Close onClick={() => setTaskDetails(false)} />
        <div className="flex flex-col gap-4">
          <div className="sticky top-0 flex justify-start items-center gap-3 z-3 bg-white">
            <div
              className="w-[8px] h-[8px] rounded-full"
              style={{
                backgroundColor: task?.state?.color && `${task?.state?.color}`,
              }}
            />
            <p
              className={cn("text-[14px] font-medium")}
              style={{
                color: task?.state?.color && `${task?.state?.color}`,
              }}
            >
              {task?.state?.name}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-12-500-main-gray mb-2">
              Modifie le {formatDate(task?.lastModified)}
            </p>

            <div className="flex flex-col gap-2 cursor-pointer">
              <h2 className="text-16-500-s-black">{task?.title}</h2>
              <p className="text-14-500-gray">{task?.description}</p>
            </div>

            <div className="flex items-start justify-between lg:gap-20 md:justify-start">
              <div className="flex flex-col gap-2">
                <h5 className="text-12-500-s-gray">Priorité</h5>
                <Dropdown
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                  }}
                  onSelect={changeTaskPeriorite}
                >
                  <Trigger
                    className="w-[100px] flex items-center gap-2.5 px-3 py-1 rounded-2xl transition hover:scale-[1.1]"
                    style={{
                      backgroundColor: taskPeriorite?.color,
                    }}
                  >
                    <p className="text-xs font-normal text-white">
                      {taskPeriorite?.periorite}
                    </p>
                    <Icon
                      className="arrow mb-0.5 brightness-10 invert"
                      style={{
                        rotate: open ? "180deg" : "none",
                      }}
                    />
                  </Trigger>

                  {editable && (
                    <List className="min-w-[120px] bg-white">
                      {periorities.map((p: Periorite) => (
                        <Item key={p._id} value={p.periorite}>
                          {p.value}
                        </Item>
                      ))}
                    </List>
                  )}
                </Dropdown>
              </div>
              <div className="h-12 w-0.5 rounded-xl bg-gray-d9" />
              <div className="flex flex-col gap-2">
                <h5 className="text-12-500-s-gray">Statut</h5>
                <Dropdown
                  open={openStates}
                  onOpenChange={(isOpen) => {
                    setOpenStates(isOpen);
                  }}
                  onSelect={changeTaskState}
                >
                  <Trigger
                    className="w-fit flex items-center gap-2.5 px-3 py-1 rounded-2xl transition hover:scale-[1.1]"
                    style={{
                      backgroundColor: task?.state?.color,
                    }}
                  >
                    <p className="text-xs font-normal text-white">
                      {task?.state?.name}
                    </p>
                    <Icon
                      className="arrow mb-0.5 brightness-10 invert"
                      style={{
                        rotate: open ? "180deg" : "none",
                      }}
                    />
                  </Trigger>

                  {editable && states && states?.length !== 0 && (
                    <List className="min-w-[120px] bg-white">
                      {states.map((s: State) => (
                        <Item key={s.id} value={s.id}>
                          {s.name}
                        </Item>
                      ))}
                    </List>
                  )}
                </Dropdown>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h5 className="text-12-500-s-gray">Sous-tâches</h5>
                {editable && (
                  <Button
                    variant="rounded"
                    type="button"
                    className="w-8 h-8"
                    onClick={() => setAddSubTask(true)}
                  >
                    <ButtonIcon className="plus brightness-0 invert-60" />
                  </Button>
                )}
              </div>

              {task?.subtasks?.length !== 0 && (
                <ItemsList className="w-full relative flex flex-col gap-2 bg-transparent! z-1 overflow-hidden">
                  {task?.subtasks?.map((subtask: Subtask) => (
                    <CustomItem
                      key={subtask.id}
                      className="flex justify-between cursor-default hover:bg-transparent! border border-gray-d9 border-solid r-10 items-center py-2.5 px-3 overflow-hidden transition group/subtask"
                      value={subtask}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={subtask?.status}
                          onChange={(e) => {
                            if (subtask?.id)
                              onChangeSubtaskStatus(
                                subtask?.id,
                                e.target.checked
                              );
                          }}
                        />
                        <div className="flex flex-col">
                          <p className="text-12-500-s-black">
                            {subtask?.title}
                          </p>
                          {subtask.status && (
                            <p className="text-[8px] text-green-main">{`Éffectué le ${formatDate(
                              subtask.lastModified
                            )}`}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center gap-3 transition group-hover/subtask:-translate-x-8">
                          <Profile
                            name={subtask?.manager?.name || ""}
                            email={subtask?.manager?.email}
                            size={28}
                            className="outline outline-blue-main"
                          />
                          {subtask.teamMembers?.map((m: User) => (
                            <Profile
                              key={m.id}
                              name={m?.name || ""}
                              email={m?.email}
                              size={28}
                            />
                          ))}
                        </div>
                        <div
                          className="absolute trash cursor-pointer -right-6 group-hover/subtask:right-3"
                          onClick={() => {
                            if (subtask.id) onDeleteSubTask(subtask.id);
                          }}
                        />
                      </div>
                    </CustomItem>
                  ))}
                </ItemsList>
              )}
            </div>

            <div className="flex mt-3">
              {task?.manager && (
                <div className="flex flex-col gap-2 mr-5">
                  <h5 className="text-12-500-main-gray">Responsable</h5>
                  <Profile
                    size={30}
                    name={task.manager?.name}
                    email={task.manager?.email}
                  />
                </div>
              )}

              {task?.teamMembers?.length !== 0 && (
                <div className="flex flex-col gap-2">
                  <h5 className="text-12-500-main-gray">Equipe</h5>
                  <MembersCollection members={task?.teamMembers || []} />
                </div>
              )}
            </div>

            <div className="flex justify-between items-end w-full mt-3">
              {task?.finishDate && task.beginDate && (
                <div className="flex items-baseline gap-3 translate-y-1.5">
                  <p className="text-12-500-main-gray">
                    <span className="text-16-500-s-black">
                      {getDaysDifference(new Date(), task?.finishDate)}
                    </span>
                    /{getDaysDifference(task?.beginDate, task?.finishDate)}
                  </p>
                  <div className="w-1 h-1 bg-main-gray rounded-full" />
                  <p className="text-12-500-main-gray">
                    {formatDate(task?.finishDate)}
                  </p>
                </div>
              )}
              <ProgressBarContainer className="lg:w-[280px] w-[180px]">
                <ProgreesBarText className="text-10-500-s-black">
                  {`${taskProgress}% d'avencement`}
                </ProgreesBarText>
                <ProgressContent>
                  <ProgressBar value={taskProgress} />
                </ProgressContent>
              </ProgressBarContainer>
            </div>
          </div>
        </div>
      </div>

      {addSubtask && setTasks && (
        <Modal
          open={addSubtask}
          onClose={() => setAddSubTask(false)}
          className="small-box"
        >
          <AddSubtask
            setAddSubTask={setAddSubTask}
            setTasks={setTasks}
            task={task}
          />
        </Modal>
      )}
    </>
  );
};
