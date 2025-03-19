import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
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
import { ArrowLeft, KeyRound, Mail, Eye, EyeOff, Shield, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"
import { useState, useEffect } from "react"
import { requireAuth } from "@/utils/routeGuards"

// Email validation schema
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
})

// Password validation schema
const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
})

// Verification code schema
const verificationSchema = z.object({
  code: z.string().length(8, { message: "Verification code must be 8 characters" })
})

// New password schema
const newPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// API functions
const requestPasswordChange = async (): Promise<void> => {
  await axiosInstance.post('/user/security/request-password-change');
};

const verifyPasswordChangeCode = async (code: string): Promise<void> => {
  await axiosInstance.post('/user/security/verify-password-change', { code });
};

const completePasswordChange = async (password: string): Promise<void> => {
  await axiosInstance.post('/user/security/complete-password-change', { password });
};

const requestEmailChange = async (email: string): Promise<void> => {
  await axiosInstance.post('/user/security/request-email-change', { email });
};

const verifyEmailChangeCode = async (code: string): Promise<void> => {
  await axiosInstance.post('/user/security/verify-email-change', { code });
};

// Password Requirement Component
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-amber-500" />
    )}
    <span className={`text-xs ${met ? "text-paragraph" : "text-paragraph/70"}`}>
      {text}
    </span>
  </div>
);

export const Route = createFileRoute('/settings/security')({
  beforeLoad: async () => {
    return await requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  // State for multi-step forms
  const [passwordChangeStep, setPasswordChangeStep] = useState<"idle" | "verification" | "newPassword">("idle");
  const [emailChangeStep, setEmailChangeStep] = useState<"idle" | "verification">("idle");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false, 
    hasNumber: false,
    hasSpecial: false,
  });

  // Forms
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  const verifyEmailForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ""
    }
  });

  const verifyPasswordForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ""
    }
  });

  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  });

  // Watch password to update strength indicators
  const password = newPasswordForm.watch("password");
  
  // Use useEffect to update password strength indicators to avoid infinite renders
  useEffect(() => {
    if (password) {
      setPasswordStrength({
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
      });
    }
  }, [password]);

  // Mutations
  const requestPasswordChangeMutation = useMutation({
    mutationFn: requestPasswordChange,
    onSuccess: () => {
      toast.success("Verification code sent to your email");
      setPasswordChangeStep("verification");
    },
    onError: () => {
      toast.error("Failed to request password change", {
        description: "Please try again later"
      });
    }
  });

  const verifyPasswordCodeMutation = useMutation({
    mutationFn: verifyPasswordChangeCode,
    onSuccess: () => {
      toast.success("Code verified successfully");
      setPasswordChangeStep("newPassword");
    },
    onError: () => {
      toast.error("Invalid verification code", {
        description: "Please check your code and try again"
      });
    }
  });

  const completePasswordChangeMutation = useMutation({
    mutationFn: completePasswordChange,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordChangeStep("idle");
      newPasswordForm.reset();
      {/**  Reload Page*/}
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to change password", {
        description: "Please try again later"
      });
    }
  });

  const requestEmailChangeMutation = useMutation({
    mutationFn: requestEmailChange,
    onSuccess: () => {
      toast.success("Verification code sent to your new email");
      setEmailChangeStep("verification");
    },
    onError: () => {
      toast.error("Failed to request email change", {
        description: "This email may already be in use or is invalid"
      });
    }
  });

  const verifyEmailCodeMutation = useMutation({
    mutationFn: verifyEmailChangeCode,
    onSuccess: () => {
      toast.success("Email changed successfully");
      setEmailChangeStep("idle");
      emailForm.reset();
      verifyEmailForm.reset();
    },
    onError: () => {
      toast.error("Invalid verification code", {
        description: "Please check your code and try again"
      });
    }
  });

  // Handle form submissions
  function onRequestPasswordChange() {
    requestPasswordChangeMutation.mutate();
  }

  function onVerifyPasswordCode(values: z.infer<typeof verificationSchema>) {
    verifyPasswordCodeMutation.mutate(values.code);
  }

  function onCompletePasswordChange(values: z.infer<typeof newPasswordSchema>) {
    completePasswordChangeMutation.mutate(values.password);
  }

  function onRequestEmailChange(values: z.infer<typeof emailSchema>) {
    requestEmailChangeMutation.mutate(values.email);
  }

  function onVerifyEmailCode(values: z.infer<typeof verificationSchema>) {
    verifyEmailCodeMutation.mutate(values.code);
  }

  return (
    <main className="min-h-[92.8vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

        {/* Card Content */}
        <Card className="relative bg-background rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="font-ogg text-headline text-2xl sm:text-3xl flex items-center gap-3">
                <span className="bg-button/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-button" />
                </span>
                Security & Privacy
              </CardTitle>
              <Link 
                to="/settings" 
                className="group flex items-center gap-2 font-pitch-sans-medium text-paragraph hover:text-headline transition-colors duration-200"
              >
                <span className="bg-button/10 p-2 rounded-lg group-hover:bg-button/20 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4 text-button" />
                </span>
                <span className="hidden sm:inline">Back to Settings</span>
              </Link>
            </div>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Manage your account security and privacy settings
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              {/* Password Change Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-pitch-sans-medium text-headline text-lg flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-button" />
                    Password
                  </h3>
                  <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-button/5 to-button/20 rounded-full"></div>
                </div>
                
                <div className="bg-card/30 p-6 rounded-xl border border-button/10">
                  {passwordChangeStep === "idle" && (
                    <div className="space-y-4">
                      <p className="text-paragraph font-freight-text-pro-black">
                        Change your account password. You'll receive a verification code to your email.
                      </p>
                      
                      <Button 
                        onClick={onRequestPasswordChange} 
                        disabled={requestPasswordChangeMutation.isPending}
                        className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium shadow-md transition-all duration-300 ease-in-out"
                      >
                        {requestPasswordChangeMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </div>
                  )}

                  {passwordChangeStep === "verification" && (
                    <Form {...verifyPasswordForm}>
                      <form onSubmit={verifyPasswordForm.handleSubmit(onVerifyPasswordCode)} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-paragraph font-freight-text-pro-black">
                            Enter the 8-digit verification code sent to your email
                          </p>
                          <p className="text-xs text-paragraph/70">
                            The code will expire in 5 minutes
                          </p>
                        </div>
                        
                        <FormField
                          control={verifyPasswordForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Enter verification code"
                                  maxLength={8}
                                  {...field}
                                  className="font-pitch-sans-medium text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-3">
                          <Button 
                            type="button"
                            onClick={() => setPasswordChangeStep("idle")}
                            variant="outline"
                            className="font-pitch-sans-medium text-paragraph border-button/20 hover:text-headline hover:bg-button/10"
                          >
                            Cancel
                          </Button>
                          
                          <Button 
                            type="submit"
                            disabled={verifyPasswordCodeMutation.isPending}
                            className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium shadow-md transition-all duration-300 ease-in-out"
                          >
                            {verifyPasswordCodeMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              'Verify Code'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}

                  {passwordChangeStep === "newPassword" && (
                    <Form {...newPasswordForm}>
                      <form onSubmit={newPasswordForm.handleSubmit(onCompletePasswordChange)} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-paragraph font-freight-text-pro-black">
                            Create a strong new password for your account
                          </p>
                        </div>
                        
                        <FormField
                          control={newPasswordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-pitch-sans-medium text-headline">New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    {...field}
                                    className="font-pitch-sans-medium pr-10 text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 text-paragraph hover:text-headline"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                  >
                                    {passwordVisible ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2 text-xs">
                          <p className="text-paragraph font-pitch-sans-medium">Password requirements:</p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <PasswordRequirement 
                              met={passwordStrength.hasMinLength}
                              text="At least 8 characters" 
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
                          </div>
                        </div>
                        
                        <FormField
                          control={newPasswordForm.control}
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
                                  className="font-pitch-sans-medium text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-3 pt-2">
                          <Button 
                            type="button"
                            onClick={() => setPasswordChangeStep("verification")}
                            variant="outline"
                            className="font-pitch-sans-medium text-paragraph border-button/20 hover:text-headline hover:bg-button/10"
                          >
                            Back
                          </Button>
                          
                          <Button 
                            type="submit"
                            disabled={completePasswordChangeMutation.isPending || !newPasswordForm.formState.isValid}
                            className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium shadow-md transition-all duration-300 ease-in-out flex-1"
                          >
                            {completePasswordChangeMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Password...
                              </>
                            ) : (
                              'Update Password'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              </div>

              {/* Email Change Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-pitch-sans-medium text-headline text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-button" />
                    Email Address
                  </h3>
                  <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-button/5 to-button/20 rounded-full"></div>
                </div>
                
                <div className="bg-card/30 p-6 rounded-xl border border-button/10">
                  {emailChangeStep === "idle" && (
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onRequestEmailChange)} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-paragraph font-freight-text-pro-black">
                            Change your account email address. You'll receive a verification code to your new email.
                          </p>
                        </div>
                        
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-pitch-sans-medium text-headline">New Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your new email address"
                                  type="email"
                                  {...field}
                                  className="font-pitch-sans-medium text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit"
                          disabled={requestEmailChangeMutation.isPending || !emailForm.formState.isValid}
                          className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium shadow-md transition-all duration-300 ease-in-out"
                        >
                          {requestEmailChangeMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Code...
                            </>
                          ) : (
                            'Request Email Change'
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {emailChangeStep === "verification" && (
                    <Form {...verifyEmailForm}>
                      <form onSubmit={verifyEmailForm.handleSubmit(onVerifyEmailCode)} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-paragraph font-freight-text-pro-black">
                            Enter the 8-digit verification code sent to your new email address
                          </p>
                          <p className="text-xs text-paragraph/70">
                            The code will expire in 5 minutes
                          </p>
                        </div>
                        
                        <FormField
                          control={verifyEmailForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Enter verification code"
                                  maxLength={8}
                                  {...field}
                                  className="font-pitch-sans-medium text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-3">
                          <Button 
                            type="button"
                            onClick={() => setEmailChangeStep("idle")}
                            variant="outline"
                            className="font-pitch-sans-medium text-paragraph border-button/20 hover:text-headline hover:bg-button/10"
                          >
                            Cancel
                          </Button>
                          
                          <Button 
                            type="submit"
                            disabled={verifyEmailCodeMutation.isPending}
                            className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium shadow-md transition-all duration-300 ease-in-out"
                          >
                            {verifyEmailCodeMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              'Verify & Update Email'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}