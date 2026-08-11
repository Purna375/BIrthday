'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
    {
        question: 'What is the single most beautiful thing about our relationship?',
        options: ['Our deep emotional connection, trust & endless laughter', 'Checking the weather', 'Silence', 'Nothing special'],
        correct: 0,
    },
    {
        question: 'When I look into your eyes, what do I see?',
        options: ['My entire world, future & happiest home', 'A mirror reflection', 'Cosmic dust', 'Just dark space'],
        correct: 0,
    },
    {
        question: 'What makes your birthday celebration so special to my heart?',
        options: ['Celebrating the day the love of my life was born', 'Just eating cake', 'Watching tv', 'Another ordinary day'],
        correct: 0,
    },
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function LavaQuiz({ onSolve, planetColor }: Props) {
    const [qIndex, setQIndex] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [isErupting, setIsErupting] = useState(false);
    const [score, setScore] = useState(0);

    const currentQ = QUIZ_QUESTIONS[qIndex];

    const handleSelectOption = (idx: number) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);

        if (idx === currentQ.correct) {
            setIsErupting(true);
            const nextScore = score + 1;
            setScore(nextScore);

            setTimeout(() => {
                setIsErupting(false);
                setSelectedOpt(null);
                if (qIndex < QUIZ_QUESTIONS.length - 1) {
                    setQIndex(qIndex + 1);
                } else {
                    onSolve();
                }
            }, 1000);
        } else {
            setTimeout(() => {
                setSelectedOpt(null);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Answer the molten lava quiz to trigger the volcanic vault eruption...&quot;
            </p>

            {/* Living Lava Landscape Container */}
            <div className="relative w-full h-36 rounded-2xl bg-zinc-950 border border-red-500/50 overflow-hidden flex flex-col items-center justify-center p-4">
                {/* Volcano / Eruption VFX */}
                <motion.div
                    animate={{
                        scale: isErupting ? [1, 1.4, 1] : 1,
                        filter: isErupting
                            ? 'drop-shadow(0 0 40px #ef4444)'
                            : 'drop-shadow(0 0 15px #f87171)',
                    }}
                    className="text-red-500 flex flex-col items-center"
                >
                    <Flame className="w-14 h-14 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mt-1">
                        {isErupting ? '🔥 VOLCANIC ERUPTION SUCCESS 🔥' : 'SOLARIA LAVA CORE'}
                    </span>
                </motion.div>

                {/* Lava River Floor Indicator */}
                <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />
            </div>

            {/* Question Card */}
            <div className="w-full bg-zinc-900/90 p-4 rounded-2xl border border-red-500/30 flex flex-col gap-3">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                    QUESTION {qIndex + 1} OF {QUIZ_QUESTIONS.length}
                </span>
                <h4 className="text-sm font-semibold text-zinc-100 font-sans leading-snug">
                    {currentQ.question}
                </h4>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                    {currentQ.options.map((opt, idx) => {
                        const isSelected = selectedOpt === idx;
                        const isCorrect = idx === currentQ.correct;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelectOption(idx)}
                                className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${isSelected
                                    ? isCorrect
                                        ? 'bg-red-500/30 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                                        : 'bg-zinc-800 border-zinc-600 text-zinc-400'
                                    : 'bg-zinc-950/80 hover:bg-zinc-800 border-red-500/20 text-zinc-200 hover:border-red-500/50'
                                    }`}
                            >
                                <span>{opt}</span>
                                {isSelected && (isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
