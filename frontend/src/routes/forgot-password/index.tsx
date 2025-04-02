import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/actions/useForgotPasswordActions";
import { requireNonAuth } from '@/utils/routeGuards';

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute('/forgot-password/')({
  beforeLoad: async () => {
    return await requireNonAuth();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isError, error } = useForgotPassword();

  function onSubmit(values: ForgotPasswordFormData) {
    mutate(values.email);
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
              <Link to="/help">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-paragraph hover:bg-transparent hover:text-headline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to help
                </Button>
              </Link>
            </div>
            
            <CardTitle className="font-ogg text-headline text-2xl">Reset Password</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Enter your email address and we'll send you a verification code to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pitch-sans-medium text-headline">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
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
                      Sending...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                    >
                      Send Reset Code
                    </Button>
                  )}

                  {isError && (
                    <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                      {error?.response?.statusText || "Failed to send reset code"}
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                    >
                      Return to login
                    </Link>
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