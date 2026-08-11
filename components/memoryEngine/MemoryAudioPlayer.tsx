'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Mic } from 'lucide-react';

export default function MemoryAudioPlayer({
    audioUrl,
    title,
    duration = '01:30',
}: {
    audioUrl: string;
    title: string;
    duration?: string;
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div>
                    <h4 className="font-semibold text-white text-base flex items-center gap-2">
                        <Mic className="w-4 h-4 text-amber-400" /> {title}
                    </h4>
                    <span className="text-xs text-white/50 font-mono">{duration} • Voice Recording</span>
                </div>
            </div>

            {/* Waveform indicator */}
            <div className="flex items-center gap-1">
                {[40, 70, 30, 90, 50, 80, 40, 60].map((h, idx) => (
                    <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-white/20'
                            }`}
                        style={{ height: isPlaying ? `${h}%` : '20%', minHeight: '8px' }}
                    />
                ))}
            </div>
        </div>
    );
}
