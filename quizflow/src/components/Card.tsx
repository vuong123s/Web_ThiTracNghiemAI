import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "../lib/utils"

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "primary" | "secondary" | "accent"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", ...props }, ref) => {
    const variants = {
      default: "bg-surface-lowest shadow-soft",
      glass: "glass shadow-soft",
      primary: "bg-primary text-white shadow-lg shadow-primary/20",
      secondary: "bg-secondary text-white shadow-lg shadow-secondary/20",
      accent: "bg-accent text-white shadow-lg shadow-accent/20",
    }

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "rounded-4xl overflow-hidden",
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"
