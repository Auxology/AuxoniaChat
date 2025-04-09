import { createFileRoute, Link } from '@tanstack/react-router'
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
import { Check, X, ArrowLeft } from "lucide-react"
import { useRecoveryFinish } from "@/actions/useRecoveryActions"
import { useState, useEffect } from "react"
import { passwordWithConfirmSchema, PasswordWithConfirmData } from '@/lib/zod'
import { requireAdvancedRecoverySession } from '@/utils/routeGuards'

export const Route = createFileRoute('/recover-account/finish')({
  beforeLoad: async () => {
    return await requireAdvancedRecoverySession()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const form = useForm<PasswordWithConfirmData>({
    resolver: zodResolver(passwordWithConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { 
    mutate: finishRecovery, 
    isPending: isSubmitting,
    error
  } = useRecoveryFinish();

  const password = form.watch("password");
  
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9\s]/.test(password),
    });
  }, [password]);

  function onSubmit(values: PasswordWithConfirmData) {
    finishRecovery(values.password);
  }

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean);
  const errorMessage = error?.response?.statusText || error?.message || "Failed to update password";

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
              <Link to="/recover-account/verify">
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
            <CardTitle className="font-ogg text-headline text-2xl">Set New Password</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Create a secure password for your account
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
                      <FormLabel className="font-pitch-sans-medium text-headline">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your new password"
                            {...field}
                            className="font-pitch-sans-medium pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-paragraph hover:text-headline"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 text-xs">
                  <p className="text-paragraph font-pitch-sans-medium">Password requirements:</p>
                  <ul className="space-y-1 pl-1">
                    <PasswordRequirement 
                      met={passwordStrength.hasMinLength}
                      text="At least 12 characters" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasUppercase}
                      text="At least one uppercase letter" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasLowercase}
                      text="At least one lowercase letter" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasNumber}
                      text="At least one number" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasSpecial}
                      text="At least one special character" 
                    />
                  </ul>
                </div>

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pitch-sans-medium text-headline">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                          className="font-pitch-sans-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !allRequirementsMet}
                    className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-headline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  {error && (
                    <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      {met ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-red-500" />
      )}
      <span className={`font-pitch-sans-medium ${met ? "text-paragraph" : "text-paragraph/70"}`}>
        {text}
      </span>
    </li>
  );
}