'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { SceneId } from '@/types/scene';
import { Heart, Lock, Sparkles, Compass, X, ChevronRight } from 'lucide-react';
import TypewriterText from '@/components/ui/TypewriterText';

export default function SolarSystemIntroModal() {
    const currentScene = useExperienceStore((state) => state.currentScene);
    const hasEnteredFromBlackHole = useExperienceStore((state) => state.hasEnteredFromBlackHole);
    const setHasEnteredFromBlackHole = useExperienceStore((state) => state.setHasEnteredFromBlackHole);
    const [isOpen, setIsOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const { playHover, playTransition, playCommunicatorChime } = useAudioStore();

    const handleCloseModal = () => {
        setHasEnteredFromBlackHole(false);
        setIsOpen(false);
    };

    // Only render when inside the Solar System scene AND when entered from Black Hole
    if (currentScene !== SceneId.SOLAR_SYSTEM || !hasEnteredFromBlackHole || !isOpen) {
        return null;
    }

    const steps = [
        {
            badge: '[ TRANSMISSION RECEIVED ]',
            title: 'Welcome to the Eternal Love Solar System',
            icon: <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />,
            accentColor: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
            text: 'Welcome Miss Sirivalli! You have successfully passed through the Heart Black Hole Singularity into the Eternal Love Solar System — a custom-crafted cosmic realm created to celebrate your birthday.',
            nextLabel: 'NEXT: THE HEART SUN',
        },
        {
            badge: '[ STELLAR ENGINE LORE ]',
            title: 'The Incandescent Heart Sun',
            icon: <Heart className="w-8 h-8 text-rose-400 fill-rose-500/30" />,
            accentColor: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
            text: 'At the absolute center of this system rests the Living Heart Sun. It glows with an incandescent solar flare, radiating warmth, light, and an eternal heartbeat rhythm across all 9 orbiting worlds.',
            nextLabel: 'NEXT: MEMORY PLANETS',
        },
        {
            badge: '[ ARCHIVE DIRECTORY ]',
            title: '9 Cosmic Memory Planets',
            icon: <Compass className="w-8 h-8 text-cyan-400" />,
            accentColor: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
            text: 'Orbiting around the Heart Sun are 9 unique memory planets — each holding secret birthday letters, cherished photo galleries, voice notes, and constellation mini-games created especially for you.',
            nextLabel: 'NEXT: UNLOCKING RULES',
        },
        {
            badge: '[ SYSTEM PROTOCOL & RULES ]',
            title: 'Unlocking Rules & 3D Navigation',
            icon: <Lock className="w-8 h-8 text-emerald-400" />,
            accentColor: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
            text: '• Daily Unlock: Planets unlock sequentially day-by-day to open their memory vaults. • Locked Vaults: Locked planets display a live countdown timer. • 3D Controls: Drag anywhere to orbit space, scroll to zoom, and click any planet to zoom in & explore.',
            nextLabel: 'START EXPLORING SOLAR SYSTEM',
        },
    ];

    const handleNextStep = () => {
        playHover();
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            playTransition();
            handleCloseModal();
        }
    };

    const handleSkip = () => {
        playTransition();
        handleCloseModal();
    };

    const activeStep = steps[currentStep];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl select-none font-mono pointer-events-auto">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.92, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="relative w-full max-w-2xl bg-zinc-950/95 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] text-white backdrop-blur-2xl flex flex-col gap-6"
                >
                    {/* Top Scanning Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

                    {/* Close / Skip Button */}
                    <button
                        onClick={handleSkip}
                        onMouseEnter={playHover}
                        className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/80 hover:bg-amber-500/20 border border-zinc-800 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                        title="Skip Intro"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header Badge */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                            <span>{activeStep.badge}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            STEP {currentStep + 1} OF {steps.length}
                        </span>
                    </div>

                    {/* Content Section with Icon, Title & Slow RPG Typewriter Text */}
                    <div className="flex flex-col gap-4 min-h-[160px]">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl border ${activeStep.accentColor}`}>
                                {activeStep.icon}
                            </div>
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-200">
                                {activeStep.title}
                            </h2>
                        </div>

                        <div className="text-sm md:text-base text-zinc-200 font-sans leading-relaxed pt-2">
                            <TypewriterText
                                key={currentStep}
                                text={activeStep.text}
                                speed={48}
                            />
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-2">
                        {/* Step Indicators */}
                        <div className="flex gap-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-700'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Next / Start Button */}
                        <button
                            onClick={handleNextStep}
                            onMouseEnter={playHover}
                            className="px-7 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300"
                        >
                            <span>{activeStep.nextLabel}</span>
                            <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
