import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[hsl(var(--space-purple))] to-[hsl(var(--space-pink))] text-white shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[hsl(var(--space-purple)/30)] bg-[hsl(var(--space-blue)/30)] text-[hsl(var(--foreground)/90)] hover:bg-[hsl(var(--space-gray)/50)] hover:text-accent-foreground",
        secondary:
          "bg-[hsl(var(--space-gray)/30)] border border-[hsl(var(--space-purple)/40)] text-[hsl(var(--foreground)/90)] hover:bg-[hsl(var(--space-gray)/50)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-[hsl(var(--space-pink))] underline-offset-4 hover:underline hover:text-[hsl(var(--space-gold))]",
        category:
          "bg-[hsl(var(--space-gray)/40)] border border-[hsl(var(--space-purple)/20)] text-[hsl(var(--foreground)/80)] hover:bg-[hsl(var(--space-gray)/60)] backdrop-blur-sm"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
