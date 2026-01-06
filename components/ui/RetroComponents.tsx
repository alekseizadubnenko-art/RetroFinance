import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    color?: 'white' | 'beige' | 'pink' | 'retro' | 'light' | 'orange';
    noShadow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', color = 'white', noShadow = false }) => {
    const bgColors = {
        white: 'bg-white',
        beige: 'bg-card-beige',
        pink: 'bg-card-pink',
        retro: 'bg-card-retro',
        light: 'bg-card-light',
        orange: 'bg-accent-orange',
    };

    return (
        <div className={`border-2 border-retro-border ${bgColors[color]} ${!noShadow ? 'shadow-retro' : ''} p-4 ${className}`}>
            {children}
        </div>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'secondary', icon, className = '', ...props }) => {
    const variants = {
        primary: 'bg-accent-orange text-white hover:bg-orange-600',
        secondary: 'bg-white text-retro-border hover:bg-gray-50',
        danger: 'bg-retro-action text-white hover:bg-red-600',
    };

    return (
        <button
            className={`px-6 py-2 font-bold border-2 border-retro-border shadow-retro-sm hover:translate-y-[2px] hover:shadow-none transition-all uppercase flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {icon && <span className="material-symbols-outlined text-lg leading-none">{icon}</span>}
            {children}
        </button>
    );
};

interface ProgressBarProps {
    value: number;
    max: number;
    color?: string;
    height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = 'bg-gray-600', height = 'h-3' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className={`w-full ${height} bg-gray-200 border-2 border-retro-border relative`}>
            <div
                className={`absolute top-0 left-0 h-full ${color}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};
