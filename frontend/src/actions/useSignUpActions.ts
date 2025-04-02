// Start Sign up function
import {axiosInstance} from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";

interface SignUpVariables {
    username: string;
    password: string;
}

const startSignUp = async (email:string) => {
    const response = await axiosInstance.post('signup/start', {email})
    return response.data
};

const signUpVerifyEmail = async (code: string)=> {
    const response = await axiosInstance.post('signup/verify', {code})
    return response.data
}

const finishSignUp = async ({username, password}: SignUpVariables) => {
    const response = await axiosInstance.post('signup/finish', {username, password})

    return response.data
}

export const useStartSignUp = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: startSignUp,
        onSuccess: ():void => {
            router.navigate({to: "/sign-up/verify"})
        },
        onError: (error: AxiosError) => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"})
            }
        },
    })
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

export const useFinishSignUp = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: finishSignUp,
        onSuccess: ():void => {
        },
        onError: (error: AxiosError) => {
            if(error.response?.status === 429) {
                router.navigate({to: '/errors/429'})
            }
        },
    })
}