import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="relative">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <h1 className="font-ogg scroll-m-20 text-2xl tracking-tight lg:text-3xl text-headline">
                                Auxonia
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/about">
                            <a className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                About
                            </a>
                        </Link>
                        <Link to="/contact">
                            <a className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                Contact
                            </a>
                        </Link>
                        <Link to="/security">
                            <a className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                Security
                            </a>
                        </Link>
                        <Button className="bg-button hover:bg-button/80">
                            <Link to="/login">
                                <a className="font-pitch-sans-medium text-headline/80">
                                    Login
                                </a>
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-headline hover:text-headline/80"
                        >
                            {isMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border/40 px-4 py-4 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <Link to="/about">
                                <a className="font-pitch-sans-medium text-headline/80 hover:text-headline block py-2">
                                    About
                                </a>
                            </Link>
                            <Link to="/contact">
                                <a className="font-pitch-sans-medium text-headline/80 hover:text-headline block py-2">
                                    Contact
                                </a>
                            </Link>
                            <Link to="/security">
                                <a className="font-pitch-sans-medium text-headline/80 hover:text-headline block py-2">
                                    Security
                                </a>
                            </Link>
                            <Button className="bg-button hover:bg-button/80 w-full">
                                <Link to="/login">
                                    <a className="font-pitch-sans-medium text-headline/80">
                                        Login
                                    </a>
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}