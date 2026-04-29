import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "../lib/utils"

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent"
  size?: "sm" | "md" | "lg" | "xl"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
      secondary: "bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90",
      accent: "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90",
      outline: "border-2 border-primary/20 text-primary hover:bg-primary/5",
      ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-low",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-2xl",
      md: "px-6 py-3 text-base rounded-3xl",
      lg: "px-8 py-4 text-lg font-semibold rounded-4xl",
      xl: "px-10 py-5 text-xl font-bold rounded-5xl",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
