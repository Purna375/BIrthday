'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '@/store/useAudioStore';
import { Volume2, VolumeX, Volume1, Sparkles } from 'lucide-react';

export default function AudioControlHUD() {
    const { isMuted, volume, toggleMute, setVolume, isAutoplayBlocked, unlockAudio } = useAudioStore();
    const [showSlider, setShowSlider] = useState(false);

    const renderVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5 text-red-400" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5 text-amber-300" />;
        return <Volume2 className="w-5 h-5 text-emerald-400" />;
    };

    return (
        <div className="fixed top-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
            {/* Autoplay Unlock Banner if Browser Blocked Audio */}
            <AnimatePresence>
                {isAutoplayBlocked && (
                    <motion.button
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        onClick={unlockAudio}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-mono backdrop-blur-xl shadow-lg hover:bg-amber-500/30 transition-colors animate-pulse"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" /> Enable Audio
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Glassmorphic Audio Controller Bar */}
            <div
                onMouseEnter={() => setShowSlider(true)}
                onMouseLeave={() => setShowSlider(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-xl text-white shadow-2xl transition-all"
            >
                <button
                    onClick={toggleMute}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    title={isMuted ? 'Unmute Experience' : 'Mute Experience'}
                >
                    {renderVolumeIcon()}
                </button>

                {/* Dynamic Expandable Volume Slider */}
                <AnimatePresence>
                    {showSlider && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 80, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden flex items-center"
                        >
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-20 h-1.5 bg-white/20 accent-amber-400 rounded-lg cursor-pointer"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
