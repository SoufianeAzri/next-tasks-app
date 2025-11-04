import { DatePicker } from "@/components/ui/date-pikcer";
import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import {
  FieldContainer,
  FieldTitle,
  InputField,
  TextareaField,
} from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast-message";
import { Periorite, State, Subtask, Task, User } from "@/utils/types";
import React, { FormEvent, useState } from "react";
import { AddState } from "./AddState";
import {
  Button,
  ButtonIcon,
  ButtonText,
  LoadingDots,
} from "@/components/ui/button";
import { areIdArraysEqual, cn } from "@/utils/helpers";
import { UsersSearch } from "./UsersSearch";
import { addTask, deleteState, editTask } from "../services";
import { toast_messages } from "@/utils/content/messages";
import { periorities } from "@/utils/content/lists";

interface AddTaskProps {
  setAddTask?: (value: boolean) => void;
  states: State[];
  setStates: React.Dispatch<React.SetStateAction<State[] | []>>;

  targetState?: State | undefined | null;

  tasks?: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[] | []>>;

  task?: Task | undefined;
  setEditTask?: (value: boolean) => void | undefined;
  edit?: boolean | false;
}

export const AddTask = ({
  setAddTask,
  states,
  setStates,
  targetState,
  tasks,
  setTasks,
  task,
  setEditTask,
  edit = false,
}: AddTaskProps) => {
  const [title, setTitle] = useState(edit && task ? task.title : "");

  const [description, setDescription] = useState(
    edit && task ? task.description : ""
  );

  const initialStartDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const [startDate, setStartDate] = useState<Date | null>(
    edit && task ? new Date(task.beginDate) : initialStartDate
  );
  const [endDate, setEndDate] = useState<Date | null>(
    edit && task ? new Date(task.finishDate) : null
  );

  const [periorite, setPeriorite] = useState<Periorite | null>(
    edit && task
      ? periorities.find((p: Periorite) => p.periorite === task?.periorite) ??
          null
      : null
  );

  const [stateSelected, setStateSelected] = useState<State | null>(
    edit && task && task.state ? task.state : targetState ? targetState : null
  );

  const [manager, setManager] = useState<User[]>(
    edit && task && task.manager ? [task.manager] : []
  );

  const [teamMembers, setTeamMembers] = useState<User[]>(
    edit && task && task.teamMembers && task.teamMembers.length !== 0
      ? task.teamMembers
      : []
  );

  const [addState, setAddState] = useState(false);

  const [editState, setEditState] = useState(false);

  const [stateToEdit, setStateToEdit] = useState<State | null>(null);

  const handleSelectState = (state: State) => {
    setStateSelected(state);
  };

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const onAddTask = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (title && description && startDate && endDate && manager) {
        // checking if the starting date higher than today
        if (startDate >= initialStartDate) {
          // checking if the ending date is higher than today
          if (endDate > startDate) {
            endDate.setHours(23, 59, 59, 0);
            const task: Task = {
              title: title,
              description: description,
              beginDate: startDate?.toISOString() ?? "",
              finishDate: endDate?.toISOString() ?? "",
              stateId: stateSelected?.id ?? null,
              managerId: manager[0]?.id ?? null,
              periorite: periorite?.periorite ?? "BAS",
              teamMembersIds:
                teamMembers
                  .map((m: User) => m.id)
                  .filter((id): id is string => Boolean(id)) || [],
            };

            const res = await addTask(task);
            // console.log(res);

            setTasks((prev) => [...prev, res]);

            setAddTask?.(false);

            showToast(
              toast_messages.tasks.add_task.message,
              toast_messages.tasks.add_task.title,
              "1"
            );
          } else {
            showToast(
              toast_messages.dates_errors.end_date.message,
              toast_messages.dates_errors.end_date.title,
              "2"
            );
          }
        } else {
          showToast(
            toast_messages.dates_errors.start_date.message,
            toast_messages.dates_errors.start_date.title,
            "2"
          );
        }
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    }
  };

  const onEditTask = async () => {
    if (!task?.id) return;
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (title && description && startDate && endDate && manager) {
        // checking if the ending date is higher than today
        if (endDate > startDate) {
          // add one 23 hours to the day to cover all the day
          if (task.finishDate !== endDate?.toISOString())
            endDate.setHours(23, 59, 59, 0);

          const teamIds =
            teamMembers
              .map((m: User) => m.id)
              .filter((id): id is string => Boolean(id)) || [];
          const currentTaskTeamIds =
            task.teamMembers
              ?.map((m: User) => m.id)
              .filter((id): id is string => Boolean(id)) || [];

          const taskData: Partial<Task> = {
            ...(task.title !== title && { title: title }),
            ...(task.description !== description && {
              description: description,
            }),
            ...(task.beginDate !== startDate?.toISOString() && {
              beginDate: startDate?.toISOString() ?? "",
            }),
            ...(task.finishDate !== endDate?.toISOString() && {
              finishDate: endDate?.toISOString() ?? "",
            }),
            ...(task.stateId !== stateSelected?.id && {
              stateId: stateSelected?.id ?? null,
            }),
            ...(task.managerId !== manager[0]?.id && {
              managerId: manager[0]?.id ?? null,
            }),
            ...(task.periorite !== periorite?.periorite && {
              periorite: periorite?.periorite ?? "BAS",
            }),
            ...(!areIdArraysEqual(currentTaskTeamIds, teamIds) && {
              teamMembersIds: teamIds,
            }),
          };

          // ensure send the request only when we have data
          if (Object.keys(taskData).length !== 0) {
            const res = await editTask(task.id, taskData);

            setTasks((prev) =>
              prev.map((t: Task) =>
                t?.id === task.id
                  ? {
                      ...t,
                      ...res,
                    }
                  : t
              )
            );

            setEditTask?.(false);

            showToast(
              toast_messages.tasks.edit_task.message,
              toast_messages.tasks.edit_task.title,
              "1"
            );
          }
        } else {
          showToast(
            toast_messages.dates_errors.end_date.message,
            toast_messages.dates_errors.end_date.title,
            "2"
          );
        }
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    }
  };

  const onDeleteState = async (state: State) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await deleteState(state);

      setStates(states.filter((s: State) => s.id !== state.id));

      setIsLoading(false);

      showToast(
        toast_messages.states.delete_state.message,
        toast_messages.states.delete_state.title,
        "1"
      );
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);

      if (error?.status === 403) {
        showToast(
          toast_messages.states.delete_state_error.message,
          toast_messages.states.delete_state_error.title,
          "2"
        );
      }
    }
  };

  const checkUserInSubtasks = (
    userId: string,
    subtasks: Subtask[] | undefined
  ): boolean => {
    if (!userId || subtasks?.length === 0 || !Array.isArray(subtasks))
      return false;

    // check if the user is manager of any subtask
    const isManager = subtasks.some((st) => st.managerId === userId);

    // check if the user is in any subtask team
    const isTeamMember = subtasks.some((st) =>
      st.teamMembers?.some((member) => member.id === userId)
    );

    return isManager || isTeamMember;
  };

  const onDeleteUser = (userId: string) => {
    const IsUserInSubtaks = checkUserInSubtasks(userId, task?.subtasks);

    if (IsUserInSubtaks) {
      showToast(
        toast_messages.tasks.delete_member_error.message,
        toast_messages.tasks.delete_member_error.title,
        "2"
      );
      return;
    } else {
      setTeamMembers(teamMembers.filter((t: User) => t.id !== userId));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (edit) {
      onEditTask();
    } else {
      onAddTask();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center mb-3">
          <div
            className="cursor-pointer flex items-baseline gap-2"
            onClick={() => (edit ? setEditTask?.(false) : setAddTask?.(false))}
          >
            <div className="arrow rotate-90 translate-y-px" />
            <p className="text-14-500-gray">Retour</p>
          </div>
          <h2 className="text-20-700-s-black">
            {edit ? "Modifier la tâche" : "Ajouter une tâche"}
          </h2>

          <div className="w-[70px] h-2" />
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <FieldContainer>
            <FieldTitle>Intitulé</FieldTitle>
            <InputField
              id="title"
              name="title"
              placeholder="Veuillez renseigner ici l'intitulé de la tâche."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FieldContainer>

          <FieldContainer>
            <FieldTitle>Description</FieldTitle>
            <TextareaField
              id="description"
              name="description"
              placeholder="Veuillez renseigner ici la description de la tâche."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FieldContainer>

          <div className="w-full flex items-center gap-2 z-4">
            <FieldContainer className="w-1/2">
              <FieldTitle>Date de début</FieldTitle>
              <DatePicker
                date={startDate}
                onChangeAction={setStartDate}
                placeholder="Date de début"
              />
            </FieldContainer>
            <FieldContainer className="w-1/2">
              <FieldTitle>Date de fin</FieldTitle>
              <DatePicker
                date={endDate}
                onChangeAction={setEndDate}
                placeholder="Date de fin"
              />
            </FieldContainer>
          </div>

          <FieldContainer>
            <FieldTitle>Sélectionner la périorite</FieldTitle>
            <Dropdown className="w-full" onSelect={setPeriorite}>
              <Trigger
                className={cn(
                  "flex items-center gap-2 border border-solid border-gray-d9 px-4 py-2.5 rounded-xl transition hover:scale-[1.01] active:scale-[1.02]"
                )}
                style={{
                  backgroundColor: periorite?.color ?? undefined,
                }}
              >
                <p
                  className={cn(
                    "text-14-500-gray",
                    periorite && "text-white text-sm"
                  )}
                >
                  {periorite ? periorite.periorite : "Sélectionner la périorite"}
                </p>
                <Icon className="arrow" />
              </Trigger>

              <List className="w-full">
                {periorities?.map((p: Periorite) => (
                  <Item key={p._id} value={p}>
                    {p.value}
                  </Item>
                ))}
              </List>
            </Dropdown>
          </FieldContainer>

          <FieldContainer>
            <FieldTitle>Sélectionner statut</FieldTitle>
            <div className="flex items-center gap-2">
              <Dropdown className="w-[calc(100%-45px)]" onSelect={() => {}}>
                <Trigger className="flex items-center gap-2 border border-solid border-gray-d9 px-4 py-2.5 rounded-xl transition hover:scale-[1.01] active:scale-[1.02]">
                  <p className="text-14-500-gray">
                    {stateSelected ? stateSelected.name : "Sélectionner statut"}
                  </p>
                  <Icon className="arrow" />
                </Trigger>

                <List className="w-full">
                  {states?.map((s: State) => (
                    <Item
                      key={s.id}
                      value={s}
                      className={cn("flex py-0 justify-between items-center")}
                    >
                      <p
                        onClick={() => handleSelectState(s)}
                        className={cn(
                          "py-3 w-[calc(100%-60px)] h-full",
                          stateSelected?.id === s.id && "text-blue-main text-sm"
                        )}
                      >
                        {s.name}
                      </p>
                      <div className="py-3 flex items-center gap-2">
                        <div
                          className="edit cursor-pointer"
                          onClick={() => {
                            setStateToEdit(s);
                            setEditState(true);
                          }}
                        />
                        <div
                          className="trash cursor-pointer"
                          onClick={() => onDeleteState(s)}
                        />
                      </div>
                    </Item>
                  ))}
                </List>
              </Dropdown>

              <Button
                variant="rounded"
                type="button"
                onClick={() => setAddState(true)}
              >
                <ButtonIcon className="plus brightness-0 invert-60" />
              </Button>
            </div>
          </FieldContainer>

          <UsersSearch
            title="Sélectionnez un responsable"
            placeholder="Recherche de responsable."
            selectedUsers={manager}
            setSelectedUsers={setManager}
            type="single"
          />

          <UsersSearch
            title="Sélectionnez de team Members"
            placeholder="Recherche de membre."
            selectedUsers={teamMembers}
            setSelectedUsers={setTeamMembers}
            customDeleteUser={edit ? onDeleteUser : undefined}
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
                {edit ? "Modifier la tache" : "Ajouter une tashe"}
              </ButtonText>
            )}
          </Button>
        </form>
      </div>

      {addState && (
        <Modal
          open={addState}
          onClose={() => setAddState(false)}
          className="very-small-box"
        >
          <AddState setAddState={setAddState} setStates={setStates} />
        </Modal>
      )}

      {editState && (
        <Modal
          open={editState}
          onClose={() => setEditState(false)}
          className="very-small-box"
        >
          <AddState
            setEditState={setEditState}
            setStates={setStates}
            stateToEdit={stateToEdit}
            edit={true}
          />
        </Modal>
      )}
    </>
  );
};
