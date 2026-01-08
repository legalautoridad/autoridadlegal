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
            {/* SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {ZONES.map((zone) => {
                    const isActive = activeZones.includes(zone.id);
                    const isHovered = hoveredZone === zone.id;

                    // Logic to determine z-index (render order):
                    // Standard SVG doesn't support z-index. The order is determined by position in DOM.
                    // We render normal zones first, then the hovered one.
                    // BUT for simplicity in React, we can just render them all, and rely on `scale` generic visual.
                    // To strictly do "render last if hovered", we would need to sort the array or lookups.
                    // Given the simple polygons, scale might be enough. 

                    // Actually, let's just render them. 
                    // If we want the pop-out to really cover neighbors, we need to move it to the end of the list.
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
                                scale: isHovered ? 1.05 : 1, // Increased scale for effect
                                filter: isHovered ? 'drop-shadow(0px 5px 5px rgba(0,0,0,0.2))' : 'none',
                            }}
                            transition={{ duration: 0.2 }}
                            className="cursor-pointer transition-all"
                            style={{
                                transformOrigin: 'center',
                                // SVG doesn't use zIndex but we can apply it to the style for some browsers or future compat
                                zIndex: isHovered ? 50 : 1
                            }}
                        />
                    );
                }).sort((a, b) => {
                    // Sort logic: if 'key' == hoveredZone, put it last. 
                    // Since we are mapping first, we can't sort the React Elements easily without losing the closure over 'zone'.
                    // Better approach: Sort the data array first.
                    return 0;
                })}

                {/* Render again the hovered zone on top to ensure Z-index pop-out */}
                {hoveredZone && (() => {
                    const zone = ZONES.find(z => z.id === hoveredZone);
                    if (!zone) return null;
                    const isActive = activeZones.includes(zone.id);
                    return (
                        <motion.path
                            key={`${zone.id}-highlight`}
                            d={zone.path}
                            onClick={() => onToggle(zone.id)}
                            pointerEvents="none" // Pass through events to the underlying one to avoid flickering
                            initial={false}
                            animate={{
                                fill: isActive ? 'rgba(37, 99, 235, 0.6)' : 'rgba(59, 130, 246, 0.4)',
                                stroke: isActive ? '#1e3a8a' : '#2563eb',
                                strokeWidth: 1.5,
                                scale: 1.05,
                                filter: 'drop-shadow(0px 8px 8px rgba(0,0,0,0.3))'
                            }}
                            className="transition-all"
                            style={{ transformOrigin: 'center' }}
                        />
                    );
                })()}
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
