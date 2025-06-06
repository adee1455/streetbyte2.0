import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  label?: string;
  active?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'ghost',
  label,
  active = false
}) => {
  const baseClasses = 'rounded-full flex items-center justify-center transition-colors focus:outline-none';
  
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  const variantClasses = {
    primary: 'bg-[#EF4443] hover:bg-[#D83A39] text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  
  return (
    <button
      type="button"
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${active ? 'text-[#EF4443]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default IconButton;