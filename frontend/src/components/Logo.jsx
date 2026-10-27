export default function Logo({ width = "auto", className = "", imgClassName = "h-10 w-auto" }) {
  return (
    <div className={`flex items-center select-none ${className}`} style={{ width }}>
      <img
        src="/image.png"
        alt="CineFlow"
        className={`${imgClassName} object-contain transition-transform duration-200 hover:scale-105`}
      />
    </div>
  );
}