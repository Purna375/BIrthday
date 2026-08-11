'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, CheckCircle } from 'lucide-react';

const EMOJI_PUZZLES = [
    { emojis: '💖 🔒 ♾️', answer: 'LOVE LOCKED FOREVER', hint: '3 words describing our bond' },
    { emojis: '🎂 🎁 🥳', answer: 'HAPPY BIRTHDAY', hint: 'The special day we are celebrating' },
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function EmojiCipher({ onSolve, planetColor }: Props) {
    const [pIndex, setPIndex] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);

    const currentPuzzle = EMOJI_PUZZLES[pIndex];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formatted = inputVal.trim().toUpperCase();

        if (formatted === currentPuzzle.answer) {
            setErrorMsg(false);
            if (pIndex < EMOJI_PUZZLES.length - 1) {
                setPIndex(pIndex + 1);
                setInputVal('');
            } else {
                onSolve();
            }
        } else {
            setErrorMsg(true);
            setTimeout(() => setErrorMsg(false), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Decode the rose cipher message hidden inside the emojis...&quot;
            </p>

            {/* Rose Cipher Slab */}
            <div className="relative w-full p-6 rounded-2xl bg-zinc-950 border border-rose-500/40 overflow-hidden flex flex-col items-center justify-center gap-3">
                <div className="text-4xl animate-bounce tracking-widest">{currentPuzzle.emojis}</div>
                <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest">
                    HINT: {currentPuzzle.hint}
                </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="TYPE DECODED PHRASE IN ALL CAPS..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-rose-500/30 text-rose-200 font-mono text-xs text-center uppercase tracking-wider focus:outline-none focus:border-rose-400 placeholder:text-zinc-600"
                />

                {errorMsg && (
                    <span className="text-[10px] font-mono text-red-400 text-center animate-shake">
                        ❌ Incorrect decode phrase! Try again.
                    </span>
                )}

                <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                    🌹 Submit Cipher Decode
                </button>
            </form>
        </div>
    );
}
