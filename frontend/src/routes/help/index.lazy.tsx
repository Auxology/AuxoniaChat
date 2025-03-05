import { createLazyFileRoute } from '@tanstack/react-router'
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Key, UserRoundX, LogIn } from "lucide-react"
import { Link } from "@tanstack/react-router"

export const Route = createLazyFileRoute('/help/')({
    component: RouteComponent,
})

function RouteComponent() {
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
                        <CardTitle className="font-ogg text-headline text-2xl">Account Help</CardTitle>
                        <CardDescription className="font-freight-text-pro-black text-paragraph">
                            Select an option below to get assistance with your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0"> {/* Remove flex and use padding instead */}
                        {/* Back to home button */}
                        <div className="mb-6"> {/* Use a div with margin instead of flex alignment */}
                            <Link to="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-paragraph hover:bg-transparent hover:text-headline"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to home
                                </Button>
                            </Link>
                        </div>

                        {/* Help Options */}
                        <div className="space-y-4"> {/* Use space-y for consistent spacing */}
                            {/* Login Option */}
                            <Link to="/login" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <LogIn className="h-5 w-5 mr-4 text-button mt-1" />
                                        <div className="text-left">
                                            <h3 className="font-pitch-sans-medium text-headline">Login to your account</h3>
                                            <p className="text-sm text-paragraph mt-1">
                                                Access your existing Auxonia account
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>

                            {/* Forgot Password Option */}
                            <Link to="/forgot-password" className="block w-full"> {/* Changed: added w-full */}
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <Key className="h-5 w-5 mr-4 text-button mt-1" />
                                        <div className="text-left">
                                            <h3 className="font-pitch-sans-medium text-headline">Forgot password</h3>
                                            <p className="text-sm text-paragraph mt-1">
                                                Reset your password via email verification
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>

                            {/* Recover Account Option */}
                            <Link to="/recover-account" className="block w-full"> {/* Changed: added w-full */}
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <UserRoundX className="h-5 w-5 mr-4 text-button mt-1" />
                                        <div className="text-left">
                                            <h3 className="font-pitch-sans-medium text-headline">Recover account</h3>
                                            <p className="text-sm text-paragraph mt-1">
                                                Restore access to a compromised account.
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                        </div>

                        {/* Contact Support */}
                        <div className="pt-6 text-center"> {/* Increase top padding for separation */}
                            <p className="text-sm text-paragraph mb-2">Need more help?</p>
                            <Link to={'/contact'}>
                                <p
                                    className="text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors"
                                >
                                    Contact Me
                                </p>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    )
}