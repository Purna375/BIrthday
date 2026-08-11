import { NextResponse } from 'next/server';
import { MemoryItem } from '@/types/memoryEngine';

export const dynamic = 'force-dynamic';

// Mock Memory Database per Planet ID
const MEMORIES_DB: Record<string, MemoryItem[]> = {
    aetheria: [
        {
            id: 'letter-1',
            type: 'letter',
            title: 'Naa Potti... naa Ammalu... ❤️🥺',
            description: 'A special message written from the heart under the stars.',
            content: 'Ee letter ela start cheyyalo chala sepu alochinchaa... endhukante ninnu gurinchi rayali ante oka rendu pages saripovu ani naaku telusu. Kani ee sari "I love you" ani cheppadam kosam kaadhu raa... **nuv naa life lo entha deep ga part ayyavo cheppadaniki** rastunna. 🥹❤️',
            author: 'Nee Pichodu',
            triggerConfetti: true,
            typewriterSpeed: 30,
        },
        {
            id: 'voice-1',
            type: 'voiceNote',
            title: 'Birthday Morning Note',
            audioUrl: '/audio/planets/voice-placeholder.mp3',
            duration: '01:15',
        },
        {
            id: 'object-1',
            type: 'object3D',
            title: 'Crystalline Heart Artifact',
            description: 'Interactive 3D crystal heart symbolising eternal joy.',
            modelType: 'heart',
            color: '#ff69b4',
            rotateSpeed: 1.2,
        },
        {
            id: 'floating-1',
            type: 'floatingText',
            title: 'Celestial Wishes',
            messages: ['May your dreams shine bright!', 'Happy Birthday to you!', 'Always keep smiling!'],
        },
    ],
    celestia: [
        {
            id: 'celestia-photo-1',
            type: 'image',
            title: 'Naa Potti & Pichodu Smile',
            imageUrl: '/images/image1day2.png',
            caption: 'Holding you close and smiling together — my happiest place in the universe. ❤️',
        },
        {
            id: 'celestia-photo-2',
            type: 'image',
            title: 'Loving Gaze under Celestia Skies',
            imageUrl: '/images/image2day2.png',
            caption: 'The way you look at me with so much love makes my heart melt every single time. 🥺✨',
        },
        {
            id: 'celestia-photo-3',
            type: 'image',
            title: 'Warm Cosmic Hug',
            imageUrl: '/images/image3day2.png',
            caption: 'Wrapped safely in arms — forever protecting you, my Ammalu. 🫂💖',
        },
        {
            id: 'celestia-letter-1',
            type: 'letter',
            title: 'Celestia Violet Starlight Letter 💜',
            description: 'Day 2 cosmic memory message.',
            content: 'Naa Ammalu... Day 2 planet Celestia ki welcome! 🌌 Violet mist and star sparkles madhya, ninnu chusina prathi moment oka magic pattern la anipistundi. Mana togetherness photo memories ivi... whenever you look at these, remember that you are loved beyond words. Forever yours... Nee Pichodu. 💜✨',
            author: 'Nee Pichodu',
            triggerConfetti: true,
            typewriterSpeed: 25,
        },
    ],
    solaria: [
        {
            id: 'solaria-object',
            type: 'object3D',
            title: 'Volcanic Core Crystal',
            modelType: 'crystal',
            color: '#ef4444',
            rotateSpeed: 1.5,
        },
    ],
    zephyria: [
        {
            id: 'zephyria-voice-1',
            type: 'voiceNote',
            title: 'Secret Birthday Voice Note for Zephyria',
            audioUrl: '/audio/voice_gift.mpeg',
            duration: 'Special Voice Note',
        },
        {
            id: 'zephyria-object',
            type: 'object3D',
            title: 'Frozen Star Fragment',
            modelType: 'star',
            color: '#38bdf8',
            rotateSpeed: 0.8,
        },
    ],
    astralia: [
        {
            id: 'astralia-photo-1',
            type: 'image',
            title: 'You Are Amazing 🤩',
            imageUrl: '/images/image1day7.png',
            caption: 'Standing confident by the ocean blue — your energy shines brighter than any wave. 🌊',
        },
        {
            id: 'astralia-photo-2',
            type: 'image',
            title: 'Most Beautiful Person on Earth 💯',
            imageUrl: '/images/image2day7.png',
            caption: 'That effortless backward glance that instantly steals my heart every single time. ✨',
        },
        {
            id: 'astralia-photo-3',
            type: 'image',
            title: 'And Cutest 🎀',
            imageUrl: '/images/image3day7.png',
            caption: 'Posing proudly in traditional green — looking absolute elegant & cute, my Ammalu. 💚',
        },
        {
            id: 'astralia-photo-4',
            type: 'image',
            title: 'Golden Hour Royalty 👑',
            imageUrl: '/images/image4day7.png',
            caption: 'Wrapped in a golden saree under soft sunset glow — a timeless, breathtaking portrait. 🌅',
        },
        {
            id: 'astralia-photo-5',
            type: 'image',
            title: 'Rooftop Starlight Smile 💙',
            imageUrl: '/images/image5day7.png',
            caption: 'Sky high above the world, your sweet smile brings pure peace to my soul. ☁️',
        },
        {
            id: 'astralia-photo-6',
            type: 'image',
            title: 'Heart Hands by the Ocean 💖',
            imageUrl: '/images/image6day7.png',
            caption: 'Sitting on cosmic rocks making a heart for me — you are my entire world. 🌊❤️',
        },
        {
            id: 'astralia-photo-7',
            type: 'image',
            title: 'Forever Love in Red Saree ❤️',
            imageUrl: '/images/image7day7.png',
            caption: 'Glowing in traditional red with a gentle smile — I love you beyond infinity. ♾️❤️',
        },
    ],
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ planetId: string }> }
) {
    const { planetId } = await params;
    const items = MEMORIES_DB[planetId] || [
        {
            id: `default-letter-${planetId}`,
            type: 'letter',
            title: `${planetId.toUpperCase()} Memory Archive`,
            content: `Welcome to the memory archive of ${planetId}. Unlocks new memories dynamically!`,
            typewriterSpeed: 35,
        },
    ];

    return NextResponse.json({
        planetId,
        title: `${planetId} Memory Payload`,
        items,
    });
}

