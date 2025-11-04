"use client";

import { cn } from "@/utils/helpers";
import React, { FormEvent, useRef, useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { FieldContainer, InputField } from "@/components/ui/input-field";
import { State } from "@/utils/types";
import { addState } from "../services";
import { toast_messages } from "@/utils/content/messages";
import { useToast } from "@/components/ui/toast-message";

interface AddStatePanelProps {
  setStates: React.Dispatch<React.SetStateAction<State[] | []>>;
}

export const AddStatePanel = ({ setStates }: AddStatePanelProps) => {
  const [openAddState, setOpenAddState] = useState(false);
  const addStateRef = useRef<HTMLFormElement | null>(null);

  const [state, setState] = useState<State>({
    name: "",
    color: "#ffffff",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  useClickOutside(addStateRef, () => {
    if (openAddState) setOpenAddState(false);
  });

  const addNewState = async (e : FormEvent) => {
    e.preventDefault();
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

        setOpenAddState(false);

        setIsLoading(false);
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

  return (
    <div className="max-h-[84vh] hover:overflow-y-scroll overflow-y-hidden min-w-[450px]">
      <div className="relative flex flex-col gap-3 px-4 pb-4 transition bg-white rounded-2xl">
        {openAddState ? (
          <form
            ref={addStateRef}
            className="flex flex-col gap-3"
            onSubmit={addNewState}
          >
            <div className="flex items-center gap-2 mt-2">
              <FieldContainer className="w-[calc(100%-45px)] my-2">
                <InputField
                  id="title"
                  name="title"
                  placeholder="Veuillez renseigner ici l'intitulé de la tâche."
                  value={state?.name}
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
                value={state?.color}
                onChange={(e) =>
                  setState({
                    ...state,
                    color: e.target.value,
                  })
                }
              />
            </div>
          </form>
        ) : (
          <div
            className="sticky top-0 flex justify-start items-center gap-3 z-3 bg-white h-10 cursor-pointer"
            onClick={() => setOpenAddState(true)}
          >
            <div className="w-2 h-2 rounded-full bg-main-gray" />
            <p className={cn("text-[14px] font-medium text-main-gray")}>
              intitulé
            </p>
          </div>
        )}
        <Button
          variant="dashed"
          className={cn("overflow-hidden rounded-3xl py-3")}
        >
          <ButtonText className={cn("text-12-500-main-gray")}>
            Ajouter une tâche +
          </ButtonText>
        </Button>
      </div>
    </div>
  );
};
