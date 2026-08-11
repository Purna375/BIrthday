'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';

const MILESTONES = [
    { id: 1, title: 'First time we talked', order: 1 },
    { id: 2, title: 'Our first unforgettable date', order: 2 },
    { id: 3, title: 'First trip together under the stars', order: 3 },
    { id: 4, title: 'Celebrating your magical birthday today', order: 4 },
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function OrbitalTimeline({ onSolve, planetColor }: Props) {
    const [items, setItems] = useState<typeof MILESTONES>(() =>
        [...MILESTONES].sort(() => Math.random() - 0.5)
    );

    const isCorrectOrder = items.every((item, idx) => item.order === idx + 1);

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const updated = [...items];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setItems(updated);

        if (updated.every((item, idx) => item.order === idx + 1)) {
            setTimeout(onSolve, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Reorder our relationship timeline into the golden Saturn orbit...&quot;
            </p>

            {/* List of Milestones */}
            <div className="w-full flex flex-col gap-2">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        layout
                        className="p-3.5 rounded-xl bg-zinc-900/90 border border-yellow-500/30 flex items-center justify-between font-mono text-xs text-zinc-200"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                            </span>
                            <span>{item.title}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => moveItem(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-yellow-300"
                            >
                                <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => moveItem(idx, 'down')}
                                disabled={idx === items.length - 1}
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-yellow-300"
                            >
                                <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {isCorrectOrder && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-4 h-4" />
                    <span>TIMELINE PERFECTLY ALIGNED! UNLOCKING VAULT...</span>
                </span>
            )}
        </div>
    );
}
