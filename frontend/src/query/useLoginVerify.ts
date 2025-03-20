import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "@tanstack/react-router";


const verifyLogin = async (code:string) => {
    const response = await axiosInstance.post('/login/verify', {
        code
    });
    return response.data;
}

export const useLoginVerify = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: verifyLogin,
        onSuccess: () => {
            router.navigate({ to: '/chat' });
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 429) {
                router.navigate({ to: '/errors/429' });
            }
        }
    });
}