import {axiosInstance} from "@/lib/axios.ts";
import {useMutation} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {AxiosError} from "axios";

const startRecovery = async (email: string) => {
    const response = await axiosInstance.post('/recovery/new-email', {email});
    return response.data;
}

export const useRecoveryNewEmail = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: startRecovery,
        onSuccess: (): void => {
            router.navigate({to: "/recover-account/verify"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}
