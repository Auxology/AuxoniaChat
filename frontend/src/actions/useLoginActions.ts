import {axiosInstance} from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";

interface loginVariables {
    email: string;
    password: string;
}

const login = async ({email, password}: loginVariables) => {
    const response = await axiosInstance.post("/login", {email, password});
    return response.data;
}


const verifyLogin = async (code:string) => {
    const response = await axiosInstance.post('/login/verify', {
        code
    });
    return response.data;
}

const resendVerificationCode = async () => {
    const response = await axiosInstance.post('/login/resend');
    return response.data;
  };
  

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: login,
        onSuccess: ():void => {
            router.navigate({to: "/login/verify"});
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"});
            }
        },
    });
}

export const useLoginVerify = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: verifyLogin,
        onSuccess: () => {
            router.navigate({ to: '/chat' });
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 429) {
                router.navigate({ to: '/errors/429' });
            }
        }
    });
}

export const useResendCode = () => {
    return useMutation({
      mutationFn: resendVerificationCode,
      onError: (error: AxiosError) => {
        console.error('Failed to resend code:', error);
      },
    });
};