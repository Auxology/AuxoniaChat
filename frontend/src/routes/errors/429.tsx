import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/errors/429')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  useEffect(():()=>void => {
    const timer = setTimeout(() => {
      navigate({ to: '/' })
    }, 60000) // 60 seconds = 1 minute

    return ():void => clearTimeout(timer)
  }, [navigate])

  return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full space-y-8 text-center"
        >
          <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src="/429.png"
              alt="Too Many Requests"
              className="w-72 h-72 sm:w-80 sm:h-80 mx-auto object-contain"
          />

          <div className="space-y-4">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-paragraph text-lg sm:text-xl font-freight-text-pro-black"
            >
              Rest for a minute before trying again...
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-paragraph/80 text-sm sm:text-base font-freight-text-pro-black"
            >
              Note: Manually navigating away from this page will not reset the rate limit. Server actions will continue to fail until the cooldown period ends.
            </motion.p>
          </div>
        </motion.div>
      </main>
  )
}