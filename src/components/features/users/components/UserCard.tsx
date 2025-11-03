"use client";

import { Card } from "@/components/ui/card";
import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import { Modal } from "@/components/ui/modal";
import { Profile } from "@/components/ui/profile";
import { roles } from "@/utils/content/lists";
import { formatDate } from "@/utils/helpers";
import { User } from "@/utils/types";
import React, { useState } from "react";
import { AddUser } from "./AddUser";
import { useToast } from "@/components/ui/toast-message";
import { toast_messages } from "@/utils/content/messages";
import { deleteUser } from "../services";

interface UserCardProps {
  user: User;

  setUsers: React.Dispatch<React.SetStateAction<User[] | []>>;
}

export const UserCard = ({ user, setUsers }: UserCardProps) => {
  const [editUser, setEditUser] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const onDeleteUser = async (userId: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await deleteUser(userId);

      setUsers((prev) => prev.filter((u: User) => u.id !== user.id));

      showToast(
        toast_messages.users.delete_user.message,
        toast_messages.users.delete_user.title,
        "1"
      );

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);

      if (error.response.status === 403) {
        showToast(
          toast_messages.users.delte_error.message,
          toast_messages.users.delte_error.title,
          "2"
        );
      }
    }
  };

  return (
    <>
      <Card className="w-full md:flex hidden items-start gap-4 px-4 py-3 r-10 border border-solid border-gray-very-light bg-transparent shadow-none">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-12 w-[calc(100%-10px)]">
            <div className="flex items-center gap-3 xl:w-[250px] sm:w-[20%]">
              <Profile size={48} name={user.name} email={user.email} />
              <div className="flex flex-col gap-0.5">
                <h5 className="text-12-500-s-gray">
                  {formatDate(user.addedDate)}
                </h5>
                <p className="text-16-500-black">{user?.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 xl:w-[200px] sm:w-[20%]">
              <h5 className="text-12-500-s-gray">Email</h5>
              <p className="text-16-500-s-black">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2 xl:w-[200px] sm:w-[20%]">
              <h5 className="text-12-500-s-gray">Phone number</h5>
              <p className="text-16-500-s-black">{user?.phoneNumber}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-12-500-s-gray py-1 px-2 bg-gray-very-light r-10">
                {roles.find((r) => r.value === user?.role)?.name}
              </p>
            </div>
          </div>

          <Dropdown className="ml-2">
            <Trigger className="">
              <Icon className="details" />
            </Trigger>

            <List className="min-w-20 right-3 top-1">
              <Item
                className="text-12-500-s-gray"
                onClick={() => setEditUser(true)}
              >
                Edit
              </Item>
              <Item
                className="text-12-500-red-main"
                onClick={() => {
                  if (user.id) onDeleteUser(user.id);
                }}
              >
                Delete
              </Item>
            </List>
          </Dropdown>
        </div>
      </Card>

      <Card className="w-full md:hidden flex gap-4 px-4 py-3 r-10 border border-solid border-gray-very-light bg-transparent shadow-none">
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Profile size={48} name={user.name} email={user.email} />
              <div className="flex flex-col gap-0.5">
                <h5 className="text-12-500-s-gray">
                  {formatDate(user.addedDate)}
                </h5>
                <p className="text-16-500-black">{user?.name}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-12-500-s-gray py-1 px-2 bg-gray-very-light r-10">
                {roles.find((r) => r.value === user?.role)?.name}
              </p>
            </div>

            <Dropdown className="ml-2">
              <Trigger className="">
                <Icon className="details" />
              </Trigger>

              <List className="min-w-20 right-3 top-1">
                <Item
                  className="text-12-500-s-gray"
                  onClick={() => setEditUser(true)}
                >
                  Edit
                </Item>
                <Item
                  className="text-12-500-red-main"
                  onClick={() => {
                    if (user.id) onDeleteUser(user.id);
                  }}
                >
                  Delete
                </Item>
              </List>
            </Dropdown>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2 xl:w-[200px] sm:w-[20%]">
              <h5 className="text-12-500-s-gray">Email</h5>
              <p className="text-16-500-s-black">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2 xl:w-[200px] sm:w-[20%]">
              <h5 className="text-12-500-s-gray">Phone number</h5>
              <p className="text-16-500-s-black">{user?.phoneNumber}</p>
            </div>
          </div>
        </div>
      </Card>

      {editUser && (
        <Modal
          open={editUser}
          onClose={() => setEditUser(false)}
          className="small-box overflow-y-visible"
        >
          <AddUser
            setEditUser={setEditUser}
            setUsers={setUsers}
            edit={true}
            targetUser={user}
          />
        </Modal>
      )}
    </>
  );
};
