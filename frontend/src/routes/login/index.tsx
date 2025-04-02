import { createFileRoute, Link } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Separator } from "@/components/ui/separator"
import { useLogin } from "@/actions/useLoginActions"
import { requireNonAuth } from '@/utils/routeGuards'

// Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export const Route = createFileRoute('/login/')({
  beforeLoad: async () => {
    return await requireNonAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isPending, isError, error } = useLogin();

  function onSubmit(values: z.infer<typeof formSchema>):void {
    mutate({
      email: values.email,
      password: values.password
    });
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
              <CardTitle className="font-ogg text-headline text-2xl">Welcome Back</CardTitle>
              <CardDescription className="font-freight-text-pro-black text-paragraph">
                Enter your credentials to access your account
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
                                  className="font-pitch-sans-medium text-white bg-background/80 border-button/30 focus:border-button"
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
                                  placeholder="Enter your password"
                                  {...field}
                                  className="font-pitch-sans-medium text-white bg-background/80 border-button/30 focus:border-button"
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
                        Logging in...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                      >
                        Login
                      </Button>
                    )}

                    {isError && (
                      <div className="text-red-500 text-sm font-pitch-sans-medium text-center">
                        {error?.response?.statusText || "Invalid credentials"}
                      </div>
                    )}

                    {/* Account Help Links */}
                    <div className="flex flex-col items-center gap-4 pt-2">
                      <Link
                          to="/sign-up"
                          className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                      >
                        Don't have an account? Sign up
                      </Link>

                      <Separator className="w-1/2 bg-button/10" />

                      <a
                          href="/help"
                          className="text-sm font-pitch-sans-medium text-headline/80 hover:text-paragraph transition-colors"
                      >
                        Need help with your account?
                      </a>
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