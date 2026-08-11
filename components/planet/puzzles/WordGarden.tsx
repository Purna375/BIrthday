'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Leaf, RotateCcw } from 'lucide-react';

const WORDS = [
    { word: 'SIRIVALLI PURNA', hint: 'The name written in the stars' },
    { word: 'SMILE', hint: 'What lights up my entire world' },
    { word: 'FOREVER', hint: 'How long my heart belongs to you' },
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function WordGarden({ onSolve, planetColor }: Props) {
    const [wordIndex, setWordIndex] = useState(0);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [bloomedFlowers, setBloomedFlowers] = useState<number>(0);
    const [isWrong, setIsWrong] = useState(false);

    const currentTarget = WORDS[wordIndex];

    // Clean word without spaces for puzzle logic
    const cleanTargetWord = useMemo(() => {
        return currentTarget.word.replace(/\s+/g, '');
    }, [currentTarget]);

    // Words split by spaces for answer slot grouping
    const wordParts = useMemo(() => {
        return currentTarget.word.split(' ');
    }, [currentTarget]);

    // Scrambled letters (excluding spaces)
    const scrambled = useMemo(() => {
        return cleanTargetWord.split('').sort(() => Math.random() - 0.5);
    }, [cleanTargetWord]);

    const handleSelectIndex = (scrambledIdx: number) => {
        if (selectedIndices.includes(scrambledIdx) || isWrong) return;

        const nextIndices = [...selectedIndices, scrambledIdx];
        setSelectedIndices(nextIndices);

        // Check if all letters selected
        if (nextIndices.length === cleanTargetWord.length) {
            const userAttempt = nextIndices.map((idx) => scrambled[idx]).join('');

            if (userAttempt === cleanTargetWord) {
                // Word solved!
                const nextBloomed = bloomedFlowers + 1;
                setBloomedFlowers(nextBloomed);

                if (wordIndex < WORDS.length - 1) {
                    setTimeout(() => {
                        setWordIndex((prev) => prev + 1);
                        setSelectedIndices([]);
                    }, 800);
                } else {
                    // All words solved!
                    setTimeout(onSolve, 1200);
                }
            } else {
                // Wrong attempt
                setIsWrong(true);
                setTimeout(() => {
                    setSelectedIndices([]);
                    setIsWrong(false);
                }, 700);
            }
        }
    };

    const handleReset = () => {
        setSelectedIndices([]);
        setIsWrong(false);
    };

    // Helper to get currently typed user letters
    const currentTypedLetters = selectedIndices.map((idx) => scrambled[idx]);

    // Map typed letters into word part slots
    let letterPointer = 0;

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Gather firefly letters to bloom the tree of eternal love...&quot;
            </p>

            {/* Tree Garden Scene */}
            <div className="relative w-full h-44 rounded-2xl bg-zinc-950/80 border border-emerald-500/40 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
                <div className="relative flex flex-col items-center">
                    <motion.div
                        animate={{
                            scale: 1 + bloomedFlowers * 0.15,
                            filter: `drop-shadow(0 0 ${10 + bloomedFlowers * 15}px #10b981)`,
                        }}
                        className="text-emerald-400"
                    >
                        <Leaf className="w-14 h-14 stroke-[1.5]" />
                    </motion.div>

                    {/* Bloomed Flowers */}
                    <div className="flex gap-4 mt-2">
                        {[0, 1, 2].map((idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: idx < bloomedFlowers ? 1.2 : 0.4,
                                    opacity: idx < bloomedFlowers ? 1 : 0.2,
                                }}
                                transition={{ type: 'spring' }}
                                className="p-2 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                            >
                                <Flower2 className="w-5 h-5 animate-pulse" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <span className="mt-3 text-[11px] font-mono text-emerald-300/90 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    HINT: {currentTarget.hint}
                </span>
            </div>

            {/* Answer Display Slots (Grouped by words) */}
            <motion.div
                animate={isWrong ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-3 min-h-[52px] justify-center items-center py-1"
            >
                {wordParts.map((part, partIdx) => {
                    const partStartIndex = letterPointer;
                    letterPointer += part.length;

                    return (
                        <div key={partIdx} className="flex gap-1.5 items-center">
                            {part.split('').map((_, charIdx) => {
                                const globalIndex = partStartIndex + charIdx;
                                const filledLetter = currentTypedLetters[globalIndex] || '';

                                return (
                                    <div
                                        key={charIdx}
                                        className={`w-9 h-11 md:w-10 md:h-12 rounded-xl border flex items-center justify-center text-lg font-mono font-bold transition-all shadow-inner ${
                                            isWrong
                                                ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                                                : filledLetter
                                                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                                : 'bg-zinc-900/90 border-emerald-500/30 text-emerald-300/40'
                                        }`}
                                    >
                                        {filledLetter}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </motion.div>

            {/* Scrambled Firefly Letter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center max-w-sm px-2">
                {scrambled.map((letter, idx) => {
                    const isUsed = selectedIndices.includes(idx);
                    return (
                        <motion.button
                            key={idx}
                            whileHover={!isUsed ? { scale: 1.15 } : {}}
                            whileTap={!isUsed ? { scale: 0.9 } : {}}
                            disabled={isUsed}
                            onClick={() => handleSelectIndex(idx)}
                            className={`w-10 h-10 md:w-11 md:h-11 rounded-full font-mono font-bold text-sm md:text-base flex items-center justify-center transition-all cursor-pointer ${
                                isUsed
                                    ? 'bg-zinc-900/40 border border-zinc-800 text-zinc-600 scale-90 opacity-40 cursor-not-allowed'
                                    : 'bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/80 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                            }`}
                        >
                            {letter}
                        </motion.button>
                    );
                })}
            </div>

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="mt-1 text-xs font-mono text-zinc-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Letters</span>
            </button>
        </div>
    );
}
