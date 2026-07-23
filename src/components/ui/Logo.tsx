import React from 'react';

interface LogoProps {
    variant?: 'full' | 'icon' | 'mark';
    theme?: 'dark' | 'light' | 'transparent';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showText?: boolean;
}

export function Logo({
    variant = 'full',
    theme = 'transparent',
    size = 'lg',
    className = '',
    showText = true
}: LogoProps) {
    // Sizing maps (height in pixels)
    const heightMap = {
        sm: 44,
        md: 64,
        lg: 84,
        xl: 110,
    };

    const isIconOnly = variant === 'icon' || variant === 'mark' || !showText;
    const h = heightMap[size] || heightMap.lg;

    // Image source selection
    let imgSrc = '/images/logo-transparent.png';
    if (isIconOnly) {
        imgSrc = '/images/logo-icon.png';
    } else if (theme === 'dark') {
        imgSrc = '/images/logo-dark-transparent.png';
    }

    return (
        <div className={`inline-flex items-center select-none ${className}`}>
            <img
                src={imgSrc}
                alt="Autoridad Legal"
                style={{ height: `${h}px`, width: 'auto' }}
                className="object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
        </div>
    );
}
