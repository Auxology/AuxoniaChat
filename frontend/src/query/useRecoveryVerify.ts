import {axiosInstance} from "@/lib/axios.ts";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";


const recoveryVerifyNewEmail = async (code: string) => {
    const response = await axiosInstance.post('/recovery/new-email/verify', {code});
    return response.data;
}

export const useRecoveryVerify = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: recoveryVerifyNewEmail,
        onSuccess: (): void => {
            router.navigate({to: "/recover-account/finish"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}