import { LucideIcon } from "lucide-react";

export interface NavItem {
    href: string;
    label: string;
    ariaLabel?: string;
    badge?: string;
    hasDivider?: boolean;
    category: 'court' | 'penal' | 'admin' | 'info';
    flagRequired?: 'NEXT_PUBLIC_SHOW_MULTAS_PUNTOS';
    highlight?: boolean;
}

/**
 * Canonical sitewide navigation items in order specified by business architecture:
 * Juicio rápido · Alcoholemia · Drogas · Sin carnet · Velocidad · Profesionales ·
 * Multas y puntos · Honorarios · Glosario
 */
export const CANONICAL_NAV_ITEMS: readonly NavItem[] = [
    {
        href: '/juzgados',
        label: 'Juicio rápido',
        category: 'court',
    },
    {
        href: '/alcoholemia',
        label: 'Alcoholemia',
        category: 'penal',
    },
    {
        href: '/drogas',
        label: 'Drogas',
        category: 'penal',
    },
    {
        href: '/sin-carnet',
        label: 'Sin carnet',
        category: 'penal',
    },
    {
        href: '/velocidad',
        label: 'Velocidad',
        category: 'penal',
    },
    {
        href: '/profesionales',
        label: 'Profesionales',
        category: 'penal',
        highlight: true,
    },
    {
        href: '/defensa-puntos-carnet',
        label: 'Multas y puntos',
        ariaLabel: 'Multas y puntos, toda España',
        badge: 'Toda España',
        hasDivider: true,
        category: 'admin',
        flagRequired: 'NEXT_PUBLIC_SHOW_MULTAS_PUNTOS',
    },
    {
        href: '/honorarios',
        label: 'Honorarios',
        category: 'info',
    },
    {
        href: '/glosario',
        label: 'Glosario',
        category: 'info',
    },
] as const;

/**
 * Returns whether the Multas y Puntos service should be visible in navigation.
 * Controlled by NEXT_PUBLIC_SHOW_MULTAS_PUNTOS environment flag (default: false).
 */
export function isMultasPuntosVisible(): boolean {
    return process.env.NEXT_PUBLIC_SHOW_MULTAS_PUNTOS === 'true';
}

/**
 * Returns the filtered list of navigation items according to current feature flags.
 */
export function getNavItems(options?: { includeAll?: boolean }): NavItem[] {
    const showMultas = options?.includeAll || isMultasPuntosVisible();
    return CANONICAL_NAV_ITEMS.filter((item) => {
        if (item.flagRequired === 'NEXT_PUBLIC_SHOW_MULTAS_PUNTOS' && !showMultas) {
            return false;
        }
        return true;
    });
}

/**
 * Checks if a route is currently active given the pathname.
 */
export function isRouteActive(href: string, currentPathname: string): boolean {
    if (!currentPathname) return false;
    if (href === '/juzgados') {
        return currentPathname === '/juzgados' || currentPathname.startsWith('/juzgados/');
    }
    if (href === '/') {
        return currentPathname === '/';
    }
    return currentPathname === href || currentPathname.startsWith(`${href}/`);
}

