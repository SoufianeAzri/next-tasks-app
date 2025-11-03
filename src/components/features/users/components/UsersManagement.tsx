"use client";

import React, { useMemo, useState } from "react";
import { CustomSearchBar } from "../../CustomSearchBar";
import { Button, ButtonText } from "@/components/ui/button";
import { cn } from "@/utils/helpers";
import { User } from "@/utils/types";
import { UserCard } from "./UserCard";
import { Modal } from "@/components/ui/modal";
import { AddUser } from "./AddUser";

interface UsersManagementProps {
  users: User[] | [];
}

export const UsersManagement = ({ users }: UsersManagementProps) => {
  const [localeUsers, setLocaleUsers] = useState<User[] | []>(users);
  const [usersQuery, setUsersQuery] = useState("");

  const [addUser, setAddUser] = useState(false);

  const searchUsers = useMemo((): User[] => {
    if (!usersQuery?.trim()) return localeUsers;
    const lowerQuery = usersQuery?.toLowerCase();
    return localeUsers.filter((user) =>
      user.name.toLowerCase().includes(lowerQuery)
    );
  }, [localeUsers, usersQuery]);

  return (
    <div className="w-full pt-4">
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-2">
            <CustomSearchBar
              placeholder="Search for users ..."
              handleSearch={(e) => setUsersQuery(e)}
            />
            <Button
              variant="primary"
              className={cn("overflow-hidden rounded-3xl px-6 h-[46px] w-[210px]")}
              onClick={() => setAddUser(true)}
            >
              <ButtonText className={cn("text-[14px] text-gray-d9")}>
                Ajouter une utilisteur +
              </ButtonText>
            </Button>
          </div>

          <div className="flex gap-4">
            {/* <Filters
                type="multiple"
                list={localeStates}
                selectedList={selectedStates}
                count={selectedStates.length}
                text="States"
                onAction={(v) =>
                  handleSelectedItem(v, selectedStates, setSelectedStates)
                }
              /> */}
          </div>
        </div>

        {localeUsers?.length !== 0 && (
          <div className="flex flex-col gap-3 mt-3">
            {!usersQuery
              ? localeUsers.map((user: User) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    setUsers={setLocaleUsers}
                  />
                ))
              : searchUsers.map((user: User) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    setUsers={setLocaleUsers}
                  />
                ))}
          </div>
        )}
      </div>

      {addUser && (
        <Modal
          open={addUser}
          onClose={() => setAddUser(false)}
          className="small-box overflow-y-visible"
        >
          <AddUser
            setAddUser={setAddUser}
            setUsers={setLocaleUsers}
            users={localeUsers}
          />
        </Modal>
      )}
    </div>
  );
};
