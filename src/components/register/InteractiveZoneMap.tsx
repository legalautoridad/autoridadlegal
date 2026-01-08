'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    activeZones: string[];
    onToggle: (zoneId: string) => void;
}

const ZONES = [
    {
        id: 'MANRESA',
        label: 'Catalunya Central',
        path: 'M10,10 L90,5 L95,35 L50,45 L5,30 Z', // North/Top
        cx: '50%', cy: '20%'
    },
    {
        id: 'MARESME',
        label: 'Maresme',
        path: 'M55,10 L95,15 L100,70 L65,55 Z', // East
        cx: '80%', cy: '40%'
    },
    {
        id: 'GARRAF',
        label: 'Garraf / Penedès',
        path: 'M0,50 L50,45 L60,90 L10,95 Z', // South West
        cx: '30%', cy: '75%'
    },
    {
        id: 'BCN_VALLES',
        label: 'BCN y Vallés',
        path: 'M35,35 L75,30 L85,65 L25,75 Z', // Center
        cx: '55%', cy: '50%'
    }
];

export default function InteractiveZoneMap({ activeZones, onToggle }: Props) {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-[4/3] bg-blue-50/50 rounded-xl overflow-hidden shadow-inner border border-blue-100 group">
            {/* Background Image */}
            <img
                src="/images/mapa-judicial-barcelona.png"
                alt="Mapa Judicial"
                className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-80"
            />

            {/* SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {ZONES.map((zone) => {
                    const isActive = activeZones.includes(zone.id);
                    const isHovered = hoveredZone === zone.id;

                    return (
                        <motion.path
                            key={zone.id}
                            d={zone.path}
                            onClick={() => onToggle(zone.id)}
                            onMouseEnter={() => setHoveredZone(zone.id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            initial={false}
                            animate={{
                                fill: isActive ? 'rgba(37, 99, 235, 0.6)' : isHovered ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.01)',
                                stroke: isActive ? '#1e3a8a' : isHovered ? '#2563eb' : 'rgba(255,255,255,0)',
                                strokeWidth: isActive || isHovered ? 1 : 0,
                                scale: isHovered ? 1.02 : 1,
                                filter: isHovered ? 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' : 'none',
                                zIndex: isHovered ? 20 : 10
                            }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="cursor-pointer"
                            style={{ transformOrigin: 'center' }}
                        />
                    );
                })}
            </svg>

            {/* Tooltips */}
            <AnimatePresence>
                {hoveredZone && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute pointer-events-none z-30 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl"
                        style={{
                            left: ZONES.find(z => z.id === hoveredZone)?.cx,
                            top: ZONES.find(z => z.id === hoveredZone)?.cy,
                            transform: 'translate(-50%, -50%)' // Center the tooltip
                        }}
                    >
                        {ZONES.find(z => z.id === hoveredZone)?.label}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                <span className="bg-white/90 backdrop-blur text-[10px] text-slate-500 px-2 py-1 rounded-full shadow-sm">
                    Interactúa con el mapa para seleccionar zonas
                </span>
            </div>
        </div>
    );
}
