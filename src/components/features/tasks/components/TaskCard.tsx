"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import { Modal } from "@/components/ui/modal";
import { Profile } from "@/components/ui/profile";
import {
  ProgreesBarText,
  ProgressBar,
  ProgressBarContainer,
  ProgressContent,
} from "@/components/ui/progress-bar";
import { periorities } from "@/utils/content/lists";
import {
  cn,
  formatDate,
  getDaysDifference,
  numbersFormatter,
} from "@/utils/helpers";
import { Periorite, State, Subtask, Task, User } from "@/utils/types";
import React, { useCallback, useState } from "react";
import { AddTask } from "./AddTask";
import { changeSubtaskStatus, deleteTask, editTask } from "../services";
import { toast_messages } from "@/utils/content/messages";
import { useToast } from "@/components/ui/toast-message";
import { TaskDetails } from "./TaskDetails";
import { MembersCollection } from "./MembersCollection";
import { CustomItem, ItemsList } from "@/components/ui/list";
import { LoadingContainer, LoadingSpinner } from "@/components/ui";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  states?: State[] | [];
  setStates?: React.Dispatch<React.SetStateAction<State[] | []>>;

  setTasks?: React.Dispatch<React.SetStateAction<Task[] | []>>;

  editable?: boolean;

  viewMode?: "backlog" | "kanban";
}

export const TaskCard = React.memo(
  ({
    task,
    states,
    setStates,
    setTasks,
    viewMode = "kanban",
    editable = true,
  }: TaskCardProps) => {
    const [open, setOpen] = useState(false);

    const [showSubtasks, setShowSubtasks] = useState(false);

    const taskPeriorite = periorities.find(
      (p: Periorite) => p.periorite === task.periorite
    );

    const [openEditTask, setOpenEditTask] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [taskDetails, setTaskDetails] = useState(false);

    const { showToast } = useToast();

    const calculateProgress = () => {
      let finishedST = task.subtasks?.filter((s) => s.status).length || 0;
      let allSubtasksCount = task.subtasks?.length || 0;

      if (finishedST === 0) return 0;
      else return Math.floor((finishedST * 100) / allSubtasksCount);
    };

    const taskProgress =
      task.subtasks && task.subtasks?.length !== 0 ? calculateProgress() : 0;

    const {
      setNodeRef,
      transition,
      transform,
      attributes,
      listeners,
      isDragging,
    } = useSortable({
      id: task.id || "0",
      data: {
        type: "task",
        task,
        stateId: task.stateId,
      },
    });

    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };

    const changePeriorite = useCallback(async (periorite: string) => {
      if (task.periorite === periorite) return;

      if (isLoading) return;

      try {
        setIsLoading(true);

        const res = await editTask(task.id, {
          periorite: periorite,
        });

        if (setTasks)
          setTasks((prev) =>
            prev.map((t: Task) => (t?.id === task.id ? { ...t, ...res } : t))
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
    }, []);

    const onChangeSubtaskStatus = useCallback(
      async (subtaskId: string, status: boolean) => {
        if (isLoading) return;

        try {
          setIsLoading(true);
          const res = await changeSubtaskStatus(subtaskId, status);

          if (res) {
            if (setTasks)
              setTasks((prev) =>
                prev.map((t: Task) => {
                  if (t.id === task?.id) {
                    return {
                      ...t,
                      subtasks: t.subtasks?.map((st) =>
                        st.id === subtaskId ? res : st
                      ),
                    };
                  }
                  return t;
                })
              );

            showToast(
              toast_messages.tasks.subtask_edit.message,
              toast_messages.tasks.subtask_edit.title,
              "1"
            );
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
      []
    );

    const onDeleteTask = async () => {
      if (isLoading) return;

      try {
        setIsLoading(true);

        await deleteTask(task.id);

        if (setTasks)
          setTasks((prev) => prev.filter((t: Task) => t.id !== task.id));

        setIsLoading(false);

        showToast(
          toast_messages.tasks.delete_task.message,
          toast_messages.tasks.delete_task.title,
          "1"
        );
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
      }
    };

    if (isDragging && viewMode === "kanban") {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="flex flex-col gap-6 p-4 bg-light-gray opacity-50 my-2 min-h-[333px] overflow-hidden rounded-radius-18"
        ></div>
      );
    }

    if (isLoading && !taskDetails && viewMode === "kanban")
      return (
        <LoadingContainer className="h-[333px] rounded-lg bg-light-gray">
          <LoadingSpinner />
        </LoadingContainer>
      );

    return (
      <>
        {viewMode === "kanban" && (
          <Card
            className="relative flex flex-col justify-between items-start gap-4 px-4 pt-4 pb-0 rounded-lg min-h-[333px] overflow-hidden bg-light-gray"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <CardHeader className="w-full flex justify-between flex-row items-center mt-2">
              <div className="flex items-center gap-2">
                <p className="text-12-500-main-gray">
                  Modifie le {formatDate(task?.lastModified)}
                </p>
                <Dropdown
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                  }}
                  onSelect={changePeriorite}
                >
                  <Trigger
                    className="flex items-center gap-3 px-3 py-1 rounded-2xl transition hover:scale-[1.1]"
                    style={{
                      backgroundColor: taskPeriorite?.color,
                    }}
                  >
                    <p className="text-xs text-white">
                      {taskPeriorite?.periorite}
                    </p>
                    <Icon
                      className="arrow mb-0.5 brightness-10 invert"
                      style={{
                        rotate: open ? "180deg" : "none",
                      }}
                    />
                  </Trigger>

                  <List className="min-w-[120px] bg-white">
                    {periorities.map((p: Periorite) => (
                      <Item key={p._id} value={p.periorite}>
                        {p.value}
                      </Item>
                    ))}
                  </List>
                </Dropdown>
              </div>
              <Dropdown>
                <Trigger className="">
                  <Icon className="details" />
                </Trigger>

                <List className="min-w-20 right-0">
                  <Item
                    className="text-12-500-s-gray"
                    onClick={() => setOpenEditTask(true)}
                  >
                    Edit
                  </Item>
                  <Item
                    className="text-12-500-red-main"
                    onClick={() => onDeleteTask()}
                  >
                    Delete
                  </Item>
                </List>
              </Dropdown>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 w-full clickable">
              <div
                className="flex flex-col gap-2 cursor-pointer"
                onClick={() => setTaskDetails(true)}
              >
                <CardTitle className="text-16-500-s-black">
                  {task.title}
                </CardTitle>
                <CardDescription className="text-14-500-gray">
                  {task.description}
                </CardDescription>
              </div>

              <Dropdown
                open={showSubtasks}
                onOpenChange={(value) => {
                  setShowSubtasks(value);
                }}
              >
                <Trigger className="w-fit px-3 py-1.5 gap-2 rounded-2xl bg-gray-ec">
                  <p className="text-12-500-main-gray">
                    +{numbersFormatter(task.subtasks?.length || 0)} sous tashes
                  </p>
                  <Icon
                    className="arrow mb-0.5"
                    style={{
                      rotate: showSubtasks ? "180deg" : "none",
                    }}
                  />
                </Trigger>
                {task.subtasks?.length !== 0 && showSubtasks && (
                  <ItemsList className="w-full relative flex flex-col gap-2 bg-transparent! z-1 overflow-hidden">
                    {task?.subtasks?.map((subtask: Subtask) => (
                      <CustomItem
                        key={subtask.id}
                        className="flex justify-between cursor-default hover:bg-transparent! border border-gray-d9 border-solid r-10 items-center py-2 px-3 overflow-hidden"
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
                          </div>
                        </div>
                      </CustomItem>
                    ))}
                  </ItemsList>
                )}
              </Dropdown>

              <div className="flex">
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
                    <MembersCollection
                      members={task?.teamMembers || []}
                      count={1}
                    />
                  </div>
                )}
              </div>

              <ProgressBarContainer>
                <ProgreesBarText className="text-10-500-s-black">
                  {`${taskProgress}% d'avencement`}
                </ProgreesBarText>
                <ProgressContent>
                  <ProgressBar value={taskProgress} />
                </ProgressContent>
              </ProgressBarContainer>
            </CardContent>

            <CardFooter className="w-full relative flex justify-between items-center pb-2 px-0 pt-3 before:absolute before:top-0 before:bg-gray-d9 before:w-[120%] before:left-[-16px] before:h-[1px]">
              <p className="text-12-500-main-gray">
                <span className="text-16-500-s-black">
                  {getDaysDifference(new Date(), task.finishDate)}
                </span>
                /{getDaysDifference(task.beginDate, task.finishDate)}
              </p>
              <p className="text-12-500-main-gray">
                {formatDate(task?.finishDate)}
              </p>
            </CardFooter>
          </Card>
        )}

        {viewMode === "backlog" && (
          <>
            <Card className="w-full hidden lg:flex items-start gap-4 px-4 py-3 r-10 border border-solid border-gray-very-light bg-transparent shadow-none">
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <p className="text-12-500-main-gray">
                      Modifie le {formatDate(task?.lastModified)}
                    </p>
                    <div className="flex justify-start items-center gap-3">
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor:
                            task?.state?.color && `${task?.state?.color}`,
                        }}
                      />
                      <p
                        className={cn("text-xs font-medium")}
                        style={{
                          color: task?.state?.color && `${task?.state?.color}`,
                        }}
                      >
                        {task?.state?.name}
                      </p>
                    </div>
                  </div>
                  <CardTitle
                    className="text-16-500-s-black cursor-pointer"
                    onClick={() => setTaskDetails(true)}
                  >
                    {task.title}
                  </CardTitle>
                  <div className="w-fit px-3 py-1.5 gap-2 rounded-2xl bg-gray-ec">
                    <p className="text-12-500-main-gray">
                      {numbersFormatter(task.subtasks?.length || 0)} sous tashes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Dropdown
                    open={open}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen);
                    }}
                    onSelect={changePeriorite}
                  >
                    <Trigger
                      className="flex items-center gap-2 px-2.5 py-1 rounded-2xl transition hover:scale-[1.1]"
                      style={{
                        backgroundColor: taskPeriorite?.color,
                      }}
                    >
                      <p className="text-xs text-white">
                        {taskPeriorite?.periorite}
                      </p>
                      {editable && (
                        <Icon
                          className="arrow mb-0.5 brightness-10 invert"
                          style={{
                            rotate: open ? "180deg" : "none",
                          }}
                        />
                      )}
                    </Trigger>
                    {editable && (
                      <List className="min-w-[120px] bg-white right-0">
                        {periorities.map((p: Periorite) => (
                          <Item key={p._id} value={p.periorite}>
                            {p.value}
                          </Item>
                        ))}
                      </List>
                    )}
                  </Dropdown>
                  <ProgressBarContainer className="w-[180px] gap-0">
                    <ProgreesBarText className="text-10-500-s-black">
                      {`${taskProgress}% d'avencement`}
                    </ProgreesBarText>
                    <ProgressContent>
                      <ProgressBar value={taskProgress} />
                    </ProgressContent>
                  </ProgressBarContainer>

                  <div className="flex items-center gap-2">
                    <Profile
                      name={task?.manager?.name || ""}
                      email={task?.manager?.email}
                      size={28}
                      className="outline outline-blue-main"
                    />
                    <MembersCollection
                      members={task?.teamMembers || []}
                      count={1}
                    />
                  </div>

                  {editable && (
                    <Dropdown className="ml-2">
                      <Trigger className="">
                        <Icon className="details" />
                      </Trigger>

                      <List className="min-w-20 right-0">
                        <Item
                          className="text-12-500-s-gray"
                          onClick={() => setOpenEditTask(true)}
                        >
                          Edit
                        </Item>
                        <Item
                          className="text-12-500-red-main"
                          onClick={() => onDeleteTask()}
                        >
                          Archive
                        </Item>
                      </List>
                    </Dropdown>
                  )}
                </div>
              </div>
            </Card>
            <Card className="w-full lg:hidden px-4 py-3 r-10 border border-solid border-gray-very-light bg-transparent shadow-none">
              <div className="w-full flex flex-col">
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <p className="text-12-500-main-gray">
                        Modifie le {formatDate(task?.lastModified)}
                      </p>
                      <div className="flex justify-start items-center gap-3">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor:
                              task?.state?.color && `${task?.state?.color}`,
                          }}
                        />
                        <p
                          className={cn("text-xs font-medium")}
                          style={{
                            color:
                              task?.state?.color && `${task?.state?.color}`,
                          }}
                        >
                          {task?.state?.name}
                        </p>
                      </div>
                    </div>
                    <CardTitle
                      className="text-16-500-s-black cursor-pointer"
                      onClick={() => setTaskDetails(true)}
                    >
                      {task.title}
                    </CardTitle>
                    <div className="w-fit px-3 py-1.5 gap-2 rounded-2xl bg-gray-ec">
                      <p className="text-12-500-main-gray">
                        {numbersFormatter(task.subtasks?.length || 0)} sous
                        tashes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Dropdown
                      open={open}
                      onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                      }}
                      onSelect={changePeriorite}
                    >
                      <Trigger
                        className="flex items-center gap-2 px-2.5 py-1 rounded-2xl transition hover:scale-[1.1]"
                        style={{
                          backgroundColor: taskPeriorite?.color,
                        }}
                      >
                        <p className="text-xs text-white">
                          {taskPeriorite?.periorite}
                        </p>
                        {editable && (
                          <Icon
                            className="arrow mb-0.5 brightness-10 invert"
                            style={{
                              rotate: open ? "180deg" : "none",
                            }}
                          />
                        )}
                      </Trigger>
                      {editable && (
                        <List className="min-w-[120px] bg-white right-0">
                          {periorities.map((p: Periorite) => (
                            <Item key={p._id} value={p.periorite}>
                              {p.value}
                            </Item>
                          ))}
                        </List>
                      )}
                    </Dropdown>

                    {editable && (
                      <Dropdown className="ml-2">
                        <Trigger className="">
                          <Icon className="details" />
                        </Trigger>

                        <List className="min-w-20 right-0">
                          <Item
                            className="text-12-500-s-gray"
                            onClick={() => setOpenEditTask(true)}
                          >
                            Edit
                          </Item>
                          <Item
                            className="text-12-500-red-main"
                            onClick={() => onDeleteTask()}
                          >
                            Archive
                          </Item>
                        </List>
                      </Dropdown>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <Profile
                      name={task?.manager?.name || ""}
                      email={task?.manager?.email}
                      size={28}
                      className="outline outline-blue-main"
                    />
                    <MembersCollection
                      members={task?.teamMembers || []}
                      count={1}
                    />
                  </div>
                  <ProgressBarContainer className="w-[180px] gap-0">
                    <ProgreesBarText className="text-10-500-s-black">
                      {`${taskProgress}% d'avencement`}
                    </ProgreesBarText>
                    <ProgressContent>
                      <ProgressBar value={taskProgress} />
                    </ProgressContent>
                  </ProgressBarContainer>
                </div>
              </div>
            </Card>
          </>
        )}

        {taskDetails && (
          <Modal
            open={taskDetails}
            onClose={() => setTaskDetails(false)}
            className="medium-box"
          >
            <TaskDetails
              task={task}
              taskPeriorite={taskPeriorite}
              states={states}
              setTasks={setTasks}
              taskProgress={taskProgress}
              changeTaskPeriorite={changePeriorite}
              setTaskDetails={setTaskDetails}
              onChangeSubtaskStatus={onChangeSubtaskStatus}
              isProcessLoading={isLoading}
              editable={editable}
            />
          </Modal>
        )}

        {openEditTask && setStates && setTasks && states && (
          <Modal
            open={openEditTask}
            onClose={() => setOpenEditTask(false)}
            className="small-box max-h-[80vh] overflow-y-auto"
          >
            <AddTask
              setEditTask={setOpenEditTask}
              setStates={setStates}
              setTasks={setTasks}
              states={states}
              // setTasks={setStates}
              task={task}
              edit={true}
            />
          </Modal>
        )}
      </>
    );
  }
);
