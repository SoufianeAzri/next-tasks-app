"use client";

import React, { useState } from "react";
import { AddTaskButton } from "./AddTaskButton";
import { TaskCard } from "./TaskCard";
import { State, Task } from "@/utils/types";
import { cn } from "@/utils/helpers";
import { Modal } from "@/components/ui/modal";
import { AddTask } from "./AddTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StatusPanelProps {
  state: State;
  tasks: Task[] | [];
  setTasks: React.Dispatch<React.SetStateAction<Task[] | []>>;

  states: State[] | [];
  setStates: React.Dispatch<React.SetStateAction<State[] | []>>;
}

export const StatusPanel = ({
  state,
  states,
  setStates,
  tasks,
  setTasks,
}: StatusPanelProps) => {
  const [addTask, setAddTask] = useState(false);

  const {
    setNodeRef,
    transition,
    transform,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: state.id || "0",
    data: {
      type: "state",
      state,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleAddTask = () => {
    setAddTask(true);
  };

  // if (isDragging) {
  //   return (
  //     <div
  //       className={`max-h-[84vh] overflow-y-hidden  min-w-[450px] bg-[#ECECEC] rounded-radius-18`}
  //       ref={setNodeRef}
  //       style={style}
  //     ></div>
  //   );
  // }

  return (
    <>
      <div
        className="max-h-[84vh] hover:overflow-y-scroll overflow-y-hidden min-w-[450px] w-1/3"
        ref={setNodeRef}
        style={style}
      >
        <div className="relative flex flex-col gap-3 px-4 pb-4 transition bg-white rounded-2xl">
          <div
            className="sticky top-0 flex justify-start items-center gap-3 z-[3] bg-white h-[40px] cursor-pointer"
            {...attributes}
            {...listeners}
          >
            <div
              className="w-[8px] h-[8px] rounded-full"
              style={{
                backgroundColor: state.color && `${state.color}`,
              }}
            />
            <p
              className={cn("text-[14px] font-medium")}
              style={{
                color: state?.color && `${state?.color}`,
              }}
            >
              {state?.name}
            </p>
          </div>

          <AddTaskButton onAction={handleAddTask} />

          <div className="w-full flex flex-col gap-3">
            {tasks?.map((t: Task) => (
              <TaskCard
                key={t.id}
                task={t}
                setTasks={setTasks}
                states={states}
                setStates={setStates}
              />
            ))}
          </div>
        </div>
      </div>

      {addTask && (
        <Modal
          open={addTask}
          onClose={() => setAddTask(false)}
          className="small-box"
        >
          <AddTask
            setAddTask={setAddTask}
            states={states}
            setStates={setStates}
            tasks={tasks}
            setTasks={setTasks}
            targetState={state}
          />
        </Modal>
      )}
    </>
  );
};
