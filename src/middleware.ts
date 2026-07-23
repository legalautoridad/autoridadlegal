import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Handle raw markdown requests for glossary terms: /glosario/[slug].md
    if (pathname.startsWith('/glosario/') && pathname.endsWith('.md')) {
        const slug = pathname.replace('/glosario/', '').replace(/\.md$/, '');
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-glosario-slug', slug);
        requestHeaders.set('x-pathname', pathname);
        const rawUrl = new URL('/api/glosario-raw', request.url);
        return NextResponse.rewrite(rawUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Handle raw markdown requests for services: /[service].md (e.g. /alcoholemia.md)
    const serviceRawMatch = pathname.match(/^\/(alcoholemia|drogas|sin-carnet|velocidad|profesionales)\.md$/);
    if (serviceRawMatch) {
        const slug = serviceRawMatch[1];
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-servicio-slug', slug);
        requestHeaders.set('x-pathname', pathname);
        const rawUrl = new URL('/api/servicio-raw', request.url);
        return NextResponse.rewrite(rawUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Handle raw markdown requests for localized coverage: /[service]/[city].md (e.g. /alcoholemia/barcelona.md)
    const coberturaMatch = pathname.match(/^\/(alcoholemia|drogas|sin-carnet|velocidad|profesionales)\/([a-z0-9-]+)\.md$/);
    if (coberturaMatch) {
        const service = coberturaMatch[1];
        const city = coberturaMatch[2];
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-cobertura-service', service);
        requestHeaders.set('x-cobertura-city', city);
        requestHeaders.set('x-pathname', pathname);
        const rawUrl = new URL('/api/cobertura-raw', request.url);
        return NextResponse.rewrite(rawUrl, {
            request: {
                headers: requestHeaders,
            },
        });
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
                    cookiesToSet.forEach(({ name, value, options }) =>
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

    // This will refresh the session if it's expired
    try {
        await supabase.auth.getUser();
    } catch (e) {
        console.error('[MIDDLEWARE] Auth check failed:', e);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
