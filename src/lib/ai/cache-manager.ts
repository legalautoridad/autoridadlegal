import { GoogleGenAI } from '@google/genai';


const CACHE_DISPLAY_NAME = 'al-context-cache-daily';
// The cache will expire in 24 hours
const TTL_SECONDS = 24 * 60 * 60; 

let localCacheName: string | null = null;
let localCacheExpiration: Date | null = null;

export function invalidateLocalCache() {
    localCacheName = null;
    localCacheExpiration = null;
}

export async function getActiveCacheName(): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

    // 1. Check local memory
    if (localCacheName && localCacheExpiration && new Date() < localCacheExpiration) {
        return localCacheName;
    }

    try {
        console.log('[CACHE MANAGER] Checking Google API for active cache...');
        let existingCacheName: string | null = null;
        let existingCacheExpire: string | undefined;

        // Iterate through Pager<CachedContent>
        const pager = await ai.caches.list();
        for await (const c of pager) {
            if (c.displayName === CACHE_DISPLAY_NAME) {
                existingCacheName = c.name || null;
                existingCacheExpire = c.expireTime;
                break;
            }
        }
        
        if (existingCacheName && existingCacheExpire) {
            console.log('[CACHE MANAGER] Found existing cache in API:', existingCacheName);
            localCacheName = existingCacheName;
            localCacheExpiration = new Date(new Date(existingCacheExpire).getTime() - 60000);
            return existingCacheName;
        }

        // 3. No cache exists -> Create it dynamically
        console.log('[CACHE MANAGER] No active cache found. Recreating dynamically...');
        const newCacheName = await createNewCache(ai);
        
        if (newCacheName) {
            localCacheName = newCacheName;
            localCacheExpiration = new Date(Date.now() + (TTL_SECONDS * 1000) - 60000);
            return newCacheName;
        }
        
        return null;

    } catch (error) {
        console.error('[CACHE MANAGER] Error fetching/creating cache:', error);
        return null;
    }
}

async function createNewCache(ai: GoogleGenAI): Promise<string | null> {
    try {
        const { createAdminClient } = await import('@/lib/supabase/server');
        const supabase = await createAdminClient();
        const { data: files, error } = await supabase.storage.from('al-context-cache').list();
        
        if (error) {
            throw new Error(`Failed to list bucket: ${error.message}`);
        }

        if (!files || files.length === 0) {
            console.warn('[CACHE MANAGER] Bucket "al-context-cache" is empty.');
            return null;
        }

        // Fetch System Prompt for Cache
        const { data: configData } = await supabase
            .from('ai_config')
            .select('value')
            .eq('key', 'system_prompt')
            .maybeSingle();
        
        const systemPrompt = configData?.value || "Eres un asistente legal experto.";

        const contentsParts: any[] = [];
        contentsParts.push({ text: `[INSTRUCCIONES DEL SISTEMA]\n${systemPrompt}\n\n[DOCUMENTOS DE REFERENCIA INFERIORES]:` });

        for (const file of files) {
            if (file.name.startsWith('.') || file.id === null) continue;
            
            console.log(`[CACHE MANAGER] Downloading ${file.name} from Supabase...`);
            const { data: fileBlob, error: downloadError } = await supabase.storage.from('al-context-cache').download(file.name);
            
            if (downloadError || !fileBlob) continue;

            const buffer = await fileBlob.arrayBuffer();
            
            if (file.name.endsWith('.pdf')) {
                const fs = await import('fs/promises');
                const path = await import('path');
                const os = await import('os');
                
                const tempFilePath = path.join(os.tmpdir(), file.name);
                await fs.writeFile(tempFilePath, Buffer.from(buffer));
                
                console.log(`[CACHE MANAGER] Uploading ${file.name} to Gemini File API...`);
                const uploadedFile = await ai.files.upload({ 
                    file: tempFilePath,
                    config: {
                        mimeType: 'application/pdf',
                    }
                });
                
                contentsParts.push({
                    fileData: {
                        fileUri: uploadedFile.uri,
                        mimeType: 'application/pdf'
                    }
                });
                
                await fs.unlink(tempFilePath).catch(console.error);
                
            } else {
                const textContent = new TextDecoder('utf-8').decode(buffer);
                contentsParts.push({ text: `\n\n--- DOCUMENTO: ${file.name} ---\n${textContent}` });
            }
        }

        console.log('[CACHE MANAGER] Content prepared. Triggering Google Cache API...');
        const cache = await ai.caches.create({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            config: {
                contents: [
                    {
                        role: 'user',
                        parts: contentsParts
                    }
                ],
                displayName: CACHE_DISPLAY_NAME,
                ttl: `${TTL_SECONDS}s` 
            }
        });

        console.log('[CACHE MANAGER] Cache successfully created:', cache.name);
        if (!cache.name) return null;
        return cache.name;

    } catch (error) {
        console.error('[CACHE MANAGER] Critical Error creating cache:', error);
        return null;
    }
}
