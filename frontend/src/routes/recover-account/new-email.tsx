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
import { ArrowLeft } from "lucide-react"
import { axiosInstance } from "@/lib/axios.ts"
import { useRecoveryNewEmail } from "@/actions/useRecoveryActions"
import { EmailFormData, emailSchema } from "@/lib/zod.ts"

export const Route = createFileRoute('/recover-account/new-email')({
  loader: async () => {
    try {
      await axiosInstance.post('/recovery/new-email/check');
      return {};
    } catch {
      throw redirect({
        to: '/recover-account',
        replace: true
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutate, isPending, error } = useRecoveryNewEmail();

  function onSubmit(values: EmailFormData) {
    mutate(values.email);
  }

  const errorMessage = error?.response?.statusText || error?.message || "Failed to submit email";

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
              <Link to="/recover-account">
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
            <CardTitle className="font-ogg text-headline text-2xl">New Email Address</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Enter a new email address for your account. You'll need to verify this email in the next step.
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
                      <FormLabel className="font-pitch-sans-medium text-headline">New Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your new email address" 
                          type="email"
                          {...field}
                          className="font-pitch-sans-medium focus:bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-headline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Continue"
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