import { Link } from '@tanstack/react-router'

export function Footer() {
    return (
        <footer className="w-full border-t border-button/10 bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        <h3 className="font-ogg text-headline text-xl font-semibold">
                            AuxoniaChat
                        </h3>
                        <p className="text-paragraph text-sm font-freight-text-pro-black max-w-md">
                            A free and open-source communication platform focused on privacy and security.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-ogg text-headline text-sm font-semibold mb-2">
                            Product
                        </h4>
                        <Link to="/" className="text-paragraph hover:text-button text-sm transition-colors">
                            Home
                        </Link>
                        <Link to="/about" className="text-paragraph hover:text-button text-sm transition-colors">
                            About
                        </Link>
                        <a 
                            href="https://github.com/Auxology/AuxoniaChat" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-paragraph hover:text-button text-sm transition-colors"
                        >
                            GitHub
                        </a>
                    </div>

                    {/* Links Column 2 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-ogg text-headline text-sm font-semibold mb-2">
                            Legal
                        </h4>
                        <Link to="/privacy" className="text-paragraph hover:text-button text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-paragraph hover:text-button text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="text-paragraph hover:text-button text-sm transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-button/10">
                    <p className="text-paragraph text-sm font-pitch-sans-medium mb-4 sm:mb-0">
                        © {new Date().getFullYear()} AuxoniaChat. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://github.com/Auxology/AuxoniaChat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-paragraph hover:text-button transition-colors"
                            aria-label="GitHub"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}