import {axiosInstance} from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "@tanstack/react-router";

interface loginVariables {
    email: string;
    password: string;
}

const login = async ({email, password}: loginVariables) => {
    const response = await axiosInstance.post("/login", {email, password});
    return response.data;
}

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: login,
        onSuccess: ():void => {
            router.navigate({to: "/chat"});
        },
        onError: (error: AxiosError):void => {
            if(error.response?.status === 429) {
                router.navigate({to: "/errors/429"});
            }
        },
    });
}