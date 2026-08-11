'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useRevealStore } from '@/store/useRevealStore';
import { PLANETS_DATA } from '@/constants/planets';
import { isDayUnlocked, getTimeUntilUnlock } from '@/utils/progression';
import { Lock, Unlock, Clock, Sparkles } from 'lucide-react';

export default function PlanetCard() {
    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const setSelectedPlanetId = useExperienceStore((state) => state.setSelectedPlanetId);
    const { triggerDay10Reveal } = useRevealStore();

    const selectedPlanet = PLANETS_DATA.find((p) => p.id === selectedPlanetId);
    const [countdownStr, setCountdownStr] = useState<string>('');

    useEffect(() => {
        if (!selectedPlanet) return;
        const updateTimer = () => {
            const result = getTimeUntilUnlock(selectedPlanet.dayNumber);
            setCountdownStr(result.formattedCountdown);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [selectedPlanet]);

    if (!selectedPlanet || planetViewMode === 'surface' || planetViewMode === 'zooming') return null;

    const unlocked = isDayUnlocked(selectedPlanet.dayNumber);
    const isDay10 = selectedPlanet.dayNumber === 10;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 max-w-md w-11/12 p-6 rounded-3xl bg-zinc-950/85 border border-white/15 backdrop-blur-xl shadow-2xl text-white pointer-events-auto flex flex-col gap-3"
            >
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                            Day {selectedPlanet.dayNumber}
                        </span>
                        {unlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <Unlock className="w-3 h-3" /> Unlocked
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <Lock className="w-3 h-3" /> Locked
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => setSelectedPlanetId(null)}
                        className="px-3 py-1 text-xs font-mono uppercase rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/15"
                    >
                        Close ✕
                    </button>
                </div>

                {/* Planet Title */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 10px ${selectedPlanet.color}` }}
                    />
                    <h3 className="text-2xl font-serif text-amber-200 tracking-wider">
                        {selectedPlanet.name}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-sm font-sans leading-relaxed text-zinc-300">
                    {selectedPlanet.description}
                </p>

                {/* Day 10 Special Reveal Trigger Button */}
                {isDay10 && (
                    <button
                        onClick={() => {
                            setSelectedPlanetId(null);
                            triggerDay10Reveal();
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-amber-400 to-purple-500 text-black font-semibold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-black" /> Launch Day 10 Cosmic Reveal
                    </button>
                )}

                {/* Countdown Timer for Locked Planets */}
                {!unlocked && !isDay10 && (
                    <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span className="font-mono text-white/80">Unlocks In:</span>
                        </div>
                        <span className="font-mono font-bold tracking-wider text-amber-300 text-sm">{countdownStr}</span>
                    </div>
                )}

                {/* Footer Action */}
                <div className="pt-2 flex justify-between items-center border-t border-zinc-800/80 text-[11px] font-mono">
                    <span className="text-zinc-500">Orbit: {selectedPlanet.orbitRadius} AU</span>
                    {unlocked ? (
                        <span className="text-emerald-400 font-semibold">Click planet to view memories</span>
                    ) : (
                        <span className="text-amber-400/80">Future planet locked</span>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
