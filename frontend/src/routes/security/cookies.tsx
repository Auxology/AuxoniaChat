import { createFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx";
import { Footer } from "@/components/Footer.tsx";

export const Route = createFileRoute('/security/cookies')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main>
            <NavBar />
            <section className="container mx-auto px-4 py-12">
                <h1 className="font-ogg text-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-8">
                    Cookie Policy
                </h1>
                <div className="space-y-8 text-paragraph text-lg sm:text-xl font-freight-text-pro-black leading-relaxed">
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They help websites function properly and improve user experience.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">2. How We Use Cookies</h2>
                        <p>
                            Cookies are only used for authentication purposes, including:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Session Management: To keep you logged in securely.</li>
                            <li>To temporarily store your email for a smoother auth experience.</li>
                            <li>Security Measures: To detect unauthorized access attempts and prevent fraud.</li>
                        </ul>
                        <p>
                            COOKIES ARE NOT USED FOR TRACKING OR ADVERTISING PURPOSES.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">3. Managing Cookies</h2>
                        <p>
                            Since our cookies are essential for authentication, disabling them may prevent you from logging in or using certain features. However, you can manage cookies through your browser settings.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">4. Changes to This Policy</h2>
                        <p>
                            We may update this policy if use of cookies changes. Any updates will be reflected on this page.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about our cookie policy, please contact me at <a href="mailto:akaki.jomidava@gmail.com" className="text-button hover:text-button/80 transition-colors">akaki.jomidava@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}