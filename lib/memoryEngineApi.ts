import { MemoryItem, PlanetMemoryPayload } from '@/types/memoryEngine';
import { PLANETS_DATA } from '@/constants/planets';

// In-memory cache for ultra fast client performance
const memoryCache = new Map<string, MemoryItem[]>();

/**
 * Reusable client helper to lazily fetch memories for any planet.
 */
export async function fetchPlanetMemories(planetId: string): Promise<MemoryItem[]> {
    if (memoryCache.has(planetId)) {
        return memoryCache.get(planetId)!;
    }

    try {
        const res = await fetch(`/api/memories/${planetId}`);
        if (res.ok) {
            const data: PlanetMemoryPayload = await res.json();
            if (data.items && data.items.length > 0) {
                memoryCache.set(planetId, data.items);
                return data.items;
            }
        }
    } catch (error) {
        console.warn(`API fetch for ${planetId} memories failed, using static fallback:`, error);
    }

    // Fallback: Construct MemoryItem list from PLANETS_DATA
    const planet = PLANETS_DATA.find((p) => p.id === planetId);
    const items: MemoryItem[] = [];

    if (planet && planet.content) {
        const { letters, photos, voiceNotes, videos } = planet.content;

        if (letters && letters.length > 0) {
            letters.forEach((l) => {
                items.push({
                    id: l.id || `letter-${l.title}`,
                    type: 'letter',
                    title: l.title,
                    content: l.body || '',
                    author: l.author || 'Nee Pichodu',
                    triggerConfetti: true,
                });
            });
        }

        if (photos && photos.length > 0) {
            photos.forEach((p) => {
                items.push({
                    id: p.id || `photo-${p.title}`,
                    type: 'image',
                    imageUrl: p.url,
                    title: p.title,
                    caption: p.caption,
                });
            });
        }

        if (voiceNotes && voiceNotes.length > 0) {
            voiceNotes.forEach((v) => {
                items.push({
                    id: v.id || `voice-${v.title}`,
                    type: 'voiceNote',
                    title: v.title,
                    audioUrl: v.audioUrl,
                    duration: v.duration,
                });
            });
        }

        if (videos && videos.length > 0) {
            videos.forEach((vid) => {
                items.push({
                    id: vid.id || `video-${vid.title}`,
                    type: 'video',
                    title: vid.title,
                    videoUrl: vid.url,
                });
            });
        }
    }

    if (items.length === 0) {
        items.push({
            id: `default-letter-${planetId}`,
            type: 'letter',
            title: `${planetId.toUpperCase()} Memory Archive`,
            content: `Welcome to the memory archive of ${planetId}. Unlocks new memories dynamically!`,
            typewriterSpeed: 35,
        });
    }

    memoryCache.set(planetId, items);
    return items;
}

