import {axiosInstance} from "@/lib/axios.ts";
import {useRouter} from "@tanstack/react-router";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";

const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post('/forgotPassword/start', {email})
    return response.data
}

export const useForgotPassword = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (): void => {
            router.navigate({to: "/forgot-password/verify"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}