import { forwardRef } from "react";
import { cn } from "../../utils/helpers";

const Button = forwardRef(({ children, variant = "primary", size = "md", className = "", ...props }, ref) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none";

  const variants = {
    primary: "bg-ink text-ivory hover:bg-brass hover:text-ink border border-ink hover:border-brass",
    secondary: "bg-transparent text-ink border border-warm-gray hover:border-ink",
    danger: "bg-red-900 text-ivory hover:bg-red-800 border border-red-900",
    ghost: "bg-transparent text-sepia hover:text-ink border border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
