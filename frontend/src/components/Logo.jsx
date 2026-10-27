export default function Logo({width = "100px", className = ""})
{
    return(
        <div className={`font-semibold text-xl tracking-tight text-neutral-200 ${className}`} style={{width}}>
            DP
        </div>
    )
}