import {axiosInstance} from "@/lib/axios.ts";
import {useMutation} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {AxiosError} from "axios";

const recoveryFinish = async (password: string) => {
    const response = await axiosInstance.post('/recovery/finish', {password})
    return response.data
}

export const useRecoveryFinish = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: recoveryFinish,
        onSuccess: (): void => {
            router.navigate({to: "/login"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}