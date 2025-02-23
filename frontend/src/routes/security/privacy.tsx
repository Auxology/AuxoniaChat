import { createFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx"
import { Footer } from "@/components/Footer.tsx"

export const Route = createFileRoute('/security/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <main>
        <NavBar />
        <section className="container mx-auto px-4 py-12">
          <h1 className="font-ogg text-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-8 text-paragraph text-lg sm:text-xl font-freight-text-pro-black leading-relaxed">
            {/* Introduction */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">1. Introduction</h2>
              <p>
                Welcome to <span className="text-headline">Auxonia Chat</span>. I value your privacy.
                This policy outlines what data I collect, how I use it, and your rights regarding your personal information.
              </p>
            </div>

            {/* Data Collection */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">2. What Data I Collect</h2>
              <p>I collect only the necessary data to provide my services:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Username (stored in plaintext for identification)</li>
                <li>Email (used for authentication and account recovery)</li>
                <li>Password (securely hashed—never stored in raw form)</li>
                <li>Multi-Factor Authentication (MFA) Data (including recovery codes for safekeeping)</li>
                <li>Messages (stored but neither tracked nor analyzed)</li>
              </ul>
            </div>

            {/* Data Usage */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">3. How I Use Your Data</h2>
              <p>I use your data only for essential purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Authentication and account management (login and security)</li>
                <li>Delivering and storing your messages for future access</li>
                <li>Preventing fraud or abuse when necessary</li>
              </ul>
              <p className="mt-4">
                I do not track you, use your data for advertising, or sell your information to third parties.
              </p>
            </div>

            {/* Messages & Privacy */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">4. Messages & Privacy</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Your messages are stored in my database for your access</li>
                <li>I do not track, analyze, or sell your messages</li>
                <li>Following my privacy-first approach, I do not actively moderate messages—please note this means I cannot guarantee a completely safe messaging environment</li>
              </ul>
            </div>

            {/* Cookies & Storage */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">5. Cookies & Storage</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>I use cookies solely for authentication (session management)</li>
                <li>All data (except usernames) is encrypted and stored securely</li>
              </ul>
            </div>

            {/* User Rights */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">6. Your Rights</h2>
              <p>You maintain full control over your data. You can:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Request access to your stored data</li>
                <li>Request deletion of your account and messages</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact me using the email below.
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">7. Security Measures</h2>
              <p>While I implement robust security measures, you share responsibility for protecting your account:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Use a strong password and keep recovery codes secure</li>
                <li>Do not share your credentials with anyone</li>
              </ul>
            </div>

            {/* Changes */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">8. Changes to This Policy</h2>
              <p>
                I may update this Privacy Policy as needed. All changes will be posted on this page.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-ogg text-headline text-2xl mb-4">9. Contact Me</h2>
              <p>
                For questions or concerns, please contact me at{' '}
                <a href="mailto:akaki.jomidava@gmail.com" className="text-button hover:text-button/80 transition-colors">
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