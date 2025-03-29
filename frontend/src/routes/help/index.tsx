import { createFileRoute } from '@tanstack/react-router'
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Key, UserRoundX, LogIn } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { requireNonAuth } from "@/utils/routeGuards"

export const Route = createFileRoute('/help/')({
    beforeLoad: async () => {
        return await requireNonAuth();
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="min-h-[92.8vh] flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-[400px]"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

                {/* Card Content */}
                <Card className="relative w-full bg-background rounded-2xl">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="font-ogg text-headline text-2xl">Account Help</CardTitle>
                        <CardDescription className="font-freight-text-pro-black text-paragraph">
                            Select an option below to get assistance with your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        {/* Back to home button */}
                        <div className="mb-4 sm:mb-6">
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
                        <div className="space-y-3 sm:space-y-4">
                            {/* Login Option */}
                            <Link to="/login" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 sm:py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <LogIn className="h-5 w-5 mr-3 shrink-0 text-button mt-[2px]" />
                                        <div className="text-left min-w-0">
                                            <h3 className="font-pitch-sans-medium text-headline text-sm sm:text-base">Login to your account</h3>
                                            <p className="text-xs sm:text-sm text-paragraph mt-0.5 sm:mt-1 break-words">
                                                Access your existing Auxonia account
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>

                            {/* Forgot Password Option */}
                            <Link to="/forgot-password" className="block w-full">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 sm:py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <Key className="h-5 w-5 mr-3 shrink-0 text-button mt-[2px]" />
                                        <div className="text-left min-w-0">
                                            <h3 className="font-pitch-sans-medium text-headline text-sm sm:text-base">Forgot password</h3>
                                            <p className="text-xs sm:text-sm text-paragraph mt-0.5 sm:mt-1 break-words">
                                                Reset your password via email verification
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>

                            {/* Recover Account Option */}
                            <Link to="/recover-account" className="block w-full">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 sm:py-4 border-button/30 hover:border-button hover:bg-background/80"
                                >
                                    <div className="flex items-start">
                                        <UserRoundX className="h-5 w-5 mr-3 shrink-0 text-button mt-[2px]" />
                                        <div className="text-left min-w-0">
                                            <h3 className="font-pitch-sans-medium text-headline text-sm sm:text-base">Recover account</h3>
                                            <p className="text-xs sm:text-sm text-paragraph mt-0.5 sm:mt-1 break-words">
                                                Restore access to a compromised account.
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                        </div>

                        {/* Contact Support */}
                        <div className="pt-5 sm:pt-6 text-center">
                            <p className="text-xs sm:text-sm text-paragraph mb-1 sm:mb-2">Need more help?</p>
                            <Link to={'/contact'}>
                                <p className="text-xs sm:text-sm font-pitch-sans-medium text-button hover:text-button/80 transition-colors">
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