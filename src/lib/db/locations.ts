import { createStaticClient } from '../supabase/server'

export interface Court {
    id: string
    name: string
    information: string | null
    address: string | null
    phone: string | null
    created_at: string
}

export interface Location {
    id: string
    slug: string
    name: string
    court_id: string | null
    courts?: Court | null
    zone: string | null
    redirect_slug: string | null
    created_at: string
}

/**
 * Fetches all locations from the database.
 */
export async function getLocations(): Promise<Location[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('locations')
        .select('*, courts(*)')
        .order('name')

    if (error) {
        console.error('Error fetching locations:', error)
        return []
    }

    return data as Location[]
}

/**
 * Fetches a single location by its slug.
 */
export async function getLocationBySlug(slug: string): Promise<Location | null> {
    const supabase = createStaticClient()
    const { data: results, error } = await supabase
        .from('locations')
        .select('*, courts(*)')
        .eq('slug', slug)

    const data = results?.[0] || null

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error(`❌ DB Error fetching location (${slug}):`, error.message)
        }
        return null
    }

    if (data) {
        console.log(`✅ DB HIT: Found location "${data.name}" in database.`)
    } else {
        console.log(`⚠️ DB MISS: Location "${slug}" not found in database table.`)
    }

    return data as Location
}

/**
 * Fetches the active location (the one that should be displayed),
 * handling redirections if the current slug is a redirect.
 */
export async function getActiveLocation(slug: string): Promise<{
    location: Location | null
    redirectUrl: string | null
}> {
    const location = await getLocationBySlug(slug)

    if (!location) {
        return { location: null, redirectUrl: null }
    }

    if (location.redirect_slug) {
        return {
            location: null,
            redirectUrl: location.redirect_slug
        }
    }

    return { location, redirectUrl: null }
}
