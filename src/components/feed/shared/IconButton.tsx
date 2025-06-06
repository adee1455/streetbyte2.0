import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: React.ReactElement<LucideIcon>;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-[#EF4443] text-white hover:bg-[#DC2626]',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};

export default function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  active = false,
  className = '',
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4443]',
        variantClasses[variant],
        sizeClasses[size],
        active && 'bg-[#EF4443] text-white',
        className
      )}
    >
      {icon}
    </button>
  );
} 