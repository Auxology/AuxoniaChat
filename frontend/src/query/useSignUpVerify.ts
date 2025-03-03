import {axiosInstance} from "@/lib/axios.ts";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const signUpVerifyEmail = async (code: string)=> {
    const response = await axiosInstance.post('signup/verify', {code})
    return response.data
}

export const useSignUpVerify = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: signUpVerifyEmail,
        onSuccess: ():void => {
            router.navigate({to: "/sign-up/finish"})
        },
        onError: (error: AxiosError) => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}