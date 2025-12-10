
import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: 'default' | 'light';
  color?: string; // Primary hex color
  secondaryColor?: string; // Secondary hex color
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-8 h-8", 
  textClassName = "text-xl", 
  showText = true, 
  variant = 'default',
  color = '#4F46E5', // Default Indigo 600
  secondaryColor = '#9333EA' // Default Purple 600
}) => {
  const gradientId = `wedo-gradient-${React.useId()}`;

  // If variant is light, we force white, otherwise use dynamic colors
  const strokeColor = variant === 'light' ? 'white' : `url(#${gradientId})`;
  const textColorClass = variant === 'light' 
    ? 'text-white' 
    : 'bg-clip-text text-transparent';
  
  const textStyle = variant === 'default' ? {
      backgroundImage: `linear-gradient(to right, ${color}, ${secondaryColor})`
  } : {};

  return (
    <div className="flex items-center gap-2">
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} /> 
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* The Stylized W Shape */}
        <path 
          d="M8 10C8 10 10.5 28 12 30C13.5 32 16 32 17.5 30L20 24L22.5 30C24 32 26.5 32 28 30C29.5 28 32 10 32 10" 
          stroke={strokeColor} 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* The AI Spark */}
        <path 
          d="M34 8L35 5L36 8L39 9L36 10L35 13L34 10L31 9L34 8Z" 
          fill={variant === 'light' ? '#FCD34D' : secondaryColor} 
          className="animate-pulse-subtle"
        />
      </svg>
      
      {showText && (
        <span 
            className={`font-bold tracking-tight ${textColorClass} ${textClassName}`}
            style={textStyle}
        >
          We Do
        </span>
      )}
    </div>
  );
};
