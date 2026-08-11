'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import { useExperienceStore } from '@/store/useExperienceStore';

const REASONS = [
    'The way your smile lights up any dark room.',
    'Your infinite kindness and gentle soul.',
    'How you make every single day feel like a magical adventure.',
    'Your laughter that sounds like my favorite song.',
    'Because being with you feels like home.',
];

interface Props {
    onClose?: () => void;
}

export default function ReasonsGardenGift({ onClose }: Props) {
    const [activeTab, setActiveTab] = useState<'garden' | 'reasons'>('garden');
    const closeVaultGift = useExperienceStore((state) => state.closeVaultGift);
    const closePlanetPuzzle = useExperienceStore((state) => state.closePlanetPuzzle);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            closeVaultGift();
            closePlanetPuzzle();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] w-screen h-screen bg-black/95 text-white flex flex-col p-3 md:p-6 overflow-hidden">
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                        <Flower2 className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Day 3 • Verdantina Surprise Unlocked
                            </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold font-serif text-emerald-200 tracking-wide mt-0.5">
                            An Infinite Garden for Sirivalli Purna🌸
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('garden')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${activeTab === 'garden'
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            Garden
                        </button>
                        <button
                            onClick={() => setActiveTab('reasons')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${activeTab === 'reasons'
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            5 Reasons Why
                        </button>
                    </div>

                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-xs font-mono uppercase rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors cursor-pointer border border-white/20"
                    >
                        Close ✕
                    </button>
                </div>
            </div>

            {/* Main Display Area - Full Viewport iframe */}
            {activeTab === 'garden' ? (
                <div className="relative flex-1 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.3)] bg-black">
                    <iframe
                        src="/garden-day3.html"
                        className="w-full h-full border-0"
                        title="An Infinite Garden for Her"
                        allow="autoplay; fullscreen"
                    />
                </div>
            ) : (
                <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto space-y-4 py-6 pr-2 scrollbar-thin scrollbar-thumb-emerald-500">
                    <h4 className="text-center font-serif text-emerald-300 text-xl mb-4">
                        Reasons Why You Are Loved
                    </h4>
                    {REASONS.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-5 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 shadow-xl flex items-start gap-4"
                        >
                            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-sm font-bold shrink-0">
                                #{idx + 1}
                            </span>
                            <p className="text-sm md:text-base text-zinc-100 font-sans italic leading-relaxed">
                                {reason}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
