import {axiosInstance} from "@/lib/axios.ts";
import {useMutation} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {AxiosError} from "axios";


const startRecovery = async (recoveryCode: string) => {
    const response = await axiosInstance.post('/recovery/start', {recoveryCode});
    return response.data;
}

export const useRecovery = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: startRecovery,
        onSuccess: (): void => {
            router.navigate({to: "/recover-account/new-email"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}