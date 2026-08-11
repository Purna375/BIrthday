'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disc, Play, Pause, Music, Volume2 } from 'lucide-react';

interface Props {
    onClose?: () => void;
}

const SONGS = [
    {
        title: 'Nuvvu Korukuna Varam',
        artist: 'Lyrics written by your Nani ✍️❤️',
        duration: 'Special Track',
        src: '/audio/Nuvvu korukuna varam.mp3',
    }
];

export default function SoundtrackGift({ onClose }: Props) {
    const [isUnsealed, setIsUnsealed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSong, setActiveSong] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, activeSong]);

    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto pointer-events-auto">
            {/* Ambient Cyan Aura Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-zinc-950 to-black pointer-events-none" />

            <audio
                ref={audioRef}
                src={SONGS[activeSong].src}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {onClose && (
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            onClose();
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
                {isUnsealed && (
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            setIsUnsealed(false);
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Sleeve Vinyl Record 🎶</span>
                    </button>
                )}

                {onClose && (
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            onClose();
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
            </div>

            <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-6">
                {!isUnsealed ? (
                    /* STAGE 1: SEALED VINYL ALBUM SLEEVE */
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        onClick={() => setIsUnsealed(true)}
                        className="group relative cursor-pointer flex flex-col items-center gap-6 w-full max-w-md text-center"
                    >
                        {/* Vinyl Record Jacket Object */}
                        <div className="relative w-64 h-64 rounded-3xl bg-gradient-to-tr from-cyan-950 via-zinc-900 to-cyan-900 border-4 border-cyan-400/80 flex flex-col items-center justify-center p-6 shadow-[0_0_80px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                            {/* Vinyl Record Peeking Out */}
                            <div className="absolute -right-12 top-6 w-48 h-48 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl group-hover:translate-x-4 transition-transform duration-500 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center">
                                    <Disc className="w-8 h-8 text-cyan-300 animate-spin-slow" />
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="p-4 rounded-full bg-cyan-500/30 border-2 border-cyan-300 text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                                    <Music className="w-8 h-8 text-cyan-200 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                                    Aura Nova Album
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-2">
                                <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Day 5 Music Vault
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-white tracking-wide">
                                Custom Cosmic Love Soundtrack
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-5 py-2.5 rounded-full border border-cyan-500/40 mt-2 group-hover:bg-cyan-900/80 transition-colors">
                                🎶 Tap Album Jacket to Slide Out Record
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* STAGE 2: UNSEALED TURNTABLE & EQUALIZER */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center gap-6"
                    >
                        <div className="text-center flex flex-col items-center gap-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                                AURA NOVA TURNTABLE • NOW PLAYING
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-cyan-100">
                                {SONGS[activeSong].title}
                            </h3>
                        </div>

                        {/* Spinning Vinyl Lounge Player */}
                        <div className="relative w-full max-w-lg p-8 rounded-3xl bg-zinc-950/90 border-2 border-cyan-500/60 shadow-[0_0_80px_rgba(6,182,212,0.5)] flex flex-col items-center gap-6 overflow-hidden">
                            {/* Vinyl Record */}
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                                className="w-44 h-44 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl relative"
                            >
                                <div className="w-16 h-16 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center">
                                    <Disc className="w-10 h-10 text-cyan-300" />
                                </div>
                            </motion.div>

                            {/* Equalizer Pulsing Waves */}
                            <div className="flex items-end gap-1.5 h-10 my-1">
                                {[40, 75, 50, 90, 60, 100, 45, 80, 55, 70].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full transition-all duration-300"
                                        style={{ height: isPlaying ? `${h}%` : '20%' }}
                                    />
                                ))}
                            </div>

                            {/* Song Details & Play Toggle */}
                            <div className="flex flex-col items-center gap-4 text-center">
                                <span className="text-xs text-cyan-300 font-mono">
                                    {SONGS[activeSong].artist}
                                </span>

                                <button
                                    onClick={togglePlay}
                                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                    <span>{isPlaying ? 'Pause Track' : 'Play Track'}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
