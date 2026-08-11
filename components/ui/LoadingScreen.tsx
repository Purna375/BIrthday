'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function LoadingScreen() {
    const loading = useExperienceStore((state) => state.loading);
    const isStarted = useExperienceStore((state) => state.isStarted);
    const startExperience = useExperienceStore((state) => state.startExperience);

    return (
        <AnimatePresence>
            {!isStarted && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white px-4"
                >
                    <div className="flex flex-col items-center max-w-md w-full gap-6 text-center">
                        <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-amber-200 uppercase">
                            A Cosmic Love & Birthday Journey
                        </h1>

                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="bg-amber-400 h-full rounded-full"
                                style={{ width: `${loading.progress}%` }}
                                transition={{ ease: 'easeOut', duration: 0.3 }}
                            />
                        </div>

                        <p className="text-xs text-zinc-400 font-mono tracking-wider">
                            {loading.progress < 100 ? (loading.currentTask || 'Loading assets...') : 'Ready to begin'}
                        </p>

                        {loading.progress >= 100 && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startExperience}
                                className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-black font-semibold uppercase tracking-wider rounded-full shadow-lg transition-colors cursor-pointer"
                            >
                                Enter Experience
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
