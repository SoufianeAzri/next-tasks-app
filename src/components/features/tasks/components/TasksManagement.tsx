"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CustomSearchBar } from "../../CustomSearchBar";
import { Button, ButtonText } from "@/components/ui/button";
import { cn } from "@/utils/helpers";
import { Filters } from "./Filters";
import { tasksViewList } from "@/utils/content/lists";
import { StatusPanel } from "./StatusPanel";
import { Modal } from "@/components/ui/modal";
import { AddTask } from "./AddTask";
import { State, Task } from "@/utils/types";
import { TaskCard } from "./TaskCard";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { editTask, reorderStates } from "../services";
import { AddStatePanel } from "./AddStatePanel";
import { useFilteredTasks } from "../hooks/useFilterTasks";
import { useToast } from "@/components/ui/toast-message";
import { toast_messages } from "@/utils/content/messages";

interface TasksManagementProps {
  states: State[] | [];
  tasks: Task[] | [];
  usersRelated: [] | [];
}

export const TasksManagement = ({
  states,
  tasks,
  usersRelated,
}: TasksManagementProps) => {
  const [localeStates, setLocaleStates] = useState<State[] | []>(states);
  const [localeTasks, setLocaleTasks] = useState<Task[] | []>(tasks);

  const [viewMode, setViewMode] = useState<any>(tasksViewList[0]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [activeState, setActiveState] = useState<State | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [taskQuery, setTaskQuery] = useState<string | "">("");

  // when component mounted
  const [isMounted, setIsMounted] = useState(false);

  const mouseSensor = useSensor(MouseSensor); // Initialize mouse sensor
  const touchSensor = useSensor(TouchSensor);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
      mouseSensor,
      touchSensor,
    })
  );

  const statesIds = useMemo(
    () => localeStates?.map((s: State) => s.id)?.filter(Boolean) as string[],
    [localeStates]
  );

  const { showToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelectedItem = (id: string, items: string[], setItems: any) => {
    const values = [...items];

    if (values.includes(id)) {
      setItems(items.filter((v) => v !== id));
    } else {
      setItems([...values, id]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type; // "state" | "task"
    if (type === "state") setActiveState(active.data.current?.state || null);
    else setActiveTask(active.data.current?.task);
  };

  /**When dragging over another item */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Only handle same-type drag interactions
    if (activeType !== overType) return;

    if (activeType === "state") {
      console.log(`🧩 Dragging state ${active.id} over state ${over.id}`);
    } else if (activeType === "task") {
      console.log(`🧱 Dragging task ${active.id} over task ${over.id}`);
    }
  };

  /** When dragging ends (drop) */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveState(null);
      setActiveTask(null);
      return;
    }

    const activeType = active.data.current?.type;

    if (activeType === "state") {
      const oldIndex = localeStates.findIndex((s) => s.id === active.id);
      const newIndex = localeStates.findIndex((s) => s.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(localeStates, oldIndex, newIndex);
      setLocaleStates(reordered);

      try {
        await reorderStates(
          reordered
            .map((s: State) => s.id)
            .filter((id): id is string => Boolean(id))
        );
      } catch (err) {
        console.error("Failed to reorder states:", err);
      }
    } else if (activeType === "task") {
      const fromStateId = active.data.current?.task;
      const toStateId = over.data.current?.task;

      if (over && !over.data.current?.stateId) return;

      if (!fromStateId || !toStateId) return;

      console.log(
        `📦 Moving task ${active.id} from ${fromStateId} → ${toStateId}`
      );

      try {
        const oldIndex = localeTasks.findIndex((t) => t.id === active.id);
        const newIndex = localeTasks.findIndex((t) => t.id === over.id);

        const oldTaskStateId = active.data.current?.stateId;

        if (oldIndex === -1 || newIndex === -1) return;

        localeTasks[oldIndex].stateId = localeTasks[newIndex].stateId;

        const updatedTasks = arrayMove(localeTasks, oldIndex, newIndex);

        setLocaleTasks(updatedTasks);

        if (activeTask && fromStateId.stateId !== oldTaskStateId) {
          await editTask(activeTask.id, {
            stateId: toStateId.stateId,
          });

          showToast(
            toast_messages.tasks.edit_task_state.message,
            toast_messages.tasks.edit_task_state.title,
            "1"
          );
        }
      } catch (err) {
        console.error("Failed to move task:", err);
      }
    }

    setActiveState(null);
    setActiveTask(null);
  };

  const searchTasks = useMemo((): Task[] => {
    if (!taskQuery?.trim()) return localeTasks;
    const lowerQuery = taskQuery?.toLowerCase();
    return localeTasks.filter((task) =>
      task.title.toLowerCase().includes(lowerQuery)
    );
  }, [localeTasks, taskQuery]);

  const filteredTasks = useFilteredTasks({
    tasks: localeTasks,
    selectedUsers,
    selectedStates,
  });

  const [addTask, setAddTask] = useState(false);

  if (!isMounted) return;

  return (
    <div className="w-full pt-4">
      <div className="flex justify-center xl:justify-between gap-6 items-center flex-wrap">
        <div className="flex flex-wrap items-start gap-2 grow lg:grow-0 lg:flex-nowrap">
          <CustomSearchBar
            handleSearch={(e) => setTaskQuery(e)}
            placeholder="Recherche de tâches ..."
          />
          <Button
            variant="primary"
            className={cn("overflow-hidden rounded-3xl px-6 h-[46px] grow")}
            onClick={() => setAddTask(true)}
          >
            <ButtonText className={cn("md:text-sm text-xs text-gray-d9")}>
              Ajouter une tâche +
            </ButtonText>
          </Button>
        </div>

        <div className="flex justify-center lg:justify-between gap-4 w-[420px] lg:grow-0 grow mx-auto lg:mx-0 lg:flex-nowrap flex-wrap">
          <Filters
            type="single"
            list={tasksViewList}
            selected={viewMode.title}
            onAction={(v) => setViewMode(v)}
          />
          <Filters
            type="multiple"
            list={localeStates}
            selectedList={selectedStates}
            count={selectedStates.length}
            text="Statut"
            onAction={(v) =>
              handleSelectedItem(v, selectedStates, setSelectedStates)
            }
          />

          <Filters
            type="multiple"
            list={usersRelated}
            selectedList={selectedUsers}
            count={selectedUsers.length}
            text="Membre"
            onAction={(v) =>
              handleSelectedItem(v, selectedUsers, setSelectedUsers)
            }
          />
        </div>
      </div>

      {viewMode.value === "kanban" ? (
        <div className="py-4 w-full overflow-x-scroll mt-4">
          <div className="w-full flex items-start gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {statesIds && statesIds?.length !== 0 && (
                <SortableContext
                  items={statesIds}
                  strategy={horizontalListSortingStrategy}
                >
                  {localeStates?.map((s: State) => (
                    <StatusPanel
                      key={s.id}
                      state={s}
                      tasks={
                        taskQuery
                          ? searchTasks?.filter(
                              (t: Task) => t.stateId === s.id
                            ) || []
                          : selectedStates.length !== 0 ||
                            selectedUsers.length !== 0
                          ? filteredTasks?.filter(
                              (t: Task) => t.stateId === s.id
                            ) || []
                          : localeTasks?.filter(
                              (t: Task) => t.stateId === s.id
                            ) || []
                      }
                      setStates={setLocaleStates}
                      states={localeStates}
                      setTasks={setLocaleTasks}
                    />
                  ))}
                </SortableContext>
              )}
              {typeof window !== "undefined" &&
                createPortal(
                  <DragOverlay>
                    {activeState && (
                      <StatusPanel
                        key={activeState.id}
                        state={activeState}
                        tasks={
                          localeTasks?.filter(
                            (t: Task) => t.stateId === activeState.id
                          ) || []
                        }
                        setStates={setLocaleStates}
                        states={localeStates}
                        setTasks={setLocaleTasks}
                      />
                    )}

                    {activeTask && (
                      <TaskCard
                        viewMode={viewMode.value || "backlog"}
                        setStates={setLocaleStates}
                        setTasks={setLocaleTasks}
                        states={localeStates}
                        task={activeTask}
                      />
                    )}
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>
            <AddStatePanel setStates={setLocaleStates} />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 mt-6 lg:mt-4">
          {taskQuery
            ? searchTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  viewMode={viewMode.value || "backlog"}
                  setStates={setLocaleStates}
                  setTasks={setLocaleTasks}
                  states={localeStates}
                  task={task}
                />
              ))
            : selectedStates.length !== 0 || selectedUsers.length !== 0
            ? filteredTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  viewMode={viewMode.value || "backlog"}
                  setStates={setLocaleStates}
                  setTasks={setLocaleTasks}
                  states={localeStates}
                  task={task}
                />
              ))
            : localeTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  viewMode={viewMode.value || "backlog"}
                  setStates={setLocaleStates}
                  setTasks={setLocaleTasks}
                  states={localeStates}
                  task={task}
                />
              ))}
        </div>
      )}

      {addTask && (
        <Modal
          open={addTask}
          onClose={() => setAddTask(false)}
          className="small-box max-h-[80vh] overflow-y-auto"
        >
          <AddTask
            setAddTask={setAddTask}
            states={localeStates}
            setStates={setLocaleStates}
            tasks={localeTasks}
            setTasks={setLocaleTasks}
          />
        </Modal>
      )}
    </div>
  );
};
