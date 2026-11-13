import React from 'react';
import Image from 'next/image';

interface LogoProps {
    variant?: 'full' | 'icon' | 'mark';
    theme?: 'dark' | 'light' | 'transparent';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showText?: boolean;
    priority?: boolean;
}

export function Logo({
    variant = 'full',
    theme = 'transparent',
    size = 'lg',
    className = '',
    showText = true,
    priority = true,
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

    // Image source selection and aspect-ratio width calculation
    let imgSrc = '/images/logo-transparent.webp';
    let w = Math.round(h * 2);

    if (isIconOnly) {
        imgSrc = '/images/logo-icon.webp';
        w = Math.round(h * (195 / 245));
    } else if (theme === 'dark') {
        imgSrc = '/images/logo-dark-transparent.webp';
        w = Math.round(h * (785 / 430));
    }

    return (
        <div className={`inline-flex items-center select-none ${className}`}>
            <Image
                src={imgSrc}
                alt="Autoridad Legal"
                width={w}
                height={h}
                priority={priority}
                style={{ height: `${h}px`, width: 'auto' }}
                className="object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
        </div>
    );
}
