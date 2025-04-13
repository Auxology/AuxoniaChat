import { axiosInstance } from "@/lib/axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";

// API functions
const requestPasswordChange = async (): Promise<void> => {
  await axiosInstance.post('/user/security/request-password-change');
};

const verifyPasswordChangeCode = async (code: string): Promise<void> => {
  await axiosInstance.post('/user/security/verify-password-change', { code });
};

const completePasswordChange = async (password: string): Promise<void> => {
  await axiosInstance.post('/user/security/complete-password-change', { password });
};

const requestEmailChange = async (email: string): Promise<void> => {
  await axiosInstance.post('/user/security/request-email-change', { email });
};

const verifyEmailChangeCode = async (code: string): Promise<void> => {
  await axiosInstance.post('/user/security/verify-email-change', { code });
};

const updateUsername = async (username: string): Promise<void> => {
  await axiosInstance.post('/user/profile/username', { username });
};


// Mutations hooks
export const useRequestPasswordChange = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: requestPasswordChange,
    onSuccess,
    onError: () => {
      toast.error("Failed to request password change", {
        description: "Please try again later"
      });
    }
  });
};

export const useVerifyPasswordCode = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: verifyPasswordChangeCode,
    onSuccess,
    onError: () => {
      toast.error("Invalid verification code", {
        description: "Please check your code and try again"
      });
    }
  });
};

export const useCompletePasswordChange = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: completePasswordChange,
    onSuccess,
    onError: () => {
      toast.error("Failed to change password", {
        description: "Please try again later"
      });
    }
  });
};

export const useRequestEmailChange = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: requestEmailChange,
    onSuccess,
    onError: () => {
      toast.error("Failed to request email change", {
        description: "This email may already be in use or is invalid"
      });
    }
  });
};

export const useVerifyEmailCode = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: verifyEmailChangeCode,
    onSuccess,
    onError: () => {
      toast.error("Invalid verification code", {
        description: "Please check your code and try again"
      });
    }
  });
};

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      toast.success("Username updated successfully");
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      toast.error("Failed to update username", {
        description: "Please try again"
      });
    }
  })
}