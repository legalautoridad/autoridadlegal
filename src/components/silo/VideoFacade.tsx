'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export function VideoFacade() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="w-full max-w-sm mx-auto aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
            {!isPlaying ? (
                // Facade Preview Layer
                <div 
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 cursor-pointer flex flex-col justify-between p-6 bg-cover bg-center"
                    style={{ 
                        backgroundImage: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRFVsVFS6Sx29Zajb-J6YOJcxKaY-r3gHshqLiN0AOuyM_H_LYTiGTrZWj38oL4tzEx7jIvGA6Lu6mbbTIZPg3vGsKjHDdpgv3oTPYqv9t_fERJ_iirucEpn8e16RWynPA_cH2pvTqthHMRoKEvL3EBQsny1kRe9EPD1HCdhy3scw0VoHMSuw-QqEsoYC3tNhXOpIZiqFaKm7kunW1ztnWJJFrmRkykhfay5vXQM9d7BzRRLGylQY05Qbv30cFImuG45g2dTQl-J99')" 
                    }}
                >
                    {/* Badge */}
                    <div className="self-start px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-500/30 text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">
                        Urgencia Penal
                    </div>

                    {/* Play Button */}
                    <div className="self-center w-16 h-16 rounded-full bg-prestige-gold text-trust-navy flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:bg-white">
                        <Play className="w-8 h-8 fill-current ml-1" />
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                        <p className="text-white font-bold text-sm tracking-wide">Santiago Giménez Olavarriaga</p>
                        <p className="text-slate-300 text-xs font-semibold">Consejos clave antes de declarar en comisaría</p>
                    </div>
                </div>
            ) : (
                // Loaded Video Player Layer
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Guía de Defensa Penal"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
}
