import { DefenseStrategy } from './defense-strategy';
import { BarcelonaStrategy } from './barcelona-strategy';
import { RubiStrategy } from './rubi-strategy';
import { DefaultDefenseStrategy } from './default-strategy';

export class DefenseStrategySelector {
    /**
     * Factory Method to get the correct DefenseStrategy based on the city slug
     */
    public static getStrategy(citySlug: string): DefenseStrategy {
        if (!citySlug) {
            return new DefaultDefenseStrategy('barcelona');
        }

        const normalizedSlug = citySlug.toLowerCase().trim();

        switch (normalizedSlug) {
            case 'barcelona':
                return new BarcelonaStrategy();
            case 'rubi':
            case 'rubí':
                return new RubiStrategy();
            default:
                return new DefaultDefenseStrategy(normalizedSlug);
        }
    }
}
