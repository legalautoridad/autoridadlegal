import { renderLlmsFull } from '@/lib/llms';

export const revalidate = 86400;

export async function GET() {
    const content = await renderLlmsFull();
    return new Response(content, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
