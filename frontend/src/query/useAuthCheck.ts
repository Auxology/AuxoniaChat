import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useAuthCheck = () => {
  return useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/login/isAuthenticated')
        console.log(response.data)
        return response.data;
      } catch (error) {
        return false;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};