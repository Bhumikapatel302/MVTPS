import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500',
        secondary: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg hover:animate-shake focus:ring-red-500',
        success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg focus:ring-emerald-500',
        ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2 text-base rounded-xl',
        lg: 'px-6 py-3 text-lg rounded-xl',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {Icon && <Icon className="h-4 w-4" />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
