// Start Sign up function
import {axiosInstance} from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";

const startSignUp = async (email:string) => {
    const response = await axiosInstance.post('signup/start', {email})
    return response.data
};

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
