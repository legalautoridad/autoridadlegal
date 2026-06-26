'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeadContextType {
    bacLevel: number;
    locationName: string;
    setBacLevel: (level: number) => void;
    setLocationName: (name: string) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ 
    children, 
    initialLocation = '' 
}: { 
    children: ReactNode; 
    initialLocation?: string;
}) {
    const [bacLevel, setBacLevel] = useState<number>(0.0);
    const [locationName, setLocationName] = useState<string>(initialLocation);

    return (
        <LeadContext.Provider value={{ bacLevel, locationName, setBacLevel, setLocationName }}>
            {children}
        </LeadContext.Provider>
    );
}

export function useLead() {
    const context = useContext(LeadContext);
    if (context === undefined) {
        throw new Error('useLead must be used within a LeadProvider');
    }
    return context;
}
