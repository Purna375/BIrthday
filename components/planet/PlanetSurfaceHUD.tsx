'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { PLANETS_DATA } from '@/constants/planets';
import { isDayUnlocked, getTimeUntilUnlock } from '@/utils/progression';
import {
    ArrowLeft,
    Sparkles,
    Lock,
    Clock,
    Volume2,
    VolumeX,
    SunMedium,
    Compass,
    Eye,
} from 'lucide-react';

export default function PlanetSurfaceHUD() {
    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const exitPlanetSurface = useExperienceStore((state) => state.exitPlanetSurface);

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [countdownStr, setCountdownStr] = useState<string>('');
    const [showInfoPanel, setShowInfoPanel] = useState(true);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const planet = useMemo(
        () => PLANETS_DATA.find((p) => p.id === selectedPlanetId),
        [selectedPlanetId]
    );

    const unlocked = planet ? isDayUnlocked(planet.dayNumber) : false;

    useEffect(() => {
        if (!planet || unlocked) return;

        const updateTimer = () => {
            const result = getTimeUntilUnlock(planet.dayNumber);
            setCountdownStr(result.formattedCountdown);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [planet, unlocked]);

    const activePuzzlePlanetId = useExperienceStore((state) => state.activePuzzlePlanetId);
    const unlockedVaultGift = useExperienceStore((state) => state.unlockedVaultGift);

    useEffect(() => {
        const isGiftOrPuzzleOpen = activePuzzlePlanetId !== null || unlockedVaultGift !== null;

        if (planet?.backgroundAudio && unlocked && planetViewMode === 'surface' && !isGiftOrPuzzleOpen) {
            if (!audioRef.current) {
                audioRef.current = new Audio(planet.backgroundAudio);
                audioRef.current.loop = true;
                audioRef.current.volume = 0.4;
            }
            audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => { });
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlayingAudio(false);
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setIsPlayingAudio(false);
            }
        };
    }, [planet, unlocked, planetViewMode, activePuzzlePlanetId, unlockedVaultGift]);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlayingAudio) {
            audioRef.current.pause();
            setIsPlayingAudio(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlayingAudio(true);
        }
    };

    const solvedPlanetIds = useExperienceStore((state) => state.solvedPlanetIds);
    const openPlanetPuzzle = useExperienceStore((state) => state.openPlanetPuzzle);
    const triggerSupernovaBlast = useExperienceStore((state) => state.triggerSupernovaBlast);

    if (planetViewMode !== 'surface' || !planet) return null;

    const themeColor = planet.customTheme?.primaryColor || planet.color;
    const isSolved = solvedPlanetIds.includes(planet.id);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 md:p-8">
                {/* Top Navigation Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between pointer-events-auto"
                >
                    {/* Planet Title & Badge */}
                    <div className="flex items-center gap-4 bg-slate-950/75 border border-white/15 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-2xl">
                        <div
                            className="w-4 h-4 rounded-full animate-pulse shadow-lg"
                            style={{ backgroundColor: themeColor, boxShadow: `0 0 16px ${themeColor}` }}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase tracking-widest font-mono text-amber-400">
                                    Day {planet.dayNumber} Surface Vault
                                </span>
                                {unlocked ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                        Unlocked Realm
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Sealed
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{planet.name} Surface</h1>
                        </div>
                    </div>

                    {/* Controls & Return to Orbit Button */}
                    <div className="flex items-center gap-3">
                        {planet.backgroundAudio && unlocked && (
                            <button
                                onClick={toggleAudio}
                                className="p-3 rounded-2xl bg-slate-950/75 hover:bg-white/10 border border-white/15 text-white transition-all shadow-xl backdrop-blur-xl cursor-pointer"
                                title="Toggle Planet Ambient Music"
                            >
                                {isPlayingAudio ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-white/50" />}
                            </button>
                        )}

                        <button
                            onClick={() => setShowInfoPanel(!showInfoPanel)}
                            className="p-3 rounded-2xl bg-slate-950/75 hover:bg-white/10 border border-white/15 text-white transition-all shadow-xl backdrop-blur-xl cursor-pointer"
                            title="Toggle Lore Panel"
                        >
                            <Eye className="w-5 h-5 text-amber-300" />
                        </button>

                        <button
                            onClick={exitPlanetSurface}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-500/40 text-amber-200 font-medium text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.2)] backdrop-blur-xl hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Orbit</span>
                        </button>
                    </div>
                </motion.div>

                {/* Bottom Information Panel */}
                <AnimatePresence>
                    {showInfoPanel && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.4 }}
                            className="pointer-events-auto max-w-xl self-start bg-slate-950/80 border border-white/15 p-6 rounded-3xl backdrop-blur-xl shadow-2xl text-white space-y-4"
                            style={{
                                boxShadow: `0 0 40px ${themeColor}20`,
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2 text-amber-300 text-xs font-mono tracking-wider">
                                    <SunMedium className="w-4 h-4 text-amber-400 animate-spin-slow" />
                                    <span>HEART SUN ATMOSPHERIC REALM</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                                    <Compass className="w-3.5 h-3.5" /> 360° Ground Explorer
                                </div>
                            </div>

                            <p className="text-sm text-white/80 leading-relaxed font-sans">{planet.description}</p>

                            {!unlocked ? (
                                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono space-y-2">
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
                                        <Clock className="w-4 h-4" /> Vault Sealed Until Day {planet.dayNumber}
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold tracking-widest text-amber-200">
                                        {countdownStr}
                                    </div>
                                    <p className="text-[11px] text-amber-300/70 font-sans leading-normal">
                                        The planetary landscape is accessible, and the Heart Sun shines overhead. Memory archives unlock automatically on schedule.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {!isSolved ? (
                                        <button
                                            onClick={() => openPlanetPuzzle(planet.id)}
                                            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 hover:from-amber-300 hover:to-purple-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Sparkles className="w-4 h-4 text-black animate-spin-slow" />
                                            <span>SOLVE VAULT PUZZLE TO UNLOCK HEART SUN</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openPlanetPuzzle(planet.id)}
                                            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Sparkles className="w-4 h-4 text-black" />
                                            <span>RE-OPEN HEART SUN VAULT GIFT</span>
                                        </button>
                                    )}

                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Atmosphere Synchronized
                                        </span>
                                        <span className="text-emerald-400 font-semibold">Active Surface View</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatePresence>
    );
}
