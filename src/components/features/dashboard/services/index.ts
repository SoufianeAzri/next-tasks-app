import axiosInstance from "@/lib/axios";

export const fetcRecentActivities = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/activities`);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/dashboard/stats`);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

