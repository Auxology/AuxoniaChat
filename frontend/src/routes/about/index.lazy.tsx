import { createLazyFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx"
import { Footer } from "@/components/Footer.tsx"
import { motion } from "motion/react"

export const Route = createLazyFileRoute('/about/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <main>
        <NavBar />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-ogg text-headline scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-16"
          >
            Story Behind Auxonia Chat
          </motion.h1>

          {/* Section 1: Initial Story */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-24"
          >
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                  src="/AboutSection1.png"
                  alt="Development Journey"
                  className="w-full max-w-[500px] rounded-2xl"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="font-ogg text-headline scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
                Meet Akaki
              </h2>
              <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-7">
                A passionate business student with a vision to create meaningful projects for a better future.
                Recognizing the immense popularity of social media, he decided to create a chatting website.
                Starting with just a laptop and determination, Akaki spent countless nights learning modern web technologies.
                The initial challenges were overwhelming: choosing the right tech stack, designing an intuitive interface,
                and ensuring top-notch security. But each obstacle became a valuable learning opportunity.
              </p>
            </div>
          </motion.div>

          {/* Section 2: Learning Journey */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 mb-24"
          >
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="font-ogg text-headline scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
                The Journey of Growth
              </h2>
              <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-7">
                Every feature added to Auxonia Chat taught Akaki something new.
                Implementing real-time messaging introduced the complexities of WebSocket connections.
                Creating the authentication system highlighted the importance of user security.
                Designing the responsive interface showed the value of user-centered design.
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                  src="/AboutSection2.png"
                  alt="Learning Process"
                  className="w-full max-w-[500px] rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Section 3: Challenges */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-24"
          >
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                  src="/AboutSection3.png"
                  alt="Overcoming Challenges"
                  className="w-full max-w-[500px] rounded-2xl"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="font-ogg text-headline scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
                Overcoming Challenges
              </h2>
              <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-7">
                The biggest hurdle came when testing the chat system with real users.
                Performance issues emerged under load, teaching Akaki valuable lessons about optimization and scalability.
              </p>
            </div>
          </motion.div>

          {/* Section 4: Future */}
          {/* TODO: REPLACE WITH BETTER PICTURE */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16"
          >
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="font-ogg text-headline scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
                Looking Forward
              </h2>
              <p className="text-paragraph text-base sm:text-lg font-freight-text-pro-black leading-7">
                Future is bright. I want make this website scalable and ready for actual production.
                Do not forget that this is learning project, serving as a testing grounds.
                Everything that you see here is display of all skills that I currently have.
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                  src="/AboutSection4.png"
                  alt="Future Vision"
                  className="w-full max-w-[500px] rounded-2xl"
              />
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
  )
}