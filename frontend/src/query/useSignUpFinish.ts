import {axiosInstance} from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";

interface SignUpVariables {
    username: string;
    password: string;
}

const finishSignUp = async ({username, password}: SignUpVariables) => {
    const response = await axiosInstance.post('signup/finish', {username, password})

    return response.data
}

export const useFinishSignUp = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: finishSignUp,
        onSuccess: ():void => {
        },
        onError: (error: AxiosError) => {
            if(error.status === 429) {
                router.navigate({to: '/errors/429'})
            }
        },
    })
}