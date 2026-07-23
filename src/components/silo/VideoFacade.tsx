'use client';

import React from 'react';

interface VideoFacadeProps {
    service?: string;
    imageUrl?: string;
    altText?: string;
}

const SERVICE_IMAGES: Record<string, string> = {
    'alcoholemia': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/service/alcohol.jpg',
    'drogas': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/service/drogas.jpg',
    'sin-carnet': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/service/sin-carnet.jpg',
    'velocidad': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/service/velocidad.jpg',
    'profesionales': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/service/profesionales.jpg',
};

export function VideoFacade({
    service = 'alcoholemia',
    imageUrl,
    altText = 'Defensa Penal de Urgencia - Santiago Giménez Olavarriaga'
}: VideoFacadeProps) {
    const normService = (service || 'alcoholemia').toLowerCase().trim();
    const finalImageUrl = imageUrl || SERVICE_IMAGES[normService] || SERVICE_IMAGES['alcoholemia'];

    return (
        <div className="w-full max-w-sm mx-auto aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
            <img
                src={finalImageUrl}
                alt={altText}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-6 pointer-events-none">
                {/* Badge */}
                <div className="self-start px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-500/30 text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">
                    Urgencia Penal 24h
                </div>

                {/* Info Overlay */}
                <div className="space-y-1">
                    <p className="text-white font-extrabold text-sm tracking-wide drop-shadow-md">
                        Santiago Giménez Olavarriaga
                    </p>
                    <p className="text-prestige-gold text-xs font-bold drop-shadow">
                        Letrado Director ICAB 31389
                    </p>
                </div>
            </div>
        </div>
    );
}
