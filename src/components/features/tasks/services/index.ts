import axiosInstance from "@/lib/axios";
import { State, Subtask, Task } from "@/utils/types";

export const fetchAllUsersRelatedToTasks = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/users/related-to-tasks`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTasks = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/tasks`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchStates = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/states`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addState = async (state: State): Promise<State> => {
  try {
    const res = await axiosInstance.post(`/api/v1/states`, state);
    return res.data;
  } catch (error) {
    console.error("Failed to add state:", error);
    throw error;
  }
};

export const editState = async (id: string, state: State): Promise<State> => {
  try {
    const res = await axiosInstance.put(`/api/v1/states/${id}`, state);
    return res.data;
  } catch (error) {
    console.error("Failed to edit state:", error);
    throw error;
  }
};

export const deleteState = async (state: State): Promise<State> => {
  try {
    const res = await axiosInstance.delete(`/api/v1/states/${state.id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to add state:", error);
    throw error;
  }
};

export const reorderStates = async (statesIds: string[] | []) => {
  try {
    const res = await axiosInstance.patch(`/api/v1/states/reorder`, {
      statesIds: statesIds,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to add state:", error);
    throw error;
  }
};

export const searchUsers = async (keyword: string) => {
  try {
    const res = await axiosInstance.get(`/api/v1/users/search?name=${keyword}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addTask = async (task: Task) => {
  try {
    const res = await axiosInstance.post(`/api/v1/tasks`, task);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const editTask = async (id: string | undefined, task: Partial<Task>) => {
  try {
    const res = await axiosInstance.put(`/api/v1/tasks/${id}`, task);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: string | undefined) => {
  try {
    await axiosInstance.delete(`/api/v1/tasks/${id}`);
  } catch (error) {
    throw error;
  }
};

export const addSubtask = async (taskId: string, subtask: Subtask) => {
  try {
    const res = await axiosInstance.post(`/api/v1/subtasks`, subtask);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changeSubtaskStatus = async (
  id: string | undefined,
  status: boolean
) => {
  try {
    const res = await axiosInstance.patch(`/api/v1/subtasks/${id}/status`, {
      status: status,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubtask = async (id: string | undefined) => {
  try {
    await axiosInstance.delete(`/api/v1/subtasks/${id}`);
  } catch (error) {
    throw error;
  }
};
