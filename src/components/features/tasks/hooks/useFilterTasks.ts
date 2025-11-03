import { useMemo } from "react";
import { Task } from "@/utils/types";

interface FilterParams {
  tasks: Task[];
  selectedUsers?: string[];
  selectedStates?: string[];
}

export function useFilteredTasks({
  tasks,
  selectedUsers = [],
  selectedStates = [],
}: FilterParams) {
  return useMemo(() => {
    if (tasks?.length === 0) return [];

    return tasks?.filter((task) => {
      // State check and filter
      const matchesState =
        selectedStates.length === 0 ||
        (task.stateId && selectedStates.includes(task.stateId));

      // Member check and filter (manager or team member)
      const matchesMember =
        selectedUsers.length === 0 ||
        (task.managerId && selectedUsers.includes(task.managerId)) ||
        task.teamMembers?.some(
          (member) => member.id && selectedUsers.includes(member.id)
        );

      return matchesState && matchesMember;
    });
  }, [tasks, selectedUsers, selectedStates]);
}
