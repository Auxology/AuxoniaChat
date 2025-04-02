import {axiosInstance} from "@/lib/axios.ts";
import {useMutation} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {AxiosError} from "axios";


const startRecovery = async (recoveryCode: string) => {
    const response = await axiosInstance.post('/recovery/start', {recoveryCode});
    return response.data;
}

const newEmail = async (email: string) => {
    const response = await axiosInstance.post('/recovery/new-email', {email});
    return response.data;
}

const recoveryFinish = async (password: string) => {
    const response = await axiosInstance.post('/recovery/finish', {password})
    return response.data
}

const recoveryVerifyNewEmail = async (code: string) => {
    const response = await axiosInstance.post('/recovery/new-email/verify', {code});
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


export const useRecoveryNewEmail = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: newEmail,
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
