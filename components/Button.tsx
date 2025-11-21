import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'acid' | 'pink' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'acid', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-bold uppercase text-lg border-2 border-black transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    acid: "bg-acid text-black shadow-hard hover:bg-white",
    pink: "bg-neon-pink text-white shadow-hard hover:bg-white hover:text-black",
    outline: "bg-transparent text-acid border-acid shadow-hard-acid hover:bg-acid hover:text-black",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
