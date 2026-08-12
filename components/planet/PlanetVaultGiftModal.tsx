'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { PLANETS_DATA } from '@/constants/planets';
import { Gift, Heart, Sparkles, Volume2, Play, Pause, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';

export default function PlanetVaultGiftModal() {
    const unlockedVaultGift = useExperienceStore((state) => state.unlockedVaultGift);
    const closeVaultGift = useExperienceStore((state) => state.closeVaultGift);
    const { playClick, playHover } = useAudioStore();

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [activeTab, setActiveTab] = useState<'letter' | 'photo' | 'audio'>('letter');

    const planet = unlockedVaultGift
        ? PLANETS_DATA.find((p) => p.id === unlockedVaultGift.planetId) || PLANETS_DATA[0]
        : PLANETS_DATA[0];
    const dayNumber = unlockedVaultGift ? unlockedVaultGift.dayNumber : 1;

    // Play BGM: Day 1 plays FLute_BGM.mp3, Day 2 plays Chinni Gundelo Song Bgm.mp3, Day 4 plays 3 Movie.mp3
    useEffect(() => {
        if (!unlockedVaultGift) return;

        let trackUrl: string | null = null;
        if (dayNumber === 1) {
            trackUrl = '/audio/planets/FLute_BGM.mp3';
        } else if (dayNumber === 2) {
            trackUrl = '/Chinni Gundelo Song Bgm.mp3';
        } else if (dayNumber === 4) {
            trackUrl = '/audio/planets/3 Movie.mp3';
        }

        if (!trackUrl) return;

        const audio = new Audio(trackUrl);
        audio.loop = true; // auto replay enabled
        audio.volume = 0.6;
        audio.play().catch(() => {});

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [unlockedVaultGift, dayNumber]);

    if (!unlockedVaultGift) return null;

    // Fallback memory gift text
    const defaultLetter = `Dearest Sirivalli Purna,

Welcome to the Day ${dayNumber} Sun Vault of ${planet.name}. 

Every star in this galaxy reflects a beautiful memory of your smile. On this special day, the Heart Sun has unlocked its deepest vault to deliver this message: May your birthday be filled with endless warmth, magical light, and boundless cosmic joy!

Forever cradled in the Singularity of Eternal Love. ✨💖`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    className="relative w-full max-w-2xl p-6 md:p-8 rounded-3xl bg-zinc-950/95 border border-amber-400/40 shadow-[0_0_100px_rgba(245,158,11,0.4)] text-white flex flex-col gap-6 overflow-hidden max-h-[90vh]"
                >
                    {/* Glowing Flare Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

                    {/* Top Header Badge */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 text-black shadow-lg">
                                <Gift className="w-6 h-6 animate-bounce" />
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    <Sparkles className="w-3 h-3 text-amber-400" /> Gift of Day {dayNumber} Unlocked
                                </span>
                                <h2 className="text-2xl font-serif text-amber-200 tracking-wider mt-1">
                                    {planet.name} Sun Vault Present
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={closeVaultGift}
                            className="px-4 py-1.5 text-xs font-mono uppercase rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors cursor-pointer border border-white/10"
                        >
                            Close ✕
                        </button>
                    </div>

                    {/* Content Selector Tabs */}
                    <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                        <button
                            onClick={() => { playHover(); setActiveTab('letter'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'letter'
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" /> Birthday Letter
                        </button>
                        <button
                            onClick={() => { playHover(); setActiveTab('photo'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'photo'
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white'
                                }`}
                        >
                            <ImageIcon className="w-4 h-4" /> Cosmic Memory Photo
                        </button>
                        <button
                            onClick={() => { playHover(); setActiveTab('audio'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'audio'
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white'
                                }`}
                        >
                            <Volume2 className="w-4 h-4" /> Voice Note
                        </button>
                    </div>

                    {/* Active Tab Content Display */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        {activeTab === 'letter' && (
                            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 font-serif text-sm leading-relaxed whitespace-pre-line shadow-inner">
                                {planet.content?.letters?.[0]?.body || defaultLetter}
                            </div>
                        )}

                        {activeTab === 'photo' && (
                            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
                                {planet.content?.photos?.[0]?.url ? (
                                    <img
                                        src={planet.content.photos[0].url}
                                        alt={planet.name}
                                        className="w-full max-h-64 object-cover rounded-xl border border-amber-400/30 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-48 rounded-xl bg-zinc-900 border border-dashed border-amber-500/30 flex flex-col items-center justify-center text-amber-300/60 gap-2">
                                        <Sparkles className="w-8 h-8" />
                                        <span className="text-xs font-mono">Cosmic Memory Photograph Unlocked</span>
                                    </div>
                                )}
                                <p className="text-xs text-zinc-300 font-sans italic">
                                    {planet.content?.photos?.[0]?.caption || 'A timeless moment captured under the stars.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'audio' && (
                            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
                                <div className="p-4 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                                    <Volume2 className="w-8 h-8 animate-pulse" />
                                </div>
                                <h4 className="text-sm font-bold text-amber-200 font-mono uppercase">
                                    {planet.content?.voiceNotes?.[0]?.title || `Day ${dayNumber} Voice Whispers`}
                                </h4>
                                <p className="text-xs text-zinc-400 max-w-sm">
                                    Listen to the secret voice note saved inside the {planet.name} Sun Vault.
                                </p>

                                <button
                                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                    className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer shadow-lg"
                                >
                                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    <span>{isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Badge */}
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-amber-300/80">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> Permanently Saved in Memory Vault
                        </span>
                        <button
                            onClick={closeVaultGift}
                            className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Continue Cosmic Journey
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
