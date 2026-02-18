'use server';

import { createStaticClient } from '@/lib/supabase/server';

export async function getArticles() {
    const supabase = createStaticClient();

    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            lawyer_members (
                full_name,
                avatar_url
            )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error.message || error);
        return [];
    }

    // Transform for UI
    return data.map(article => ({
        ...article,
        author: article.lawyer_members ? {
            name: article.lawyer_members.full_name,
            image: article.lawyer_members.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.lawyer_members.full_name}`
        } : null
    }));
}

export async function getArticleBySlug(slug: string) {
    const supabase = createStaticClient();

    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            lawyer_members (
                full_name,
                avatar_url,
                role,
                bar_number
            )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error) {
        console.error('Error fetching article:', error.message || error);
        return null;
    }

    if (!data) return null;

    // Transform for UI
    return {
        ...data,
        author: data.lawyer_members ? {
            name: data.lawyer_members.full_name,
            image: data.lawyer_members.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.lawyer_members.full_name}`,
            role: data.lawyer_members.role === 'lawyer' ? 'Abogado Verificado' : data.lawyer_members.role,
            barNumber: data.lawyer_members.bar_number || 'Colegiado ICAB',
            linkedinUrl: '#' // Default for now
        } : null
    };
}

export async function getArticleSlugs() {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('articles')
        .select('slug')
        .eq('is_published', true);

    if (error) {
        console.error('Error fetching slugs:', error);
        return [];
    }

    return data.map(item => item.slug);
}

// Admin Actions
import { createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from './admin-helpers';
import { revalidatePath } from 'next/cache';

export async function getArticlesAdmin() {
    if (!await isAdmin()) throw new Error('Unauthorized');
    const adminClient = await createAdminClient();

    const { data, error } = await adminClient
        .from('articles')
        .select(`
            *,
            lawyer_members (
                full_name
            ),
            locations (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function upsertArticle(data: any) {
    if (!await isAdmin()) throw new Error('Unauthorized');
    const adminClient = await createAdminClient();

    const articleData = {
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug,
        image_url: data.image_url,
        author_name: data.author_name,
        content: data.content,
        service_category: data.service_category,
        lawyer_id: data.lawyer_id || null,
        location_id: data.location_id || null,
        region: data.region,
        is_published: data.is_published
    };

    if (data.id) {
        const { error } = await adminClient
            .from('articles')
            .update(articleData)
            .eq('id', data.id);
        if (error) throw error;
    } else {
        const { error } = await adminClient
            .from('articles')
            .insert(articleData);
        if (error) throw error;
    }

    revalidatePath('/admin/articles');
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath('/blog');
    return { success: true };
}

export async function deleteArticle(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized');
    const adminClient = await createAdminClient();

    const { error } = await adminClient
        .from('articles')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/articles');
    revalidatePath('/blog');
    return { success: true };
}

export async function getAuthorsAdmin() {
    if (!await isAdmin()) throw new Error('Unauthorized');
    const adminClient = await createAdminClient();

    const { data, error } = await adminClient
        .from('lawyer_members')
        .select('id, full_name')
        .eq('is_active', true)
        .order('full_name');

    if (error) throw error;
    return data;
}

export async function uploadArticleImage(formData: FormData) {
    if (!await isAdmin()) throw new Error('Unauthorized');
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const adminClient = await createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { data, error } = await adminClient.storage
        .from('images')
        .upload(filePath, file, {
            contentType: file.type,
            upsert: true
        });

    if (error) {
        console.error('Storage error:', error);
        throw error;
    }

    const { data: { publicUrl } } = adminClient.storage
        .from('images')
        .getPublicUrl(filePath);

    return publicUrl;
}
