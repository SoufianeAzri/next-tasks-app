import React, { use, useEffect, useState } from "react";
import { searchUsers } from "../services";
import {
  FieldContainer,
  FieldTitle,
  InputField,
} from "@/components/ui/input-field";
import { CustomItem, ItemsList } from "@/components/ui/list";
import { User } from "@/utils/types";
import { Profile } from "@/components/ui/profile";

interface UsersSearch {
  title: string;
  placeholder?: string;
  selectedUsers: User[] | [];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[] | []>>;
  type?: "single" | "multiple";
  mode?: "online" | "offline";
  defaultList?: User[] | [];

  customDeleteUser?: (u: string) => void;
}

export const UsersSearch = ({
  title,
  placeholder,
  selectedUsers,
  setSelectedUsers,
  type = "multiple",
  mode = "online",
  defaultList,
  customDeleteUser,
}: UsersSearch) => {
  const [keyword, setKeyword] = useState("");
  const [localeUsers, setLocaleUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!keyword) {
      setLocaleUsers([]);
      return;
    }
    let timer = setTimeout(async () => {
      try {
        let res: User[] = [];

        // if we already have an users array so we used it else we search for users by endpoint
        if (mode === "online") {
          res = await searchUsers(keyword);
        } else {
          const lowerQuery = keyword?.toLowerCase();
          if (defaultList) {
            res = defaultList.filter((user) =>
              user.name.toLowerCase().includes(lowerQuery)
            ) || [];
          } else {
            res = [];
          }
        }

        if (res.length !== 0) {
          const selectedUsersIds =
            selectedUsers?.length !== 0
              ? selectedUsers.map((u: User) => u.id)
              : [];
          setLocaleUsers(
            res.filter((u: User) => !selectedUsersIds.includes(u.id))
          );
        }
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  const handleSelectUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setLocaleUsers([]);
    setKeyword("");
  };

  const handleDeleteUser = (id: string) => {
    const users = selectedUsers.filter((u: User) => u.id !== id);
    setSelectedUsers(users);
  };

  const disableField = type === "single" && selectedUsers.length !== 0;

  return (
    <div className="flex flex-col gap-2">
      <FieldContainer className="relative">
        <FieldTitle>{title}</FieldTitle>
        <InputField
          placeholder={placeholder}
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          disabled={disableField}
        />
        <ItemsList className="w-full top-16">
          {localeUsers?.map((user: User) => (
            <CustomItem
              key={user.id}
              className="flex items-center gap-2.5 py-3 px-3"
              value={user}
              handleClick={() => handleSelectUser(user)}
            >
              <Profile name={user.name} email={user.email} size={32} />
              <div>
                <p className="text-12-500-s-black">{user.name}</p>
                <p className="text-12-500-main-gray">{user.email}</p>
              </div>
            </CustomItem>
          ))}
        </ItemsList>
      </FieldContainer>

      {selectedUsers?.length !== 0 && (
        <ItemsList className="w-full relative flex flex-col gap-2 bg-transparent! z-[1]">
          {selectedUsers?.map((user: User) => (
            <CustomItem
              key={user.id}
              className="flex justify-between cursor-default hover:bg-transparent! border border-gray-d9 border-dashed r-10 items-center py-3 px-3"
              value={user}
            >
              <div className="flex items-center gap-2.5">
                <Profile name={user.name} email={user.email} size={32} />
                <div>
                  <p className="text-12-500-s-black">{user.name}</p>
                  <p className="text-12-500-main-gray">{user.email}</p>
                </div>
              </div>

              <div
                className="trash cursor-pointer"
                onClick={() => {
                  if (user.id) {
                    if (!customDeleteUser) handleDeleteUser(user?.id);
                    else customDeleteUser(user.id);
                  }
                }}
              />
            </CustomItem>
          ))}
        </ItemsList>
      )}
    </div>
  );
};
