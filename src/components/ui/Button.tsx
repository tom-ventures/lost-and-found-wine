import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center tracking-[0.15em] uppercase transition-colors duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-brand-cream text-brand-cream-text hover:bg-white": variant === "primary",
            "border border-white text-white hover:bg-brand-cream hover:text-brand-cream-text hover:border-brand-cream": variant === "outline",
            "text-brand-muted hover:text-white": variant === "ghost",
          },
          {
            "text-xs px-6 py-2": size === "sm",
            "text-sm px-8 py-3": size === "md",
            "text-sm px-10 py-4": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
