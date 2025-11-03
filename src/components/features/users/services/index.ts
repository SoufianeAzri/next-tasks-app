import axiosInstance from "@/lib/axios";
import { User } from "@/utils/types";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const res = await axiosInstance.get(`/api/v1/users`);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUser = async (user: User): Promise<User> => {
  try {
    const res = await axiosInstance.post(`/api/v1/users`, user);
    return res.data;
  } catch (error) {
    console.error("Failed to add new user:", error);
    throw error;
  }
};

export const editUser = async (id: string, user: User): Promise<User> => {
  try {
    const res = await axiosInstance.patch(`/api/v1/users/${id}`, user);
    return res.data;
  } catch (error) {
    console.error("Failed to edit user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string | undefined) => {
  try {
    await axiosInstance.delete(`/api/v1/users/${id}`);
  } catch (error) {
    throw error;
  }
};
