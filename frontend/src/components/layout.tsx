import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export function Container({ children, className, fluid = false }: ContainerProps) {
  return (
    <div 
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        fluid ? "max-w-full" : "max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}