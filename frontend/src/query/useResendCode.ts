import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const resendVerificationCode = async () => {
  const response = await axiosInstance.post('/login/resend');
  return response.data;
};

export const useResendCode = () => {
  return useMutation({
    mutationFn: resendVerificationCode,
    onError: (error: AxiosError) => {
      console.error('Failed to resend code:', error);
    },
  });
};