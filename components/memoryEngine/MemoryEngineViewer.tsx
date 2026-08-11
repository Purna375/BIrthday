'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MemoryItem } from '@/types/memoryEngine';
import TypewriterText from './TypewriterText';
import ConfettiBurst from './ConfettiBurst';
import MemoryAudioPlayer from './MemoryAudioPlayer';
import FloatingTextFlow from './FloatingTextFlow';

// Lazy load 3D Viewer for performance optimization
const Memory3DViewer = dynamic(() => import('./Memory3DViewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-white/40 font-mono text-xs">
            Loading 3D Canvas Model...
        </div>
    ),
});

export default function MemoryEngineViewer({ item }: { item: MemoryItem }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (item.triggerConfetti) {
            setShowConfetti(true);
        }
    }, [item]);

    return (
        <div className="relative w-full p-6 rounded-3xl bg-slate-950/70 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden space-y-4">
            {/* Optional Confetti Burst */}
            {showConfetti && <ConfettiBurst active={showConfetti} />}

            {/* Memory Title & Description */}
            <div>
                <h3 className="text-xl font-bold text-amber-200">{item.title}</h3>
                {item.description && <p className="text-sm text-white/60 mt-1">{item.description}</p>}
            </div>

            {/* Polymorphic Content Switcher */}
            {item.type === 'letter' && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <TypewriterText text={item.content} speed={item.typewriterSpeed || 35} />
                    {item.author && <p className="mt-4 text-right text-xs font-serif text-amber-300/80">— {item.author}</p>}
                </div>
            )}

            {item.type === 'image' && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-auto max-h-96 object-cover"
                    />
                    {item.caption && <p className="p-3 text-xs text-white/70 italic text-center">{item.caption}</p>}
                </div>
            )}

            {item.type === 'video' && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <video
                        src={item.videoUrl}
                        poster={item.posterUrl}
                        controls
                        preload="metadata"
                        className="w-full h-auto max-h-96"
                    />
                </div>
            )}

            {item.type === 'voiceNote' && (
                <MemoryAudioPlayer audioUrl={item.audioUrl} title={item.title} duration={item.duration} />
            )}

            {item.type === 'object3D' && (
                <Memory3DViewer modelType={item.modelType} color={item.color} rotateSpeed={item.rotateSpeed} />
            )}

            {item.type === 'floatingText' && (
                <FloatingTextFlow messages={item.messages} />
            )}
        </div>
    );
}
