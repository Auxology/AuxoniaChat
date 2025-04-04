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
import {useStartSignUp} from "@/actions/useSignUpActions";
import {EmailFormData, emailSchema} from "@/lib/zod.ts";
import {requireNonAuth} from "@/utils/routeGuards";

export const Route = createFileRoute('/sign-up/')({
  beforeLoad: async () => {
    return await requireNonAuth();
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

  const {mutate, isPending, isError, error} = useStartSignUp();

  function onSubmit(values: EmailFormData) {
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
        <Card className="relative w-[350px] sm:w-[400px] bg-background rounded-2xl">
          <CardHeader>
            <CardTitle className="font-ogg text-headline text-2xl">Create Account</CardTitle>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Enter your email to get started
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
                          className="font-pitch-sans-medium"
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
                      Creating Account...
                    </Button>
                  ) : (
                      <Button
                          type="submit"
                          className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                      >
                        Continue
                      </Button>
                  )}

                  {/* Account Help Links */}
                  <div className="flex flex-col items-center gap-4 pt-2">
                    <Link
                      to="/login"
                      className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                    >
                      Already have an account? Login
                    </Link>

                    <Separator className="w-1/2 bg-button/10" />

                    <a 
                      href="/help" 
                      className="text-sm font-pitch-sans-medium text-headline/80 hover:text-paragraph transition-colors"
                    >
                      Need help with your account?
                    </a>

                    {isError && (
                        <div className="text-red-500 text-sm font-pitch-sans-medium">
                            {error.status === 409 ? "Email already exists" : "An error occurred"}
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