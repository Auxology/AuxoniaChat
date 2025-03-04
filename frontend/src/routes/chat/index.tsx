import {createFileRoute, redirect} from '@tanstack/react-router'
import {axiosInstance} from "@/lib/axios.ts";

export const Route = createFileRoute('/chat/')({

    beforeLoad: async () => {
        try{
            const response = await axiosInstance.post('/login/isAuthenticated');

            return response.data.isAuthenticated;
        }
        catch(error) {
            console.error(error);
            throw redirect({
                to: '/login',
                replace: true,
            })
        }
    },

    component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chat/"!</div>
}
