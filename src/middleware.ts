import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import MAPA from '@/data/municipio-a-partido.json';

const CANON = 'https://www.autoridad.legal';
const PARTIDOS = MAPA as Record<string, string>;
// Slug de URL canónico por servicio (acepta también la variante con guion bajo)
const SERVICIOS: Record<string, string> = {
    alcoholemia: 'alcoholemia',
    drogas: 'drogas',
    velocidad: 'velocidad',
    'sin-carnet': 'sin-carnet',
    sin_carnet: 'sin-carnet',
    profesionales: 'profesionales',
};

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. 301 Redirects for /{servicio}/{municipio} -> /juzgados/{partido} and /sin_carnet -> /sin-carnet
    const partes = pathname.split('/').filter(Boolean);
    const servicio = SERVICIOS[(partes[0] ?? '').toLowerCase()];
    if (servicio) {
        // /sin_carnet -> /sin-carnet
        if (partes.length === 1) {
            if (partes[0] !== servicio) {
                return NextResponse.redirect(new URL(`/${servicio}`, CANON), 301);
            }
        } else {
            // /{servicio}/{municipio}[/...] -> /juzgados/{partido} (o /{servicio} si el municipio no existe)
            let municipio = partes[1];
            try {
                municipio = decodeURIComponent(municipio);
            } catch {}
            const partido = PARTIDOS[municipio.toLowerCase()];
            const destino = partido ? `/juzgados/${partido}` : `/${servicio}`;
            return NextResponse.redirect(new URL(destino, CANON), 301);
        }
    }

    // 2. 301 Permanent Redirect for legacy honorarios slug
    if (pathname === '/precio-honorarios-financiacion') {
        return NextResponse.redirect(new URL('/honorarios', CANON), 301);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    try {
        await supabase.auth.getUser();
    } catch (e) {
        console.error('[MIDDLEWARE] Auth check failed:', e);
    }

    return response;
}

export const config = {
    matcher: [
        '/alcoholemia/:path+',
        '/drogas/:path+',
        '/velocidad/:path+',
        '/sin-carnet/:path+',
        '/sin_carnet',
        '/sin_carnet/:path+',
        '/profesionales/:path+',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
