'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog, CheckCircle } from 'lucide-react';

const RIDDLES = [
    {
        question: 'I am the exact place where you live in my soul forever. What am I?',
        answer: 'MY HEART',
        hint: 'Two words: MY H...',
    },
    {
        question: 'I am a promise of love that grows stronger with every passing second. What am I?',
        answer: 'FOREVER',
        hint: '7 letter word starting with F',
    },
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function SteampunkRiddles({ onSolve, planetColor }: Props) {
    const [rIndex, setRIndex] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [unlockedGears, setUnlockedGears] = useState(0);
    const [error, setError] = useState(false);

    const currentRiddle = RIDDLES[rIndex];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputVal.trim().toUpperCase() === currentRiddle.answer) {
            setError(false);
            const nextGears = unlockedGears + 1;
            setUnlockedGears(nextGears);

            if (rIndex < RIDDLES.length - 1) {
                setRIndex(rIndex + 1);
                setInputVal('');
            } else {
                onSolve();
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Solve the steampunk riddles to spin the frozen gears of Chronos Prime...&quot;
            </p>

            {/* Gears Illustration */}
            <div className="relative w-full h-36 rounded-2xl bg-zinc-950 border border-slate-500/40 flex items-center justify-center gap-6 overflow-hidden">
                <motion.div
                    animate={{ rotate: unlockedGears * 180 }}
                    transition={{ duration: 1 }}
                    className="text-slate-400"
                >
                    <Cog className="w-16 h-16" />
                </motion.div>

                <motion.div
                    animate={{ rotate: -unlockedGears * 180 }}
                    transition={{ duration: 1 }}
                    className="text-amber-400"
                >
                    <Cog className="w-12 h-12" />
                </motion.div>
            </div>

            {/* Telegraph Screen */}
            <div className="w-full p-4 rounded-xl bg-zinc-900 border border-slate-600/40 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    RIDDLE {rIndex + 1} OF {RIDDLES.length}
                </span>
                <p className="text-xs font-mono text-slate-200">{currentRiddle.question}</p>
                <span className="text-[10px] font-mono text-amber-300">HINT: {currentRiddle.hint}</span>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="TYPE RIDDLE ANSWER..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-slate-500/40 font-mono text-xs text-slate-200 uppercase tracking-wider text-center focus:outline-none focus:border-amber-400"
                />

                {error && (
                    <span className="text-[10px] font-mono text-red-400 text-center animate-shake">
                        ❌ Incorrect riddle answer! Try again.
                    </span>
                )}

                <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-400 via-amber-400 to-slate-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                    ⚙️ Unlock Gear Mechanism
                </button>
            </form>
        </div>
    );
}
