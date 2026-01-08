export const LOCATIONS = [
    // Zona Metropolitana (Sur y Barcelonès)
    { slug: 'barcelona', name: 'Barcelona', court: 'Ciudad de la Justicia', zone: 'Metropolitana' },
    { slug: 'hospitalet', name: 'L\'Hospitalet de Llobregat', court: 'Ciudad de la Justicia (L\'H)', zone: 'Metropolitana' },
    { slug: 'badalona', name: 'Badalona', court: 'Juzgados de Badalona', zone: 'Metropolitana' },
    { slug: 'santa-coloma', name: 'Santa Coloma de Gramenet', court: 'Juzgados de Santa Coloma', zone: 'Metropolitana' },
    { slug: 'cornella', name: 'Cornellà de Llobregat', court: 'Juzgados de Cornellà', zone: 'Metropolitana' },
    { slug: 'sant-feliu', name: 'Sant Feliu de Llobregat', court: 'Juzgados de Sant Feliu', zone: 'Metropolitana' },
    { slug: 'esplugues', name: 'Esplugues de Llobregat', court: 'Juzgados de Esplugues', zone: 'Metropolitana' },
    { slug: 'sant-boi', name: 'Sant Boi de Llobregat', court: 'Juzgados de Sant Boi', zone: 'Metropolitana' },
    { slug: 'el-prat', name: 'El Prat de Llobregat', court: 'Juzgados de El Prat', zone: 'Metropolitana' },
    { slug: 'gava', name: 'Gavà', court: 'Juzgados de Gavà', zone: 'Metropolitana' }, // Covers Castelldefels too typically

    // Zona Vallès Occidental (Oeste) - SATELLITE STRATEGY
    { slug: 'rubi', name: 'Rubí', court: 'Juzgados de Rubí', zone: 'Vallès Occidental' },
    { slug: 'sant-cugat', name: 'Sant Cugat del Vallès', court: 'Juzgados de Rubí', zone: 'Vallès Occidental' }, // Satellite
    { slug: 'castellbisbal', name: 'Castellbisbal', court: 'Juzgados de Rubí', zone: 'Vallès Occidental' }, // Satellite

    { slug: 'terrassa', name: 'Terrassa', court: 'Juzgados de Terrassa', zone: 'Vallès Occidental' },
    { slug: 'matadepera', name: 'Matadepera', court: 'Juzgados de Terrassa', zone: 'Vallès Occidental' }, // Satellite

    { slug: 'sabadell', name: 'Sabadell', court: 'Juzgados de Sabadell', zone: 'Vallès Occidental' },
    { slug: 'castellar', name: 'Castellar del Vallès', court: 'Juzgados de Sabadell', zone: 'Vallès Occidental' }, // Satellite
    { slug: 'santa-perpetua', name: 'Santa Perpètua de Mogoda', court: 'Juzgados de Sabadell', zone: 'Vallès Occidental' }, // Satellite

    { slug: 'cerdanyola', name: 'Cerdanyola del Vallès', court: 'Juzgados de Cerdanyola', zone: 'Vallès Occidental' },
    { slug: 'montcada', name: 'Montcada i Reixac', court: 'Juzgados de Cerdanyola', zone: 'Vallès Occidental' }, // Satellite

    // Zona Maresme
    { slug: 'mataro', name: 'Mataró', court: 'Juzgados de Mataró', zone: 'Maresme' },

    // Otras Zonas
    { slug: 'granollers', name: 'Granollers', court: 'Juzgados de Granollers', zone: 'Vallès Oriental' },
    { slug: 'martorell', name: 'Martorell', court: 'Juzgados de Martorell', zone: 'Baix Llobregat' },
    { slug: 'manresa', name: 'Manresa', court: 'Juzgados de Manresa', zone: 'Bages' },
    { slug: 'vic', name: 'Vic', court: 'Juzgados de Vic', zone: 'Osona' },
];
