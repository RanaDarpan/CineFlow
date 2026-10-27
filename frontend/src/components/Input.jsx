import { useId, forwardRef } from "react"

const Input = forwardRef(({
    label,
    type = "text",
    className = "",
    ...props
}, ref) => {
    const id = useId()
    return (
        <div className='w-full space-y-2'>
            {label && (
                <label 
                    className='text-sm font-medium text-neutral-400 ml-1' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input 
                type={type} 
                className={`flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
                ref={ref} 
                {...props} 
                id={id}
            />
        </div>
    )
})

Input.displayName = "Input";

export default Input