import { forwardRef } from "react";

const Button = forwardRef(({
    children, 
    type = "button",
    variant = "primary", // primary, secondary, ghost, danger
    className = "",
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
        ghost: "hover:bg-neutral-800 text-neutral-300 hover:text-white",
        danger: "bg-red-600/10 text-red-500 hover:bg-red-600/20"
    };

    return (
        <button 
            ref={ref}
            type={type} 
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} 
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = "Button";

export default Button;