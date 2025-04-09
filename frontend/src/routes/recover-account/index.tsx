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
import { Separator } from "@/components/ui/separator"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { useRecovery } from "@/actions/useRecoveryActions"
import { requireNonAuth } from '@/utils/routeGuards'
import { recoveryCodeSchema, RecoveryCodeData } from '@/lib/zod'

export const Route = createFileRoute('/recover-account/')({
  beforeLoad: async () => {
    return await requireNonAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<RecoveryCodeData>({
    resolver: zodResolver(recoveryCodeSchema),
    defaultValues: {
      code: "",
    },
  })

  // Use the recovery mutation hook
  const { mutate, isPending: isSubmitting, error } = useRecovery()

  function onSubmit(values: RecoveryCodeData) {
    mutate(values.code)
  }

  // Get error message from error object
  const errorMessage = error?.response?.statusText || "Failed to verify recovery code"

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
            <CardTitle className="font-ogg text-headline text-2xl">Account Recovery</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              For accounts with compromised email access. Enter your backup recovery code to regain account access.
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
                      <FormLabel className="font-pitch-sans-medium text-headline">Recovery Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          maxLength={20}
                          {...field}
                          className="font-pitch-sans-medium text-center text-lg tracking-widest uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-paragraph/60 text-center mt-1 font-pitch-sans-medium">
                        Format: 20 characters, uppercase letters and numbers
                      </div>
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
                      "Continue"
                    )}
                  </Button>

                  {error && (
                    <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-4 pt-2">
                    <Link
                      to="/login"
                      className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                    >
                      Remember your password? Login
                    </Link>

                    <Separator className="w-1/2 bg-button/10" />

                    <Link
                      to="/contact" 
                      className="text-sm font-pitch-sans-medium text-headline/80 hover:text-paragraph transition-colors"
                    >
                      Don't have a recovery code?
                    </Link>
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