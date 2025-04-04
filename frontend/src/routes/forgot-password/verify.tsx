import { createFileRoute, redirect } from '@tanstack/react-router'
import { axiosInstance } from "@/lib/axios.ts";
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
import { useState, useEffect } from "react"
import { useForgotPassword, useForgotPasswordVerify } from "@/actions/useForgotPasswordActions"
import { ArrowLeft } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { verificationCodeSchema, VerificationCodeData } from "@/lib/zod"

type LoaderData = {
  email: string;
};

export const Route = createFileRoute('/forgot-password/verify')({
  // Keeping your existing loader function
  loader: async (): Promise<LoaderData> => {
    try {
      const response = await axiosInstance.post('signup/verify/check')

      return { email: response.data.email };
    }
    catch (err) {
      console.error('Failed to load verify page', err);
      throw redirect({
        to: '/sign-up',
        replace: true
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const email = data?.email || 'your email';
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const form = useForm<VerificationCodeData>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    mutate: verifyCode,
    isPending: isSubmitting,
    error: verifyError
  } = useForgotPasswordVerify();

  const {
    mutate: resendCode,
    isPending: isResending
  } = useForgotPassword();

  function onSubmit(values: VerificationCodeData) {
    verifyCode(values.code);
  }

  useEffect(() => {
    let timer: number | undefined;
    
    if (resendSuccess && resendCooldown <= 0) {
      setResendCooldown(60); // 60 seconds
    }

    if (resendCooldown > 0) {
      timer = window.setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
}, [resendSuccess, resendCooldown]);

  function handleResend() {
    if (resendCooldown > 0) return;
    
    resendCode(email);
    setResendSuccess(true);
  }

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
          <CardHeader>
            <div className="mb-2">
              <Link to="/forgot-password">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-paragraph hover:bg-transparent hover:text-headline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            
            <CardTitle className="font-ogg text-headline text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Enter the 8-digit code sent to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pitch-sans-medium text-headline">Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code"
                          maxLength={8}
                          {...field}
                          className="font-pitch-sans-medium text-center text-sm lg:text-md tracking-widest focus:bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  {isSubmitting ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled
                    >
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                    >
                      Verify Code
                    </Button>
                  )}

                  {verifyError && (
                    <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                      {verifyError?.response?.statusText || "Invalid verification code"}
                    </div>
                  )}

                  <div className="text-center pt-2">
                    {resendCooldown > 0 ? (
                      <p className="text-sm text-paragraph">
                        Resend available in {resendCooldown}s
                      </p>
                    ) : (
                      <Button 
                        variant="link" 
                        onClick={handleResend}
                        disabled={isResending || resendCooldown > 0}
                        className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors p-0"
                      >
                        {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}