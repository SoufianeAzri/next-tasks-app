"use client";

import { Button, ButtonText, LoadingDots } from "@/components/ui/button";
import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import {
  FieldContainer,
  FieldTitle,
  InputField,
} from "@/components/ui/input-field";
import { useToast } from "@/components/ui/toast-message";
import { roles } from "@/utils/content/lists";
import { toast_messages } from "@/utils/content/messages";
import { cn } from "@/utils/helpers";
import { Role, User } from "@/utils/types";
import React, { FormEvent, useState } from "react";
import { addUser, editUser } from "../services";

interface AddUserProps {
  setAddUser?: (value: boolean) => void;
  users?: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[] | []>>;

  setEditUser?: (value: boolean) => void;

  targetUser?: User | undefined | null;
  edit?: boolean | false;
}

export const AddUser = ({
  setUsers,
  setAddUser,
  users,
  setEditUser,
  targetUser,
  edit,
}: AddUserProps) => {
  const [userData, setUserData] = useState<User>({
    name: edit && targetUser ? targetUser.name : "",
    role: edit && targetUser ? targetUser.role : "EMPLOYEE",
    email: edit && targetUser ? targetUser.email : "",
    phoneNumber: edit && targetUser ? targetUser.phoneNumber : "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (r: any) => {
    setUserData({
      ...userData,
      role: r,
    });
  };

  const { showToast } = useToast();

  const onAddUser = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (
        userData.name &&
        userData.email &&
        userData.role &&
        userData.phoneNumber
      ) {
        const newUser = await addUser(userData);

        showToast(
          toast_messages.users.add_user.message,
          toast_messages.users.add_user.title,
          "1"
        );

        setUsers((prev) => [...prev, newUser]);

        setIsLoading(false);

        setAddUser?.(false);
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);

      if (error?.response?.status === 409) {
        showToast(
          toast_messages.users.conflict_error.message,
          toast_messages.users.conflict_error.title,
          "2"
        );
      }
    }
  };

  const onEditUser = async (id: string | undefined, userData: User) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (
        id &&
        userData.name &&
        userData.email &&
        userData.role &&
        userData.phoneNumber
      ) {
        const updatedUser = await editUser(id, userData);

        setUsers((prev) =>
          prev.map((u: User) => (u.id === id ? updatedUser : u))
        );

        setIsLoading(false);

        setEditUser?.(false);

        showToast(
          toast_messages.users.edit_user.message,
          toast_messages.users.edit_user.title,
          "1"
        );
      } else {
        showToast(
          toast_messages.errors.empty_fields.message,
          toast_messages.errors.empty_fields.title,
          "2"
        );
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);

      if (error?.response?.status === 409) {
        showToast(
          toast_messages.users.conflict_error.message,
          toast_messages.users.conflict_error.title,
          "2"
        );
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (edit) {
      onEditUser(targetUser?.id, userData);
    } else {
      onAddUser();
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-3">
        <div
          className="cursor-pointer flex items-baseline gap-2"
          onClick={() => (edit ? setEditUser?.(false) : setAddUser?.(false))}
        >
          <div className="arrow rotate-90 translate-y-px" />
          <p className="text-14-500-gray">Retour</p>
        </div>
        <h2 className="text-20-700-s-black">
          {edit ? "Editer la tache" : "Ajouter la tache"}
        </h2>

        <div className="w-[70px] h-2" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FieldContainer>
          <FieldTitle>Nom</FieldTitle>
          <InputField
            id="name"
            name="name"
            placeholder="Veuillez renseigner ici le nom d'utilisateur."
            value={userData?.name}
            onChange={(e) =>
              setUserData({
                ...userData,
                [e.target.name]: e.target.value,
              })
            }
          />
        </FieldContainer>
        <FieldContainer>
          <FieldTitle>Email</FieldTitle>
          <InputField
            id="email"
            name="email"
            type="email"
            placeholder="Veuillez renseigner ici le email d'utilisateur."
            value={userData?.email}
            onChange={(e) =>
              setUserData({
                ...userData,
                [e.target.name]: e.target.value,
              })
            }
          />
        </FieldContainer>
        <FieldContainer>
          <FieldTitle>Numéro de téléphone</FieldTitle>
          <InputField
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Veuillez renseigner ici le téléphone d'utilisateur."
            value={userData?.phoneNumber}
            onChange={(e) =>
              setUserData({
                ...userData,
                [e.target.name]: e.target.value,
              })
            }
          />
        </FieldContainer>
        <FieldContainer>
          <FieldTitle>Sélectionner un rôle</FieldTitle>
          <Dropdown className="w-full" onSelect={handleSelectRole}>
            <Trigger
              className={cn(
                "flex items-center gap-2 border border-solid border-gray-d9 px-4 py-2.5 rounded-xl transition hover:scale-[1.01] active:scale-[1.02]"
              )}
            >
              <p className={cn("text-14-500-gray")}>
                {userData.role
                  ? roles.find((r) => r.value === userData?.role)?.name
                  : "Sélectionner un rôle"}
              </p>
              <Icon className="arrow" />
            </Trigger>

            <List className="w-full">
              {roles?.map((role) => (
                <Item
                  className={cn(
                    role.value === userData.role && "text-blue-main text-sm"
                  )}
                  key={role.id}
                  value={role.value}
                >
                  {role.name}
                </Item>
              ))}
            </List>
          </Dropdown>
        </FieldContainer>

        <Button
          variant="primary"
          className={cn("overflow-hidden rounded-3xl py-3 mt-3")}
          type="submit"
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <ButtonText className={cn("text-[14px] text-gray-d9")}>
              {edit ? "Modifier l'utilisateur" : "Ajouter une utilisateur"}
            </ButtonText>
          )}
        </Button>
      </form>
    </div>
  );
};
