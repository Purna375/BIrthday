'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useRevealStore } from '@/store/useRevealStore';
import { SceneId } from '@/types/scene';
import { PLANETS_DATA } from '@/constants/planets';
import { Sparkles, Heart, Lock, Key, ShieldCheck } from 'lucide-react';

export default function SolarSystemTimerHUD() {
    const currentScene = useExperienceStore((state) => state.currentScene);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const solvedPlanetIds = useExperienceStore((state) => state.solvedPlanetIds);
    const { heartOpenAmount, setHeartOpenAmount, triggerDay10Reveal, heartWarningToast, showHeartWarningToast } = useRevealStore();

    const [countdownStr, setCountdownStr] = useState<string>('');
    const [daysLeft, setDaysLeft] = useState<number>(9);

    // Calculate real live countdown to August 21, 2026 (12:00 AM IST Birthday Finale)
    useEffect(() => {
        const birthdayDate = new Date('2026-08-21T00:00:00+05:30');

        const updateTimer = () => {
            const now = new Date();
            const diffMs = birthdayDate.getTime() - now.getTime();

            if (diffMs <= 0) {
                setCountdownStr('✨ HAPPY BIRTHDAY! DAY 10 UNLOCKED ✨');
                setDaysLeft(0);
                return;
            }

            const totalSec = Math.floor(diffMs / 1000);
            const d = Math.floor(totalSec / (3600 * 24));
            const h = Math.floor((totalSec % (3600 * 24)) / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;

            const pad = (n: number) => String(n).padStart(2, '0');
            setDaysLeft(d);
            setCountdownStr(`${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s TO BIRTHDAY FINALE`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Only render when in Solar System orbit mode
    if (currentScene !== SceneId.SOLAR_SYSTEM || planetViewMode === 'surface') {
        return null;
    }

    const solvedCount = solvedPlanetIds.length;
    const isAllKeysCollected = solvedCount === 9;

    const handleToggleHeartOpen = () => {
        if (!isAllKeysCollected) {
            showHeartWarningToast('You need to collect all 9 vault keys before opening the Heart Sun.');
            return;
        }
        const nextState = heartOpenAmount > 0 ? 0.0 : 1.0;
        setHeartOpenAmount(nextState);
        if (nextState > 0) {
            triggerDay10Reveal();
        }
    };

    // Secret developer unlock method (Double-click badge to test)
    const handleDevUnlock = () => {
        const ALL_IDS = PLANETS_DATA.map((p) => p.id);
        useExperienceStore.setState({ solvedPlanetIds: ALL_IDS });
    };

    return (
        <>
            {/* Warning Toast Banner when user clicks heart before collecting all 9 keys */}
            <AnimatePresence>
                {heartWarningToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 text-rose-200 font-mono text-xs md:text-sm font-bold shadow-[0_0_50px_rgba(225,29,72,0.7)] backdrop-blur-xl flex items-center gap-3 text-center pointer-events-auto"
                    >
                        <Lock className="w-5 h-5 text-rose-400 animate-bounce shrink-0" />
                        <span>{heartWarningToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Center Redesigned Glassmorphic Header HUD */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none font-mono w-11/12 max-w-md"
            >
                <div className="px-6 py-4 rounded-3xl bg-zinc-950/90 border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl flex flex-col items-center gap-2.5 text-center">
                    
                    {/* Header Protocol Badge (Double-click for Dev Unlock) */}
                    <div 
                        onDoubleClick={handleDevUnlock}
                        className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest text-amber-400 uppercase cursor-default"
                        title="Sirivalli Birthday Vault Protocol"
                    >
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Heart Sun Vault Protocol</span>
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    </div>

                    {/* Countdown / Unlock Status Banner */}
                    <div className="text-xs md:text-sm font-extrabold tracking-wider text-amber-200 font-mono">
                        {isAllKeysCollected ? (
                            <span className="text-emerald-400 animate-pulse flex items-center gap-1.5 justify-center">
                                ✨ DAY 10 SINGULARITY FINALE UNLOCKED ✨
                            </span>
                        ) : (
                            <span className="text-amber-300">
                                {countdownStr || `${daysLeft} DAYS TO BIRTHDAY REVEAL`}
                            </span>
                        )}
                    </div>

                    {/* Glowing Progress Bar */}
                    <div className="w-full bg-zinc-900/90 h-2 rounded-full overflow-hidden border border-amber-500/30 p-0.5 shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(solvedCount / 9) * 100}%` }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>

                    {/* Footer Row: Keys Count & Open Heart Trigger */}
                    <div className="flex items-center justify-between w-full pt-1 gap-2">
                        <div className="flex items-center gap-1.5 text-amber-300/90 text-xs font-bold">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span>{solvedCount} / 9 Keys Collected</span>
                        </div>

                        <button
                            onClick={handleToggleHeartOpen}
                            className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                                isAllKeysCollected
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white border border-rose-300 shadow-[0_0_20px_rgba(244,114,182,0.6)] animate-bounce'
                                    : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40'
                            }`}
                        >
                            <Heart className={`w-3.5 h-3.5 ${isAllKeysCollected ? 'fill-white text-white' : 'text-rose-400'}`} />
                            <span>{isAllKeysCollected ? 'Open Heart Sun 💖' : 'Open Heart'}</span>
                        </button>
                    </div>

                </div>
            </motion.div>
        </>
    );
}
