'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Maximize2, Minimize2, RotateCcw, Heart } from 'lucide-react';

interface Props {
    onClose?: () => void;
}

export default function DanceVideoGift({ onClose }: Props) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const bgmRef = useRef<HTMLAudioElement | null>(null);

    // Play 3_Movie.mp3 BGM for Day 4 gift with auto replay / loop enabled
    useEffect(() => {
        const audio = new Audio('/audio/planets/3_Movie.mp3');
        audio.loop = true; // auto replay enabled
        audio.volume = 0.6;
        audio.play().catch(() => {});
        bgmRef.current = audio;

        return () => {
            audio.pause();
            audio.currentTime = 0;
            bgmRef.current = null;
        };
    }, []);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-y-auto pointer-events-auto ${isFullscreen ? 'p-0' : 'p-3 md:p-6'}`}>
            {/* Ambient Solar Lava Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-zinc-950 to-black pointer-events-none" />

            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {isRevealed && (
                    <>
                        <button
                            onClick={() => setIframeKey((prev) => prev + 1)}
                            className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-red-500/20 text-red-200 border border-red-500/40 hover:bg-red-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                            title="Restart Experience"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Restart</span>
                        </button>

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-red-500/20 text-red-200 border border-red-500/40 hover:bg-red-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                        </button>

                        <button
                            onClick={() => setIsRevealed(false)}
                            className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-red-500/20 text-red-200 border border-red-500/40 hover:bg-red-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                            <span>Close Cover 🎬</span>
                        </button>
                    </>
                )}

                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
            </div>

            <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-4">
                {!isRevealed ? (
                    /* COVER STAGE: UNLOCK CARD */
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6 text-center max-w-md"
                    >
                        <div className="relative w-44 h-44 rounded-full border-4 border-red-500/60 bg-gradient-to-tr from-red-950 via-zinc-950 to-zinc-900 flex items-center justify-center shadow-[0_0_80px_rgba(239,68,68,0.5)]">
                            <div className="p-5 rounded-full bg-red-500/20 border border-red-400 text-red-300 animate-pulse">
                                <Flame className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-red-400" /> Day 4 Solaria Secret
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-wide">
                                Interactive Dance Stage
                            </h3>
                            <p className="text-xs text-zinc-400 font-sans max-w-xs">
                                Tap below to unveil the special HTML5 surprise dance experience created for Sirivalli.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsRevealed(true)}
                            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_30px_rgba(239,68,68,0.6)] flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                        >
                            <Heart className="w-4 h-4 fill-white" />
                            <span>Reveal Day 4 Dance Gift 🎬</span>
                        </button>
                    </motion.div>
                ) : (
                    /* REVEAL STAGE: EMBEDDED IFRAME EXPERIENCE */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex flex-col items-center gap-4"
                    >
                        <div className="text-center">
                            <span className="text-xs font-mono uppercase tracking-widest text-red-400 flex items-center justify-center gap-2">
                                <Flame className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                                DAY 4 SOLARIA • DANCE VAULT UNLOCKED
                            </span>
                        </div>

                        <div className={`relative w-full rounded-2xl border-2 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.4)] overflow-hidden bg-black ${isFullscreen ? 'h-[90vh]' : 'h-[70vh] min-h-[450px] max-h-[650px]'}`}>
                            <iframe
                                key={iframeKey}
                                src="/day4suprise.html"
                                title="Day 4 Dance Surprise"
                                className="w-full h-full border-none"
                                allow="autoplay; fullscreen"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
