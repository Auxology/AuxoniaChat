import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"
import { useState } from "react"
import { useFinishSignUp } from "@/actions/useSignUpActions"
import { finishSignUpSchema, FinishSignUpData } from "@/lib/zod.ts"
import { CheckCircle, AlertCircle, Copy, Check } from "lucide-react"
import { requireTemporarySession } from '@/utils/routeGuards';

// Define the loader data type for type safety
interface SessionData {
  email: string;
}

export const Route = createFileRoute('/sign-up/finish')({
    loader: async (): Promise<SessionData> => {
        try {
            const data = await requireTemporarySession();
            
            if (!data || !data.email) {
                throw redirect({
                    to: '/sign-up',
                    replace: true
                });
            }
            
            return data as SessionData;
        } catch (error) {
            throw redirect({
                to: '/sign-up',
                replace: true
            });
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { email } = Route.useLoaderData();
    const [passwordValue, setPasswordValue] = useState("");
    const [isFinished, setIsFinished] = useState(false);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Password requirement checks
    const hasMinLength = passwordValue.length >= 12;
    const hasLowercase = /[a-z]/.test(passwordValue);
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecial = /[^a-zA-Z0-9\s]/.test(passwordValue);
    const hasNoWhitespace = /^\S.*\S$|^\S$/.test(passwordValue);

    // Check if all password requirements are met
    const allRequirementsMet = hasMinLength && 
                               hasLowercase && 
                               hasUppercase && 
                               hasNumber && 
                               hasSpecial && 
                               hasNoWhitespace;
    
    const form = useForm<FinishSignUpData>({
        resolver: zodResolver(finishSignUpSchema),
        defaultValues: {
            username: "",
            password: "",
        },
        mode: "onChange" // Enable real-time validation
    });

    const { mutate, isPending, isError, error } = useFinishSignUp();

    function onSubmit(values: FinishSignUpData) {
        // Additional check before submission
        if (!allRequirementsMet) {
            return;
        }
        
        mutate(
            {
                username: values.username,
                password: values.password
            }, 
            {
                onSuccess: (data) => {
                    // Set recovery codes and show finished state
                    setRecoveryCodes(data.recoveryCodes || []);
                    setIsFinished(true);
                }
            }
        );
    }

    // Password requirement component
    const PasswordRequirement = ({ fulfilled, text }: { fulfilled: boolean, text: string }) => (
        <div className="flex items-center space-x-2 text-sm">
            {fulfilled ?
                <CheckCircle className="h-4 w-4 text-green-500" /> :
                <AlertCircle className="h-4 w-4 text-red-500" />
            }
            <span className={fulfilled ? "text-paragraph" : "text-red-500"}>{text}</span>
        </div>
    );

    // Handle copy recovery code
    const copyToClipboard = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <main className="min-h-[92.8vh] flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

                {/* Card Content */}
                <Card className="relative w-[320px] sm:w-[400px] bg-background rounded-2xl">
                    {isFinished ? (
                        <>
                            <CardHeader>
                                <CardTitle className="font-ogg text-headline text-2xl">Account Created!</CardTitle>
                                <CardDescription className="font-freight-text-pro-black text-paragraph">
                                    Save your recovery codes. You'll need these if you ever lose access to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-3 bg-background/50 border border-button/10 rounded-md">
                                        <p className="text-sm font-pitch-sans-medium text-headline mb-4">Your Recovery Codes:</p>
                                        <div className="space-y-3">
                                            {recoveryCodes.map((code, index) => (
                                                <div 
                                                    key={code} 
                                                    className="flex items-center justify-between p-2 bg-background/80 border border-button/30 rounded"
                                                >
                                                    <code className="font-pitch-sans-medium text-paragraph">{code}</code>
                                                    <button 
                                                        onClick={() => copyToClipboard(code, index)}
                                                        className="text-button hover:text-button/80"
                                                        aria-label="Copy code"
                                                    >
                                                        {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-amber-500 mt-4">
                                            ⚠️ Make sure to save these codes securely. They won't be shown again.
                                        </p>
                                    </div>
                                    
                                    <Button
                                        className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                                        onClick={() => window.location.href = '/login'}
                                    >
                                        Continue to Login
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader>
                                <CardTitle className="font-ogg text-headline text-2xl">Complete Your Profile</CardTitle>
                                <CardDescription className="font-freight-text-pro-black text-paragraph">
                                    Create a username and password for {email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-pitch-sans-medium text-headline">Username</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Choose a username"
                                                            {...field}
                                                            className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-pitch-sans-medium text-headline">Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Create a strong password"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                setPasswordValue(e.target.value);
                                                            }}
                                                            className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password requirements */}
                                        {passwordValue.length > 0 && (
                                            <div className="p-3 bg-background/50 border border-button/10 rounded-md">
                                                <p className="text-sm font-pitch-sans-medium text-headline mb-2">Password Requirements:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <PasswordRequirement
                                                        fulfilled={hasMinLength}
                                                        text="At least 12 characters"
                                                    />
                                                    <PasswordRequirement
                                                        fulfilled={hasLowercase}
                                                        text="One lowercase letter"
                                                    />
                                                    <PasswordRequirement
                                                        fulfilled={hasUppercase}
                                                        text="One uppercase letter"
                                                    />
                                                    <PasswordRequirement
                                                        fulfilled={hasNumber}
                                                        text="One number"
                                                    />
                                                    <PasswordRequirement
                                                        fulfilled={hasSpecial}
                                                        text="One special character"
                                                    />
                                                    <PasswordRequirement
                                                        fulfilled={hasNoWhitespace}
                                                        text="No spaces at start/end"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4 pt-2">
                                            {isPending ? (
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled
                                                >
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Your Account...
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className={`w-full font-pitch-sans-medium ${
                                                        allRequirementsMet 
                                                            ? "bg-button hover:bg-button/80 text-headline" 
                                                            : "bg-button/40 text-headline/50 cursor-not-allowed"
                                                    }`}
                                                    disabled={!allRequirementsMet || !form.formState.isValid}
                                                >
                                                    Complete Sign Up
                                                </Button>
                                            )}

                                            {!allRequirementsMet && passwordValue.length > 0 && (
                                                <p className="text-amber-500 text-xs font-pitch-sans-medium text-center">
                                                    Please meet all password requirements
                                                </p>
                                            )}

                                            {isError && (
                                                <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                                                    {error?.message || "An error occurred"}
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </motion.div>
        </main>
    )
}