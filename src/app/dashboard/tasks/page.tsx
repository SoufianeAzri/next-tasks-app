import { TasksManagement } from "@/components/features/tasks/components";
import {
  fetchAllUsersRelatedToTasks,
  fetchStates,
  fetchTasks,
} from "@/components/features/tasks/services";
import React from "react";

const page = async () => {
  const [tasks, states, usersRelted] = await Promise.all([
    fetchTasks(),
    fetchStates(),
    fetchAllUsersRelatedToTasks(),
  ]);

  
  return (
    <div className="w-full flex flex-col gap-4">
      <TasksManagement
        states={states}
        tasks={tasks}
        usersRelated={usersRelted}
      />
    </div>
  );
};

export default page;
