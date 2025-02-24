import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button.tsx";
import { motion } from "motion/react";
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/Footer.tsx";

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main>

            <NavBar />

            <section className="min-h-[92.8vh] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-background/50">
                {/* Main container */}
                <div className="container flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Left Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full lg:w-1/2 p-4"
                    >
                        <div className="flex flex-col items-center lg:items-start justify-center gap-y-8 text-center lg:text-left">
                            <h1 className="text-headline font-ogg scroll-m-20 text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                                The Free Communication
                            </h1>

                            <p className="text-paragraph text-lg sm:text-xl font-freight-text-pro-black leading-relaxed max-w-[600px]">
                                Chat. Share. Express your Freedom.
                                <br />
                                Join the community where privacy meets convenience.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto mt-4">
                                <Button className="bg-button hover:bg-button/80 w-full sm:w-auto px-8 py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                                    <Link to="/sign-up">
                                        <span className="text-headline font-pitch-sans-medium">Get Started</span>
                                    </Link>
                                </Button>

                                <Button className="bg-headline hover:bg-headline/80 w-full sm:w-auto px-8 py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                                    <Link to="/about">
                                        <span className="text-button font-pitch-sans-medium">Learn More</span>
                                    </Link>
                                </Button>
                            </div>

                            {/* Powered By */}
                            <div className="flex items-center gap-2 mt-8">
                                <p className="text-paragraph font-pitch-sans-medium leading-7">
                                    Powered by
                                </p>
                                <a href="https://github.com/Auxology/AuxoniaAuth" target="_blank" rel="noopener noreferrer">
                                <span className="text-headline font-ogg-extra-bold text-lg  bg-clip-text">
                                    AuxoniaAuth
                                </span>
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full lg:w-1/2 p-4"
                    >
                        <div className="flex items-center justify-center w-full">
                            <img
                                src="/HeroSection.png"
                                alt="Hero Section"
                                className="w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[600px] h-auto object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

            </section>

            {/* Chat Features */}
            <section className="flex justify-center items-center py-16 px-4">
                <div className="container flex flex-col items-center justify-center gap-20">
                    {/* Chat Features Header */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-8 lg:gap-16">
                        {/* Left side - Title and Description */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
                            <h2 className="font-ogg text-headline scroll-m-20 pb-2 text-3xl lg:text-4xl font-semibold tracking-tight">
                                AuxoniaChat
                            </h2>
                            <p className="font-freight-text-pro-black text-paragraph text-lg sm:text-xl leading-7 mt-2">
                                Your conversations, your privacy—no compromises.
                            </p>
                        </div>

                        {/* Right side - Feature Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:w-3/5">
                            {/* Feature 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center text-center gap-5 group"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 p-4 bg-background/50 rounded-2xl shadow-sm
                                    transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                                    group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Secure.png"
                                        alt="Private & Secure"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-xl sm:text-2xl leading-7
                                    transition-colors duration-300 group-hover:text-button"
                                >
                                    Private & Secure
                                </p>
                            </motion.div>

                            {/* Feature 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-col items-center text-center gap-5 group"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 p-4 bg-background/50 rounded-2xl shadow-sm
                                    transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                                    group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Ads.png"
                                        alt="No Ads"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-xl sm:text-2xl leading-7
                                    transition-colors duration-300 group-hover:text-button"
                                >
                                    No Ads, No Distractions
                                </p>
                            </motion.div>

                            {/* Feature 3 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col items-center text-center gap-5 group"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 p-4 bg-background/50 rounded-2xl shadow-sm
                                    transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                                    group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Freedom.png"
                                        alt="Complete Freedom"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-xl sm:text-2xl leading-7
                                    transition-colors duration-300 group-hover:text-button"
                                >
                                    Complete Freedom
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image Showcase */}
                    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative rounded-2xl"
                        >
                            {/* Glowing Border */}
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

                            {/* Image Container */}
                            <div className="relative aspect-[16/9] w-full rounded-2xl bg-background">
                                <img
                                    src="/Showcase.png"
                                    alt="AuxoniaChat Interface"
                                    className="relative w-full h-full object-cover rounded-2xl"
                                    style={{
                                        minHeight: '400px',
                                        height: 'min(calc(100vh - 300px), 800px)',
                                        maxHeight: '800px'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* AI Companion Features */}
            <section className="flex justify-center items-center py-16 px-4">
                <div className="container flex flex-col items-center justify-center gap-20">
                    {/* AI Features Header */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-8 lg:gap-16">
                        {/* Left side - Title and Description */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
                            <h2 className="font-ogg text-headline scroll-m-20 pb-2 text-3xl lg:text-4xl font-semibold tracking-tight">
                                Your AI Companion
                            </h2>
                            <p className="font-freight-text-pro-black text-paragraph text-lg sm:text-xl leading-7 mt-2">
                                A free chatbot built to chat, assist, and provide knowledge anytime.
                            </p>
                        </div>

                        {/* Right side - Feature Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
                            {/* Feature 1 - Free & Available */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center text-center gap-4 group"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 p-3 bg-background/50 rounded-2xl shadow-sm
                        transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                        group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Free.png"
                                        alt="Always Available"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-lg sm:text-xl leading-7
                        transition-colors duration-300 group-hover:text-button"
                                >
                                    Free & Always Available
                                </p>
                            </motion.div>

                            {/* Feature 2 - Smart & Helpful */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-col items-center text-center gap-4 group"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 p-3 bg-background/50 rounded-2xl shadow-sm
                        transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                        group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Helpful.png"
                                        alt="Smart Assistant"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-lg sm:text-xl leading-7
                        transition-colors duration-300 group-hover:text-button"
                                >
                                    Smart & Helpful
                                </p>
                            </motion.div>

                            {/* Feature 3 - Friendly & Engaging */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col items-center text-center gap-4 group"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 p-3 bg-background/50 rounded-2xl shadow-sm
                        transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105
                        group-hover:bg-background/70 group-hover:-translate-y-1"
                                >
                                    <img
                                        src="/Friendly.png"
                                        alt="Friendly AI"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-headline font-ogg text-lg sm:text-xl leading-7
                        transition-colors duration-300 group-hover:text-button"
                                >
                                    Friendly & Engaging
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* AI Image Showcase */}
                    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative rounded-2xl"
                        >
                            {/* Glowing Border */}
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

                            {/* Image Container */}
                            <div className="relative aspect-[16/9] w-full rounded-2xl bg-background">
                                <img
                                    src="/AiShowcase.png"
                                    alt="AI Chat Interface"
                                    className="relative w-full h-full object-cover rounded-2xl"
                                    style={{
                                        minHeight: '400px',
                                        height: 'min(calc(100vh - 300px), 800px)',
                                        maxHeight: '800px'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Explore the project */}
            <section className="flex justify-center items-center py-16 px-4">
                <div className="container flex flex-col items-center justify-center gap-20">

                    {/* Explore Header */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-8 lg:gap-16">
                        {/* Left side - Title and Description */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
                            <h2 className="font-ogg text-headline scroll-m-20 pb-2 text-3xl lg:text-4xl font-semibold tracking-tight">
                                Explore the Project
                            </h2>
                            <p className="font-freight-text-pro-black text-paragraph text-lg sm:text-xl leading-7 mt-2">
                                A deeper look into the vision, security, and development behind Auxonia Chat.
                            </p>
                        </div>
                    </div>

                    {/* 4 Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                        {/* Card 1 - GitHub */}
                        <a href="https://github.com/Auxology/AuxoniaChat">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col bg-background/50 rounded-2xl overflow-hidden group hover:bg-background/70
                            transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex justify-center items-center p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20">
                                        <img
                                            src="/icons8-github-100.png"
                                            alt="GitHub"
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-3">
                                    <h3 className="font-ogg text-headline scroll-m-20 text-2xl font-semibold tracking-tight">Github➔</h3>
                                    <p className="text-paragraph text-base font-pitch-sans-medium leading-relaxed">
                                        Check out the source code, contribute, or explore how it works.
                                    </p>
                                </div>
                            </motion.div>
                        </a>

                        {/* Card 2 - Story */}
                        <Link to="/about">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-col bg-background/50 rounded-2xl overflow-hidden group hover:bg-background/70
                            transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex justify-center items-center p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20">
                                        <img
                                            src="/Book.png"
                                            alt="Book"
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-3">
                                    <h3 className="font-ogg text-headline scroll-m-20 text-2xl font-semibold tracking-tight">How It Started➔</h3>
                                    <p className="text-paragraph text-base font-pitch-sans-medium leading-relaxed">
                                        The story behind Auxonia Chat—why it was built and what inspired it.
                                    </p>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Card 3 - AuxoniaAuth */}
                        <a href="https://github.com/Auxology/AuxoniaAuth">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col bg-background/50 rounded-2xl overflow-hidden group hover:bg-background/70
                            transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex justify-center items-center p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20">
                                        <img
                                            src="/Security%20Lock.png"
                                            alt="Security"
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-3">
                                    <h3 className="font-ogg text-headline scroll-m-20 text-2xl font-semibold tracking-tight">AuxoniAuth➔</h3>
                                    <p className="text-paragraph text-base font-pitch-sans-medium leading-relaxed">
                                        Learn about the privacy measures, encryption, and protections in place.
                                    </p>
                                </div>
                            </motion.div>
                        </a>

                        {/* Card 4 - Goals */}
                        <Link to="/about">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="flex flex-col bg-background/50 rounded-2xl overflow-hidden group hover:bg-background/70
                            transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex justify-center items-center p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20">
                                        <img
                                            src="/Goal.png"
                                            alt="Goal"
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-3">
                                    <h3 className="font-ogg text-headline scroll-m-20 text-2xl font-semibold tracking-tight">Goals➔</h3>
                                    <p className="text-paragraph text-base font-pitch-sans-medium leading-relaxed">
                                        The mission and future roadmap for the project.
                                    </p>
                                </div>
                            </motion.div>
                        </Link>

                    </div>


                </div>
            </section>

            {/* CTA Section */}
            <section className="flex justify-center items-center py-24 px-4">
                <div className="container flex flex-col items-center text-center gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-6 max-w-2xl"
                    >
                        {/* Heading */}
                        <h2 className="font-ogg text-headline scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                            Ready to Experience True Freedom?
                        </h2>

                        {/* Description */}
                        <p className="font-freight-text-pro-black text-paragraph text-lg sm:text-xl leading-relaxed">
                            Join the community today and be part of the free digital world.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto mt-4">
                            <Button
                                className="bg-button hover:bg-button/80 w-full sm:w-auto px-8 py-6 text-lg
                        transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                <Link to="/sign-up">
                                    <span className="text-headline font-pitch-sans-medium">
                                        Get Started
                                    </span>
                                </Link>
                            </Button>

                            <Button
                                className="bg-headline hover:bg-headline/80 w-full sm:w-auto px-8 py-6 text-lg
                        transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                <Link to="/about">
                                    <span className="text-button font-pitch-sans-medium">
                                        Learn More
                                    </span>
                                </Link>
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <p className="text-paragraph/80 text-sm font-pitch-sans-medium mt-4">
                            No credit card required • Free forever • Open source
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />


        </main>
    )
}