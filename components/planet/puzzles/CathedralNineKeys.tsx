'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Sparkles, Star } from 'lucide-react';

const PLANET_KEYS = [
    'Aetheria', 'Celestia', 'Verdantina', 'Solaria', 'Aura Nova', 'Zephyria', 'Astralia', 'Chronos Prime', 'Eternia'
];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function CathedralNineKeys({ onSolve, planetColor }: Props) {
    const [insertedKeys, setInsertedKeys] = useState<string[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);

    const handleKeyClick = (keyName: string) => {
        if (insertedKeys.includes(keyName)) return;
        const next = [...insertedKeys, keyName];
        setInsertedKeys(next);

        if (next.length === PLANET_KEYS.length) {
            // Start 5 second final countdown
            setCountdown(5);
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        setTimeout(onSolve, 500);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Insert all 9 cosmic keys to complete the Day 9 Eternia Vault Seal...&quot;
            </p>

            {/* Countdown Overlay or Key Slots */}
            {countdown !== null ? (
                <div className="p-6 rounded-3xl bg-amber-950/80 border border-amber-400 text-center space-y-3 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                    <div className="text-xs font-mono text-amber-300 uppercase tracking-widest animate-pulse">
                        ✨ ALL 9 VAULT KEYS INSERTED ✨
                    </div>
                    <div className="text-5xl font-extrabold font-mono text-amber-400">
                        00:00:0{countdown}
                    </div>
                    <p className="text-[11px] text-zinc-300 font-sans">
                        Unlocking Day 9 Eternia Vault Surprise...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2.5 w-full">
                    {PLANET_KEYS.map((keyName, idx) => {
                        const isInserted = insertedKeys.includes(keyName);
                        return (
                            <motion.button
                                key={keyName}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleKeyClick(keyName)}
                                disabled={isInserted}
                                className={`p-3 rounded-xl border font-mono text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${isInserted
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] opacity-80'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-amber-400 cursor-pointer'
                                    }`}
                            >
                                <Key className={`w-4 h-4 ${isInserted ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'}`} />
                                <span>{keyName}</span>
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {countdown === null && (
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                    KEYS INSERTED: {insertedKeys.length} / 9
                </span>
            )}
        </div>
    );
}
