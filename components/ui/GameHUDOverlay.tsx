'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { SceneId } from '@/types/scene';
import TypewriterText from '@/components/ui/TypewriterText';

export default function GameHUDOverlay() {
    const currentScene = useExperienceStore((state) => state.currentScene);
    const setPasswordModalOpen = useExperienceStore((state) => state.setPasswordModalOpen);
    const isWarping = useExperienceStore((state) => state.isWarping);
    const isStarted = useExperienceStore((state) => state.isStarted);
    const isAuthenticated = useExperienceStore((state) => state.isAuthenticated);
    const triggerWarp = useExperienceStore((state) => state.triggerWarp);

    const { playCommunicatorChime, playHover } = useAudioStore();

    // Game dialogue sequence state
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueStep, setDialogueStep] = useState(0);

    useEffect(() => {
        // Only trigger dialogue countdown AFTER user enters the black hole scene (isStarted === true)
        if (!isStarted) return;

        const timer = setTimeout(() => {
            setShowDialogue(true);
            playCommunicatorChime();
        }, 2500);

        return () => clearTimeout(timer);
    }, [isStarted, playCommunicatorChime]);

    // Only render during Intro / Space Scene
    if (currentScene !== SceneId.INTRO && currentScene !== SceneId.SPACE) {
        return null;
    }

    if (isWarping) return null;

    const dialogueMessages = [
        {
            title: 'WELCOME EXPLORER',
            text: 'Welcome Miss Sirivalli.',
        },
        {
            title: 'SINGULARITY OF ETERNAL LOVE',
            text: 'We are near the Heart Black Hole — the Singularity of Eternal Love. Here, extreme gravitational force bends pure love into a heart shape, holding the secrets of the universe.',
        },
        {
            title: 'GATEWAY PROTOCOL',
            text: 'If you want to enter into it, click the button below and enter the password to unlock.',
        },
    ];

    const handleNextStep = () => {
        playHover();
        setDialogueStep((prev) => prev + 1);
    };

    const handleOpenPasswordModal = () => {
        playCommunicatorChime();
        if (isAuthenticated) {
            triggerWarp();
        } else {
            setPasswordModalOpen(true);
        }
    };

    return (
        <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-end p-4 md:p-8 font-mono select-none overflow-hidden text-white">
            <AnimatePresence>
                {showDialogue && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full max-w-2xl mx-auto pointer-events-auto bg-zinc-950/90 border border-amber-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col gap-5"
                    >
                        {/* Glowing Decorative Scanning Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>

                        {/* Dialogue Header Badge */}
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                                <span>[ SYSTEM COMMUNICATOR ]</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                STEP {dialogueStep + 1} OF {dialogueMessages.length}
                            </span>
                        </div>

                        {/* Dialogue Content with Deliberate RPG Typewriter Text */}
                        <div className="flex flex-col gap-2 min-h-[90px] justify-center">
                            <h3 className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                                {dialogueMessages[dialogueStep].title}
                            </h3>
                            <div className="text-sm md:text-base text-zinc-100 font-serif leading-relaxed">
                                <TypewriterText
                                    key={dialogueStep}
                                    text={dialogueMessages[dialogueStep].text}
                                    speed={48}
                                />
                            </div>
                        </div>

                        {/* Dialogue Action Footer */}
                        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-1">
                            {/* Step Indicators */}
                            <div className="flex gap-1.5">
                                {dialogueMessages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === dialogueStep ? 'w-6 bg-amber-400' : 'w-2 bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3">
                                {dialogueStep < dialogueMessages.length - 1 ? (
                                    <button
                                        onClick={handleNextStep}
                                        className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                    >
                                        <span>CONTINUE</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleOpenPasswordModal}
                                        className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.9)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3 border border-amber-300"
                                    >
                                        <span>ENTER SINGULARITY</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
