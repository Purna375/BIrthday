'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Camera } from 'lucide-react';

interface Props {
    onClose?: () => void;
}

const PHOTOS = [
    {
        id: 1,
        title: 'Naa Potti & Pichodu Smile',
        caption: 'Holding you close and smiling together — my happiest place in the universe. ❤️',
        url: '/images/image1day2.png',
        date: 'Day 2 Special'
    },
    {
        id: 2,
        title: 'Loving Gaze under Celestia Skies',
        caption: 'The way you look at me with so much love makes my heart melt every single time. 🥺✨',
        url: '/images/image2day2.png',
        date: 'Celestial Orbit'
    },
    {
        id: 3,
        title: 'Warm Cosmic Hug',
        caption: 'Wrapped safely in arms — forever protecting you, my Ammalu. 🫂💖',
        url: '/images/image3day2.png',
        date: 'Forever Stars'
    },
];

export default function PhotoGalaxyGift({ onClose }: Props) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const activePhoto = PHOTOS[activeIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto pointer-events-auto">
            {/* Cosmic Violet Nebula Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-black pointer-events-none" />

            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {isRevealed && (
                    <button
                        onClick={() => setIsRevealed(false)}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40 hover:bg-purple-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Re-lock Stargate 🌌</span>
                    </button>
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

            <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-6">
                {!isRevealed ? (
                    /* STAGE 1: STARGATE REVEAL GATEWAY */
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        onClick={() => setIsRevealed(true)}
                        className="group relative cursor-pointer flex flex-col items-center gap-6 w-full max-w-md text-center"
                    >
                        {/* Glowing Stargate Ring */}
                        <div className="relative w-48 h-48 rounded-full border-4 border-purple-400/80 bg-gradient-to-tr from-purple-900/50 via-indigo-900/30 to-purple-950 flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.7)] group-hover:scale-105 transition-transform duration-500">
                            {/* Rotating Inner Star Rings */}
                            <div className="absolute inset-2 rounded-full border-2 border-dashed border-purple-300/60 animate-spin-slow" />
                            <div className="absolute inset-6 rounded-full border border-purple-400/40 animate-ping opacity-75" />

                            <div className="p-5 rounded-full bg-purple-600/30 border-2 border-purple-300 text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.8)] group-hover:rotate-12 transition-transform">
                                <Camera className="w-12 h-12 text-purple-200 animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Day 2 Memory Vault
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-white tracking-wide">
                                Cosmic Photo Galaxy Archive
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-purple-300 bg-purple-900/40 px-4 py-2 rounded-full border border-purple-500/30 mt-2 group-hover:bg-purple-800/60 transition-colors">
                                🌌 Tap Stargate to Open Photo Galaxy
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* STAGE 2: 3D POLAROID FAN-OUT ARCHIVE */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center gap-6"
                    >
                        {/* Stargate Burst Header */}
                        <div className="text-center flex flex-col items-center gap-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
                                CELESTIA PHOTO ARCHIVE • UNLOCKED
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-purple-100">
                                {activePhoto.title}
                            </h3>
                        </div>

                        {/* Active Polaroid Card Display */}
                        <motion.div
                            key={activePhoto.id}
                            initial={{ opacity: 0, y: 20, rotate: -2 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            className="relative w-full max-w-lg p-5 md:p-6 rounded-3xl bg-zinc-950/90 border-2 border-purple-500/60 shadow-[0_0_70px_rgba(168,85,247,0.5)] flex flex-col gap-4 overflow-hidden"
                        >
                            {/* Polaroid Image Frame */}
                            <div className="relative w-full aspect-[4/3] rounded-2xl bg-zinc-900 border border-purple-500/30 overflow-hidden flex items-center justify-center shadow-inner group">
                                <img
                                    src={activePhoto.url}
                                    alt={activePhoto.title}
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-500/40 shadow-md">
                                    {activePhoto.date}
                                </div>
                            </div>

                            {/* Caption Box */}
                            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-md flex items-start gap-3">
                                <Heart className="w-5 h-5 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
                                <p className="text-xs md:text-sm text-purple-200 font-serif italic leading-relaxed">
                                    "{activePhoto.caption}"
                                </p>
                            </div>
                        </motion.div>

                        {/* Orbiting Polaroid Selectors */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            {PHOTOS.map((photo, idx) => (
                                <button
                                    key={photo.id}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`px-5 py-2.5 rounded-full font-mono text-xs border transition-all cursor-pointer flex items-center gap-2 ${idx === activeIndex
                                        ? 'bg-purple-500/30 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105'
                                        : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:border-purple-400/60'
                                        }`}
                                >
                                    <Camera className="w-3.5 h-3.5 text-purple-300" />
                                    <span>Memory #{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
