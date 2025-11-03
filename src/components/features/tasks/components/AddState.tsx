import { Button, ButtonText, LoadingDots } from "@/components/ui/button";
import {
  FieldContainer,
  FieldTitle,
  InputField,
} from "@/components/ui/input-field";
import { cn } from "@/utils/helpers";
import { State } from "@/utils/types";
import React, { useState } from "react";
import { addState, editState } from "../services";
import { useToast } from "@/components/ui/toast-message";
import { toast_messages } from "@/utils/content/messages";

interface AddStateProps {
  setAddState?: (value: boolean) => void;
  setStates: React.Dispatch<React.SetStateAction<State[] | []>>;

  setEditState?: (value: boolean) => void;

  stateToEdit?: State | null;
  edit?: boolean;
}

export const AddState = ({
  setAddState,
  setStates,
  edit,
  setEditState,
  stateToEdit,
}: AddStateProps) => {
  const [state, setState] = useState<State>(() =>
    edit && stateToEdit
      ? stateToEdit
      : {
          name: "",
          color: "#ffffff",
        }
  );

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const addNewState = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (state.color && state.name) {
        const newState = await addState(state);

        showToast(
          toast_messages.states.add_state.message,
          toast_messages.states.add_state.title,
          "1"
        );

        setStates((prev) => [...prev, newState]);

        setIsLoading(false);

        setAddState?.(false);
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }
    } catch (error : any) {
      setIsLoading(false);
      console.log(error);

      if (error?.response?.status === 409) {
        showToast(
          toast_messages.states.conflict_error.message,
          toast_messages.states.conflict_error.title,
          "2"
        );
      }
    }
  };

  const onEditState = async (id: string | undefined, stateData: State) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (state.color && state.name && id) {
        const updatedState = await editState(id, stateData);

        console.log(updatedState);

        setStates((prev) =>
          prev.map((s: State) => {
            if (s.id === stateToEdit?.id) {
              return updatedState;
            }

            return s;
          })
        );

        setIsLoading(false);

        setEditState?.(false);

        showToast(
          toast_messages.states.edit_state.message,
          toast_messages.states.edit_state.title,
          "1"
        );
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }
    } catch (error : any) {
      setIsLoading(false);
      console.log(error);

      if (error?.response?.status === 409) {
        showToast(
          toast_messages.states.conflict_error.message,
          toast_messages.states.conflict_error.title,
          "2"
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (edit) {
      onEditState(stateToEdit?.id, state);
    } else {
      addNewState();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-3">
        <div
          className="cursor-pointer flex items-baseline gap-2"
          onClick={() => (edit ? setEditState?.(false) : setAddState?.(false))}
        >
          <div className="arrow rotate-90 translate-y-px" />
          <p className="text-14-500-gray">Retour</p>
        </div>
        <h2 className="text-20-700-s-black">
          {edit ? "Ajouter la status" : "Editer la status"}
        </h2>

        <div className="w-[70px] h-2" />
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex items-end gap-2">
          <FieldContainer className="w-[calc(100%-45px)]">
            <FieldTitle>Title</FieldTitle>
            <InputField
              id="title"
              name="title"
              placeholder="Enter a title..."
              value={state.name}
              onChange={(e) => {
                setState({
                  ...state,
                  name: e.target.value,
                });
              }}
            />
          </FieldContainer>

          <input
            className="color-styling"
            type="color"
            value={state.color}
            onChange={(e) =>
              setState({
                ...state,
                color: e.target.value,
              })
            }
          />
        </div>
        <Button
          variant="primary"
          className={cn("overflow-hidden rounded-3xl py-3 mt-3")}
          type="submit"
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <ButtonText className={cn("text-[14px] text-gray-d9")}>
              {edit ? "Editer une statut" : "Ajouter une statut"}
            </ButtonText>
          )}
        </Button>
      </form>
    </div>
  );
};
