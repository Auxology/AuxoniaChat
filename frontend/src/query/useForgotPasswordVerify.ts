import {axiosInstance} from "@/lib/axios.ts";
import {useRouter} from "@tanstack/react-router";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";

const forgotPasswordVerify = async (code:string) => {
    const response = await axiosInstance.post('/forgotPassword/verify', {code});

    return response.data;
}

export const useForgotPasswordVerify = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: forgotPasswordVerify,
        onSuccess: ():void => {
            router.navigate({to: "/forgot-password/finish"})
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
}