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
        <nav className="relative z-50 bg-background sticky top-0 border-b border-muted/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <h1 className="font-ogg text-2xl tracking-tight lg:text-3xl text-headline">
                                Auxonia
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        <Link to="/about">
                            <span className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                About
                            </span>
                        </Link>
                        <Link to="/contact">
                            <span className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                Contact
                            </span>
                        </Link>
                        <Link to="/security">
                            <span className="font-pitch-sans-medium text-headline/80 hover:text-headline">
                                Security
                            </span>
                        </Link>
                        <Button className="bg-button hover:bg-button/80">
                            <Link to="/login">
                                <span className="font-pitch-sans-medium text-headline/80">
                                    Login
                                </span>
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            onClick={toggleMenu}
                            variant="ghost"
                            className="text-headline hover:text-headline/80"
                            size="icon"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation - Animated */}
                <div 
                    className={cn(
                        "md:hidden fixed inset-x-0 bg-background border-b border-border/40 px-4 py-4 shadow-lg transition-all duration-300 ease-in-out",
                        isMenuOpen 
                            ? "top-[73px] opacity-100" 
                            : "-top-full opacity-0"
                    )}
                >
                    <div className="flex flex-col space-y-4">
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                            <span className="block font-pitch-sans-medium text-headline/80 hover:text-headline py-2">
                                About
                            </span>
                        </Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                            <span className="block font-pitch-sans-medium text-headline/80 hover:text-headline py-2">
                                Contact
                            </span>
                        </Link>
                        <Link to="/security" onClick={() => setIsMenuOpen(false)}>
                            <span className="block font-pitch-sans-medium text-headline/80 hover:text-headline py-2">
                                Security
                            </span>
                        </Link>
                        <Button className="bg-button hover:bg-button/80 w-full">
                            <Link to="/login" className="w-full">
                                <span className="font-pitch-sans-medium text-headline/80">
                                    Login
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}