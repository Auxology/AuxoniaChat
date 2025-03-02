import { createFileRoute, redirect } from '@tanstack/react-router'
import { axiosInstance } from "@/lib/axios.ts";

// Define the loader data type
type LoaderData = {
    email: string;
};

export const Route = createFileRoute('/sign-up/verify')({
    // Specify the return type for the loader
    loader: async (): Promise<LoaderData> => {
        try {
            const response = await axiosInstance.post('signup/verify/check')

            if (response.status === 400) {
                // Use throw redirect instead of returning an object with redirect
                throw redirect({
                    to: '/sign-up',
                    replace: true
                });
            }

            return { email: response.data.email };
        }
        catch (err) {
            throw redirect({
                to: '/sign-up',
                replace: true
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { email } = Route.useLoaderData();

    return (
        <div>
            <h1>Verify Email {email}</h1>
        </div>
    );
}