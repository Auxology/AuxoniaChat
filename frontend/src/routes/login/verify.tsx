import { createFileRoute, redirect, Link } from '@tanstack/react-router'
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
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { axiosInstance } from "@/lib/axios"
import { useLoginVerify } from "@/actions/useLoginActions"
import { useResendCode } from "@/actions/useLoginActions"
import { requireNonAuth } from '@/utils/routeGuards'
import { verificationCodeSchema, VerificationCodeData } from "@/lib/zod"

export const Route = createFileRoute('/login/verify')({
  beforeLoad: async () => {
    try {
      // Check if user has valid 2FA session
      await axiosInstance.post('/login/verify/check')
      return await requireNonAuth();
    } catch (error) {
      console.error("Verify page error:", error)
      throw redirect({
        to: '/login',
        replace: true
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
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
  } = useLoginVerify();

  const {
    mutate: resendCode,
    isPending: isResending
  } = useResendCode();

  function onSubmit(values: VerificationCodeData) {
    verifyCode(values.code);
  }

  useEffect(() => {
    let timer: number | undefined;

    if (resendSuccess && resendCooldown <= 0) {
      setResendCooldown(60); // 60 seconds cooldown
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
    setResendSuccess(false);
    
    resendCode(undefined, {
      onSuccess: () => {
        setResendSuccess(true);
      }
    });
  }

  const errorMessage = verifyError?.response?.statusText || "Verification failed";

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
        <Card className="relative w-[350px] sm:w-[400px] bg-background rounded-2xl">
          <CardHeader>
            <div className="mb-2">
              <Link to="/login">
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
            <CardTitle className="font-ogg text-headline text-2xl">Verify Your Login</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Enter the 8-character code sent to your email
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
                          className="font-pitch-sans-medium text-center text-sm lg:text-md tracking-widest"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-headline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <div className="flex flex-col items-center gap-4 pt-2">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResend}
                      disabled={isResending || resendCooldown > 0}
                      className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin text-button" />
                          Resending...
                        </>
                      ) : resendCooldown > 0 ? (
                        `Resend available in ${resendCooldown}s`
                      ) : resendSuccess ? (
                        "Code Resent!"
                      ) : (
                        "Didn't receive a code? Resend"
                      )}
                    </Button>

                    {verifyError && (
                      <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                        {errorMessage}
                      </div>
                    )}

                    {resendSuccess && (
                      <div className="text-emerald-500 text-sm font-pitch-sans-medium text-center">
                        Verification code resent successfully!
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}