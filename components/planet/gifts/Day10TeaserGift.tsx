'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Key, CheckCircle2, Flower2 } from 'lucide-react';
import GlowingLotus3D from '@/components/3d/GlowingLotus3D';

interface Props {
    onClose?: () => void;
}

export default function Day10TeaserGift({ onClose }: Props) {
    const [isFused, setIsFused] = useState(false);
    const [triggerBloom, setTriggerBloom] = useState(0);
    const bgmRef = useRef<HTMLAudioElement | null>(null);

    // Play dheema_instrumental_bgm.mp3 once when lotus bloom starts
    useEffect(() => {
        if (isFused) {
            const audio = new Audio('/audio/dheema_instrumental_bgm.mp3');
            audio.loop = false; // plays once
            audio.volume = 0.7;
            audio.play().catch(() => {});
            bgmRef.current = audio;

            return () => {
                audio.pause();
                audio.currentTime = 0;
                bgmRef.current = null;
            };
        }
    }, [isFused]);

    const handleRebloom = () => {
        setTriggerBloom((prev) => prev + 1);

        // Restart dheema bgm from start when user clicks Bloom Again
        if (bgmRef.current) {
            bgmRef.current.currentTime = 0;
            bgmRef.current.play().catch(() => {});
        } else {
            const audio = new Audio('/audio/dheema_instrumental_bgm.mp3');
            audio.loop = false;
            audio.volume = 0.7;
            audio.play().catch(() => {});
            bgmRef.current = audio;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto pointer-events-auto">
            {/* Ambient Celestial Aura Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-pink-950/20 to-black pointer-events-none" />

            {/* Top Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
            </div>

            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-4">
                {!isFused ? (
                    /* STAGE 1: OPENING CARD */
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        onClick={() => setIsFused(true)}
                        className="group relative cursor-pointer flex flex-col items-center gap-6 w-full max-w-md text-center py-8"
                    >
                        <div className="relative w-56 h-56 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-950 via-rose-950/40 to-zinc-950 flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.7)] group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/60 animate-spin-slow" />
                            <div className="absolute inset-6 rounded-full border border-amber-400/40 animate-ping opacity-75" />
                            <div className="p-6 rounded-full bg-gradient-to-br from-amber-500/40 to-pink-600/40 border-2 border-amber-300 text-amber-100 shadow-[0_0_35px_rgba(245,158,11,0.8)] group-hover:rotate-12 transition-transform">
                                <Flower2 className="w-14 h-14 text-amber-200 animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Day 9 Eternia Singularity
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-wide">
                                Crystal Glass Lotus
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-amber-300 bg-amber-950/80 px-6 py-3 rounded-full border border-amber-500/40 mt-2 group-hover:bg-amber-900 transition-colors shadow-lg">
                                ✨ Tap to Watch the Lotus Bloom
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* STAGE 2: CRYSTAL GLASS LOTUS BLOOM */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center gap-4"
                    >
                        {/* Title Header */}
                        <div className="text-center flex flex-col items-center gap-1.5">
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                                ETERNIA SINGULARITY • 9 OF 9 PLANETS UNLOCKED
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-amber-100">
                                DAY 10 GRAND SINGULARITY KEY UNLOCKED! 👑
                            </h3>
                            <p className="text-xs text-rose-200/90 font-sans italic opacity-90 max-w-lg">
                                &ldquo;A crystal glass lotus blooms in eternal light — petal by petal, rising from the depths.&rdquo;
                            </p>
                        </div>

                        {/* Lotus Canvas Viewport */}
                        <div className="relative w-full max-w-4xl h-[58vh] min-h-[400px] max-h-[600px] rounded-3xl border-2 border-amber-400/50 shadow-[0_0_90px_rgba(245,158,11,0.45)] overflow-hidden">
                            <GlowingLotus3D
                                triggerBloom={triggerBloom}
                                className="w-full h-full"
                            />

                            {/* Re-bloom Button — bottom center overlay */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                                <button
                                    onClick={handleRebloom}
                                    className="px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-rose-500/80 via-pink-500/80 to-amber-500/80 hover:from-rose-400/90 hover:to-amber-400/90 text-white shadow-[0_0_24px_rgba(255,100,150,0.5)] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-white/20 backdrop-blur-md"
                                >
                                    <Flower2 className="w-4 h-4" />
                                    <span>Bloom Again 🌸</span>
                                </button>
                            </div>
                        </div>

                        {/* Grand Key Unlock Badge */}
                        <div className="w-full max-w-4xl p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-pink-950/60 border border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 shrink-0">
                                    <Key className="w-6 h-6 animate-bounce" />
                                </div>
                                <div>
                                    <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider block">
                                        Singularity Key Status
                                    </span>
                                    <p className="text-xs text-zinc-300 font-sans">
                                        All 9 planetary keys fused. Day 10 Singularity Heart Sun Gateway Unlocks on Day 10 ✨
                                    </p>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-200 font-mono text-xs flex items-center gap-2 shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="font-bold tracking-wider">9 OF 9 VAULTS SOLVED</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
