import {axiosInstance} from "@/lib/axios.ts";
import {useRouter} from "@tanstack/react-router";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";

const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post('/forgotPassword/start', {email})
    return response.data
}

const forgotPasswordFinish = async (password: string) => {
    const response = await axiosInstance.post('/forgotPassword/finish', {password});

    return response.data;
}

const forgotPasswordVerify = async (code:string) => {
    const response = await axiosInstance.post('/forgotPassword/verify', {code});

    return response.data;
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