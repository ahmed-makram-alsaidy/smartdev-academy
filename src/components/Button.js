'use client'; // لأن هذا المكون يحتاج لتفاعل (Click)

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    outline: "border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-blue-400 bg-transparent",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white"
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}