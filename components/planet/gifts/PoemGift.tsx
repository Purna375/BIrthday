'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Sparkles } from 'lucide-react';

interface Props {
    title?: string;
    body?: string;
    onClose?: () => void;
}

const DEFAULT_POEM = `Nuvvu naa life loki vachina roju
naa life maaraledu...
**naa life ki oka artham vachindhi.** ❤️

Ninnu chusina prathi sari
naa manasuki oka chinna prashna...
*"Ilaanti ammayini intha rojulu ela miss ayyanu?"* 🥺

Nuvvu naa pakkana unte
samayam aagipovali anipisthundi...
nuvvu dooramaithe
oka nimisham kuda yugam la anipisthundi. 🫂

Naa prema ante pedda pedda maatlu kaadhu...
**nuvvu navvithe naa manasu navvadam,
nuvvu edisthe naa kallallo neellu raavadam.**

Ee janma lo nenu em korukunnano
naaku teliyakapovachu...

Kaani ippudu okati matram telusu...

**Naa repu ela untundo teliyadhu,
kaani aa repulo nuvvu undali.** ❤️♾️

Nuvvu naa love story lo oka chapter kaadhu...

**Nuvve naa motham story.** 🫀`;

function renderFormattedPoem(text: string) {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
            <div key={pIdx} className="mb-4">
                {lines.map((line, lIdx) => {
                    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                    return (
                        <p key={lIdx} className="my-1 text-sm md:text-base leading-relaxed">
                            {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                        <strong key={partIdx} className="font-bold text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]">
                                            {part.slice(2, -2)}
                                        </strong>
                                    );
                                }
                                if (part.startsWith('*') && part.endsWith('*')) {
                                    return (
                                        <em key={partIdx} className="italic text-rose-300 font-serif">
                                            {part.slice(1, -1)}
                                        </em>
                                    );
                                }
                                return <span key={partIdx}>{part}</span>;
                            })}
                        </p>
                    );
                })}
            </div>
        );
    });
}

export default function PoemGift({ title = 'Nuvve Naa Motham Story... ❤️♾️', body, onClose }: Props) {
    const poemContent = body || DEFAULT_POEM;
    const [isUnfolded, setIsUnfolded] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto pointer-events-auto">
            {/* Ambient Silver Stardust Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-zinc-950 to-black pointer-events-none" />

            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {isUnfolded && (
                    <button
                        onClick={() => setIsUnfolded(false)}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-slate-500/20 text-slate-200 border border-slate-500/40 hover:bg-slate-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Reset Hourglass ⏳</span>
                    </button>
                )}

                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
            </div>

            <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-6">
                {!isUnfolded ? (
                    /* STAGE 1: CHRONOS HOURGLASS REVEAL */
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        onClick={() => setIsUnfolded(true)}
                        className="group relative cursor-pointer flex flex-col items-center gap-6 w-full max-w-md text-center"
                    >
                        {/* Metallic Hourglass Emblem */}
                        <div className="relative w-48 h-48 rounded-full border-4 border-slate-400/80 bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-950 flex items-center justify-center shadow-[0_0_80px_rgba(148,163,184,0.6)] group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-2 rounded-full border-2 border-dashed border-slate-300/50 animate-spin-slow" />
                            <div className="p-5 rounded-full bg-slate-800/60 border-2 border-slate-300 text-slate-100 shadow-[0_0_30px_rgba(148,163,184,0.8)] group-hover:rotate-180 transition-transform duration-700">
                                <Feather className="w-12 h-12 text-amber-300 animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-slate-500/20 text-slate-300 border border-slate-500/40 shadow-sm flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Day 8 Stardust Vault
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-white tracking-wide">
                                Timeless Birthday Love Poem
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-slate-300 bg-slate-900/60 px-5 py-2.5 rounded-full border border-slate-500/40 mt-2 group-hover:bg-slate-800/80 transition-colors">
                                ⏳ Reverse Time & Unfold Silver Poem
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* STAGE 2: UNFOLDED SILVER STARDUST TABLET */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-gradient-to-b from-zinc-950 via-slate-900 to-zinc-950 border-2 border-slate-400/60 shadow-[0_0_80px_rgba(148,163,184,0.4)] text-slate-100 font-serif leading-relaxed text-center overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-800/20 to-transparent pointer-events-none rounded-3xl" />

                        {/* Header Badge */}
                        <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5 relative z-10">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2.5 rounded-full bg-slate-800 border border-amber-400/50 shadow-md text-amber-300">
                                    <Feather className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                                        Day 8 Stardust Love Poem
                                    </span>
                                    <h3 className="text-base md:text-lg font-bold font-serif text-slate-100 tracking-wide">
                                        {title}
                                    </h3>
                                </div>
                            </div>
                            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow shrink-0" />
                        </div>

                        {/* Formatted Poem Body */}
                        <div className="relative z-10 py-2 font-serif text-slate-200 tracking-wide text-center">
                            {renderFormattedPoem(poemContent)}
                        </div>

                        {/* Signature Footer */}
                        <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-center gap-2 text-xs font-mono text-amber-300/90 relative z-10 tracking-widest uppercase font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>WRITTEN ACROSS TIME & STARS • NEE PICHODU ❤️♾️</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
