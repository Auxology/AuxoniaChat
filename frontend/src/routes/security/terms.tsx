import { createFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx"
import { Footer } from "@/components/Footer.tsx"

export const Route = createFileRoute('/security/terms')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main>
            <NavBar />
            <section className="container mx-auto px-4 py-12">
                <h1 className="font-ogg text-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-8">
                    Terms of Service
                </h1>
                <div className="space-y-8 text-paragraph text-lg sm:text-xl font-freight-text-pro-black leading-relaxed">
                    {/* Introduction */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">1. Introduction</h2>
                        <p>
                            Welcome to <span className="text-headline">Auxonia Chat</span>! These Terms of Service ("Terms") govern your use of website.
                            By using Auxonia Chat, you agree to these Terms. If you disagree, please do not use our service.
                        </p>
                    </div>

                    {/* Project Nature */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">2. Project Nature & Limitations</h2>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>This is a personal project created to demonstrate technical skills and capabilities.</li>
                            <li>Auxonia Chat is not intended for enterprise-level use or critical business operations.</li>
                            <li>By using this service, you acknowledge that this is a portfolio project and may have limitations in terms of scalability, features, and support.</li>
                        </ul>
                    </div>

                    {/* Proper Use */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">3. Proper Use & Security</h2>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>You must use Auxonia Chat for lawful purposes only.</li>
                            <li>You must not attempt to bypass the AuxoniaAuth system or steal another user's account.</li>
                            <li>You alone are responsible for your credentials. While I provide security measures, your account may be at risk if you handle your data carelessly.</li>
                        </ul>
                    </div>

                    {/* Authentication */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">4. Authentication & Account Security</h2>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>AuxoniaAuth provides a secure, smooth authentication experience.</li>
                            <li>I may temporarily block accounts if I detect suspicious activity.</li>
                            <li>Recovery codes should be stored securely. I am not responsible for lost or compromised recovery codes.</li>
                        </ul>
                    </div>

                    {/* Privacy */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">5. Privacy & Data Handling</h2>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Cookies are solely used for authentication purposes.</li>
                            <li>I do not track you, monitor your messages, or display ads.</li>
                            <li>All data (except your username) is encrypted and stored securely in database.</li>
                            <li>You have the right to request your stored data and can request to delete it.</li>
                        </ul>
                    </div>

                    {/* Messaging */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">6. Messaging & Liability</h2>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Auxonia Chat cannot guarantee completely safe messaging. Since I don't monitor messages, content moderation is limited.</li>
                            <li>I am not responsible for data loss or unauthorized access due to user mistakes.</li>
                        </ul>
                    </div>

                    {/* Changes */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">7. Changes to These Terms</h2>
                        <p>
                            I may update these Terms periodically. Your continued use of the service after changes indicates acceptance of the updated Terms.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="font-ogg text-headline text-2xl mb-4">8. Contact Us</h2>
                        <p>
                            If you have questions about these Terms, please contact me at{' '}
                            <a href="mailto:contact@akaki.jomidava@gmail.com" className="text-button hover:text-button/80 transition-colors">
                                akaki.jomidava@gmail.com
                            </a>.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}