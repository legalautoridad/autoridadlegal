import { generateLlmsIndex } from '@/lib/llms';

export const revalidate = 3600;

export async function GET() {
    const content = await generateLlmsIndex();
    return new Response(content, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}
