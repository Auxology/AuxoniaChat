import { createFileRoute, redirect } from '@tanstack/react-router'
import { axiosInstance } from "@/lib/axios.ts";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { useForgotPasswordFinish } from "@/actions/useForgotPasswordActions"
import { passwordSchema } from "@/lib/zod.ts"
import { CheckCircle, AlertCircle } from "lucide-react"

// Form schema for password reset
const resetPasswordSchema = z.object({
  password: passwordSchema
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const Route = createFileRoute('/forgot-password/finish')({
  loader: async () => {
    try {
      // Verify that the user has completed the previous step
      await axiosInstance.post('/forgotPassword/finish/check');
      return {};
    }
    catch (err) {
      console.error('Failed to load password reset page', err);
      throw redirect({
        to: '/forgot-password',
        replace: true
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [passwordValue, setPasswordValue] = useState("");

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
  
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange" // Enable real-time validation
  });

  const { mutate, isPending, isError, error } = useForgotPasswordFinish();

  function onSubmit(values: ResetPasswordFormData) {
    // Additional check before submission
    if (!allRequirementsMet) {
      return;
    }
    
    mutate(values.password);
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
            <CardTitle className="font-ogg text-headline text-2xl">Reset Your Password</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Create a new strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pitch-sans-medium text-headline">New Password</FormLabel>
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
                      Resetting Password...
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
                      Reset Password
                    </Button>
                  )}

                  {!allRequirementsMet && passwordValue.length > 0 && (
                    <p className="text-amber-500 text-xs font-pitch-sans-medium text-center">
                      Please meet all password requirements
                    </p>
                  )}

                  {isError && (
                    <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                      {error?.response?.statusText || "An error occurred"}
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}