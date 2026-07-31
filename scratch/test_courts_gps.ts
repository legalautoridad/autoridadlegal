import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createStaticClient } from '../src/lib/supabase/server';

function parseGpsCoords(gpsInput: any): { lat: number; lng: number } | null {
    if (!gpsInput) return null;

    if (typeof gpsInput === 'object' && gpsInput !== null) {
        if (typeof gpsInput.lat === 'number' && typeof gpsInput.lng === 'number') {
            return { lat: gpsInput.lat, lng: gpsInput.lng };
        }
        if (typeof gpsInput.latitude === 'number' && typeof gpsInput.longitude === 'number') {
            return { lat: gpsInput.latitude, lng: gpsInput.longitude };
        }
    }

    if (typeof gpsInput === 'string') {
        const str = gpsInput.trim();

        const wktMatch = str.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
        if (wktMatch) {
            const lng = parseFloat(wktMatch[1]);
            const lat = parseFloat(wktMatch[2]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
            }
        }

        const pairMatch = str.match(/^([-\d.]+)\s*,\s*([-\d.]+)$/);
        if (pairMatch) {
            const n1 = parseFloat(pairMatch[1]);
            const n2 = parseFloat(pairMatch[2]);
            if (!isNaN(n1) && !isNaN(n2)) {
                if (n1 > 30 && n1 < 45 && n2 > -10 && n2 < 5) {
                    return { lat: Number(n1.toFixed(6)), lng: Number(n2.toFixed(6)) };
                }
                return { lat: Number(n2.toFixed(6)), lng: Number(n1.toFixed(6)) };
            }
        }

        if (/^[0-9a-fA-F]{42,}$/.test(str)) {
            try {
                const buf = Buffer.from(str, 'hex');
                if (buf.length >= 25) {
                    const isLittleEndian = buf[0] === 1;
                    const lng = isLittleEndian ? buf.readDoubleLE(9) : buf.readDoubleBE(9);
                    const lat = isLittleEndian ? buf.readDoubleLE(17) : buf.readDoubleBE(17);
                    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                        return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
                    }
                }
            } catch (e) {
                // Fallthrough
            }
        }
    }

    return null;
}

function parseAddressParts(rawAddress: string | null | undefined, locationName: string) {
    if (!rawAddress) {
        return { streetAddress: undefined, postalCode: undefined };
    }
    const cleanStr = rawAddress.trim();
    // Regex matching: ^(.*?),?\s*(\d{5})\s+(.*)$
    const match = cleanStr.match(/^(.*?)(?:,\s*)?\b(\d{5})\b\s*(.*)$/);
    if (match) {
        let street = match[1].trim();

        // Remove trailing commas if any
        if (street.endsWith(',')) {
            street = street.slice(0, -1).trim();
        }

        return {
            streetAddress: street || cleanStr,
            postalCode: match[2],
        };
    }

    return {
        streetAddress: cleanStr,
        postalCode: undefined,
    };
}

async function test() {
    const supabase = createStaticClient();
    const { data: locs } = await supabase.from('locations').select('slug, name, courts(*)');

    const targetSlugs = ['barcelona', 'sabadell', 'terrassa', 'badalona', 'granollers', 'mataro', 'manresa', 'vic', 'igualada'];
    const filtered = locs?.filter(l => targetSlugs.includes(l.slug));

    filtered?.forEach(l => {
        const c = l.courts as any;
        if (!c) return;
        const coords = parseGpsCoords(c.gps_coords || c.gps);
        const addr = parseAddressParts(c.address, l.name);
        console.log(`\nLocation: ${l.name} (${l.slug})`);
        console.log(`  Raw address: "${c.address}"`);
        console.log(`  Parsed streetAddress: "${addr.streetAddress}"`);
        console.log(`  Parsed postalCode: "${addr.postalCode}"`);
        console.log(`  Parsed coords:`, coords);
    });
}

test();
