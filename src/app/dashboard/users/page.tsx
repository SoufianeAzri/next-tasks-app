import { UsersManagement } from "@/components/features/users/components";
import { fetchUsers } from "@/components/features/users/services";
import React from "react";

const page = async () => {
  const users = await fetchUsers();
  return (
    <div className="w-full flex flex-col gap-4">
      <UsersManagement users={users} />
    </div>
  );
};

export default page;
