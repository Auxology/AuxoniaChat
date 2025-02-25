import { createLazyFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx"
import { Footer } from "@/components/Footer.tsx"
import { motion } from "motion/react"
import { Instagram, Linkedin, Mail } from "lucide-react"

export const Route = createLazyFileRoute('/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <NavBar />
      
      {/* Main Content Section */}
      <section className="min-h-[calc(100vh-300px)] flex items-center justify-center py-16 px-4">
        <div className="container flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Side - Get in Touch */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h1 className="font-ogg text-headline scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-7 mb-8 max-w-lg">
              Have questions, feedback, or ideas? I would love to hear it!
            </p>
            <div className="flex items-center gap-2">
              <span className="text-paragraph font-pitch-sans-medium">Powered by</span>
              <a 
                href="https://github.com/Auxology/AuxoniaAuth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-ogg text-headline hover:text-button transition-colors"
              >
                AuxoniaAuth
              </a>
            </div>
          </motion.div>

          {/* Right Side - Connect Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/2 relative max-w-[600px]"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />
            
            {/* Card Content */}
            <div className="relative bg-background rounded-2xl p-10">
              <h2 className="font-ogg text-headline text-2xl sm:text-3xl font-semibold mb-10">
                Connect With Me
              </h2>
              <div className="flex flex-col gap-8">
                {/* Instagram */}
                <a 
                  href="https://instagram.com/auxology" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 text-paragraph hover:text-button transition-colors group"
                >
                  <Instagram className="w-7 h-7 transition-transform group-hover:scale-110" />
                  <span className="font-pitch-sans-medium text-lg">@akaki.jomidava</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/in/auxology" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 text-paragraph hover:text-button transition-colors group"
                >
                  <Linkedin className="w-7 h-7 transition-transform group-hover:scale-110" />
                  <span className="font-pitch-sans-medium text-lg">Akaki Jomidava</span>
                </a>

                {/* Email */} 
                <a 
                  href="mailto:akaki.jomidava@gmail.com"
                  className="flex items-center gap-6 text-paragraph hover:text-button transition-colors group"
                >
                  <Mail className="w-7 h-7 transition-transform group-hover:scale-110" />
                  <span className="font-pitch-sans-medium text-lg">akaki.jomidava@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}