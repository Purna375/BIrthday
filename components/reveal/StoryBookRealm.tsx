'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, X, ExternalLink, Maximize2, Heart } from 'lucide-react';
import { useRevealStore } from '@/store/useRevealStore';
import { useAudioStore } from '@/store/useAudioStore';

interface Props {
    onClose?: () => void;
}

export default function StoryBookRealm({ onClose }: Props) {
    const resetReveal = useRevealStore((state) => state.resetReveal);
    const { playClick } = useAudioStore();

    const handleClose = () => {
        playClick();
        if (onClose) {
            onClose();
        } else {
            resetReveal();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 md:p-6 bg-zinc-950/98 backdrop-blur-2xl text-white select-none pointer-events-auto overflow-hidden font-mono"
        >
            {/* Ambient Gold & Pink Nebula Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/30 via-amber-950/20 to-zinc-950 pointer-events-none" />

            {/* TOP PRESENTER TOOLBAR */}
            <div className="relative z-10 w-full max-w-7xl flex items-center justify-between p-3.5 md:p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.2)] backdrop-blur-xl shrink-0">
                {/* Left Side Title & Badge */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                            <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                            <span>[ PRESENTER VIEW ]</span>
                        </div>
                        <h2 className="text-sm md:text-lg font-serif font-bold text-amber-100 tracking-wide flex items-center gap-2">
                            <span>The Celestial Storybook</span>
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
                        </h2>
                    </div>
                </div>

                {/* Right Side Action Buttons */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Open in New Tab Button */}
                    <a
                        href="/ultimate_story.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-amber-500/20 text-amber-300 border border-zinc-700 hover:border-amber-400/50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        title="Open PDF in New Window"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open PDF</span>
                    </a>

                    {/* Prominent Close Button */}
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:shadow-[0_0_40px_rgba(225,29,72,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                        <X className="w-4 h-4 stroke-[3]" />
                        <span>Close Storybook</span>
                    </button>
                </div>
            </div>

            {/* CENTER PRESENTATION PDF EMBED CONTAINER */}
            <div className="relative z-10 w-full max-w-7xl flex-1 my-3 md:my-4 rounded-2xl border-2 border-amber-500/40 bg-zinc-900/90 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                <iframe
                    src="/ultimate_story.pdf#toolbar=1&navpanes=0&view=FitH"
                    className="w-full h-full border-0 bg-zinc-950 rounded-2xl"
                    title="The Celestial Chronicles of Sirivalli PDF Presenter"
                />

                {/* PDF Fallback overlay link if iframe is blocked or slow */}
                <noscript>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950 text-center gap-4">
                        <p className="text-sm text-zinc-300">
                            Your browser does not support inline PDF viewing.
                        </p>
                        <a
                            href="/ultimate_story.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase"
                        >
                            Click to View Presentation PDF
                        </a>
                    </div>
                </noscript>
            </div>

            {/* BOTTOM PRESENTER FOOTER BAR */}
            <div className="relative z-10 w-full max-w-7xl flex items-center justify-between px-4 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-[10px] text-zinc-400 font-mono shrink-0">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Maximize2 className="w-3 h-3 text-amber-400" />
                    <span>Presenter Mode Active — Scroll or use PDF controls to flip slides</span>
                </span>
                <span className="hidden sm:inline text-zinc-500">
                    Created with Love for Sirivalli 💖
                </span>
            </div>
        </motion.div>
    );
}
