import { useId, forwardRef } from "react";

const Select = forwardRef(function Select({
    options,
    label,
    className = "",
    multiple,
    ...props
}, ref)
{
    const id = useId()
    return(
        <div className="w-full space-y-2">
            {label && <label htmlFor={id} className="text-sm font-medium text-neutral-400 ml-1">{label}</label>}
            <div className="relative">
                <select 
                    id={id} 
                    ref={ref} 
                    multiple={multiple} 
                    {...props} 
                    className={`flex min-h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none pr-10 ${className}`}
                >
                    {options?.map((option, index) => {
                        // Handle both string arrays and object arrays with value/label
                        if (typeof option === 'string' || typeof option === 'number') {
                            return <option key={option} value={option}>{option}</option>;
                        } else if (option && typeof option === 'object' && option.value !== undefined) {
                            return <option key={option.value || index} value={option.value}>{option.label || option.value}</option>;
                        }
                        return null;
                    })}
                </select>
                {!multiple && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                        <svg className="h-4 w-4" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    )
})

export default Select