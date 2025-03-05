import {axiosInstance} from "@/lib/axios.ts";
import {useRouter} from "@tanstack/react-router";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";


const forgotPasswordFinish = async (password: string) => {
    const response = await axiosInstance.post('/forgotPassword/finish', {password});

    return response.data;
}

export const useForgotPasswordFinish = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: forgotPasswordFinish,
        onSuccess: ():void => {
            router.navigate({to: "/login"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}