import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded font-medium transition-all duration-300 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const buttonVariants = ({ 
  variant = 'default', 
  size = 'default', 
  className = '' 
}: {
  variant?: ButtonProps['variant']; 
  size?: ButtonProps['size']; 
  className?: string 
} = {}) => {
  return className;
};
