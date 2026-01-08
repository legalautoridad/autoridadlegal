import { barcelonaDistricts } from './barcelona';
// Futuro: import { madridDistricts } from './madrid';

const allDistricts = [...barcelonaDistricts];

export function getJudicialDistrict(slug: string) {
    return allDistricts.find(d => d.slug === slug.toLowerCase());
}

export function getAllDistricts() {
    return allDistricts;
}
