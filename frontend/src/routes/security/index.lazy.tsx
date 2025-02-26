import { createLazyFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx"
import { Footer } from "@/components/Footer.tsx"
import { motion } from "motion/react"

export const Route = createLazyFileRoute('/security/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <NavBar />

      <section className="container mx-auto px-3 py-6 sm:px-4 sm:py-12 lg:px-8 lg:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-ogg text-headline text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-center mb-6 sm:mb-12 lg:mb-16"
        >
          Here Your Security is Priority!
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm transition-all duration-300 group-hover:blur-md group-hover:scale-[1.02]" />
            <div className="relative bg-background rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[250px] sm:min-h-[280px] lg:min-h-[300px] flex flex-col transition-transform duration-300 group-hover:scale-[1.01]">
              <img
                src="/Card1.png"
                alt="No Tracking Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <h2 className="font-ogg text-headline text-lg sm:text-xl lg:text-2xl font-semibold mt-6 sm:mt-8 lg:mt-10 mb-4 sm:mb-6 lg:mb-8">
                No Tracking!
              </h2>
              <p className="text-paragraph text-sm sm:text-base lg:text-lg font-freight-text-pro-black mt-auto">
                AuxoniaChat doesn't serve personalized ads or track and store your activity for resale.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm transition-all duration-300 group-hover:blur-md group-hover:scale-[1.02]" />
            <div className="relative bg-background rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[250px] sm:min-h-[280px] lg:min-h-[300px] flex flex-col transition-transform duration-300 group-hover:scale-[1.01]">
              <img
                src="/Card2.png"
                alt="Encrypted Data Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <h2 className="font-ogg text-headline text-lg sm:text-xl lg:text-2xl font-semibold mt-6 sm:mt-8 lg:mt-10 mb-4 sm:mb-6 lg:mb-8">
                Encrypted Data
              </h2>
              <p className="text-paragraph text-sm sm:text-base lg:text-lg font-freight-text-pro-black mt-auto">
                Necessary data required for functionality is encrypted before being stored in the database.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative group md:col-span-2 lg:col-span-1"
          >
            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm transition-all duration-300 group-hover:blur-md group-hover:scale-[1.02]" />
            <div className="relative bg-background rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[250px] sm:min-h-[280px] lg:min-h-[300px] flex flex-col transition-transform duration-300 group-hover:scale-[1.01]">
              <img
                src="/Card3.png"
                alt="Open Source Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <h2 className="font-ogg text-headline text-lg sm:text-xl lg:text-2xl font-semibold mt-6 sm:mt-8 lg:mt-10 mb-4 sm:mb-6 lg:mb-8">
                Open-Source
              </h2>
              <p className="text-paragraph text-sm sm:text-base lg:text-lg font-freight-text-pro-black mt-auto">
                95% of this open-source project's code is public, except for API keys and security elements.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col lg:flex-row items-center gap-4 sm:gap-8 lg:gap-16"
        >
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 lg:space-y-6">
            <h2 className="font-ogg text-headline text-xl sm:text-2xl lg:text-3xl font-semibold">
              Why you are not tracked?
            </h2>
            <p className="text-paragraph text-sm sm:text-base lg:text-lg font-freight-text-pro-black leading-relaxed">
              I do not see users as products, but rather as people who are here to help me with my learning purposes.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative group max-w-[400px] sm:max-w-[500px] w-full">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm transition-all duration-300 group-hover:blur-md group-hover:scale-[1.02]" />
              <img
                src="/Security1.png"
                alt="Security Showcase"
                className="relative w-full rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl"
        >
          <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-background">
            <img
              src="/SecurityShowcase.png"
              alt="Security Features Showcase"
              className="relative w-full h-full object-cover rounded-2xl"
              style={{
                minHeight: '300px',
                height: 'min(calc(100vh - 200px), 800px)',
                maxHeight: '800px'
              }}
            />
          </div>
        </motion.div>
      </div>

      <section className="container mx-auto px-2 sm:px-4 py-12 sm:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16"
        >
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-4">
            <h2 className="font-ogg text-headline text-xl sm:text-2xl lg:text-3xl font-semibold">
              How is your data encrypted?
            </h2>
            <p className="text-paragraph text-sm sm:text-base lg:text-lg font-freight-text-pro-black leading-relaxed">
              I follow industry standards to protect crucial data from data breaches and unauthorized access, including myself.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center px-4">
            <div className="relative group max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] w-full">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm transition-all duration-300 group-hover:blur-md group-hover:scale-[1.02]" />
              <img
                src="/Security2.png"
                alt="Data Encryption Visualization"
                className="relative w-full rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 py-12 sm:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center text-center gap-6 sm:gap-8 mb-16"
        >
          <h2 className="font-ogg text-headline text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Why open-source?
          </h2>
          <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-relaxed max-w-2xl">
            Making the project open-source helps me gather feedback that will strengthen the application's security, protecting against brute-force attacks and other vulnerabilities.
          </p>
        </motion.div>

        <div className="w-full max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl"
          >
            <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />
            <div className="relative w-full rounded-2xl bg-background overflow-hidden">
              <img
                src="/Security3.png"
                alt="Open Source Security Benefits"
                className="relative w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="h-12 sm:h-16 lg:h-24" />
      
      <Footer />
    </main>
  )
}