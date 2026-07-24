import { createStaticClient } from '@/lib/supabase/server';

export interface HomepageFaq {
    id: string;
    position: number;
    category: 'marca' | 'servicio';
    service_slug: string | null;
    question: string;
    answer: string;
    created_at?: string;
}

export async function getHomepageFaqs(): Promise<HomepageFaq[]> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('homepage_faqs')
        .select('*')
        .order('position', { ascending: true });

    if (error || !data) {
        console.error('Error fetching homepage_faqs from Supabase:', error);
        return [];
    }

    return data as HomepageFaq[];
}
