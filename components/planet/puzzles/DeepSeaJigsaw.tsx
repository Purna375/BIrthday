'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Sparkles, Check } from 'lucide-react';

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function DeepSeaJigsaw({ onSolve, planetColor }: Props) {
    const [tiles, setTiles] = useState<number[]>([4, 1, 7, 0, 5, 2, 8, 3, 6]); // Shuffled 0..8
    const [selectedTile, setSelectedTile] = useState<number | null>(null);

    const isSolved = tiles.every((val, idx) => val === idx);

    const handleTileClick = (index: number) => {
        if (selectedTile === null) {
            setSelectedTile(index);
        } else {
            // Swap tiles
            const nextTiles = [...tiles];
            const temp = nextTiles[selectedTile];
            nextTiles[selectedTile] = nextTiles[index];
            nextTiles[index] = temp;
            setTiles(nextTiles);
            setSelectedTile(null);

            if (nextTiles.every((val, idx) => val === idx)) {
                setTimeout(onSolve, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Rearrange bioluminescent underwater tiles to restore the ocean memory...&quot;
            </p>

            {/* Underwater Canvas Box */}
            <div className="relative w-full p-4 rounded-2xl bg-zinc-950 border border-cyan-500/40 overflow-hidden flex flex-col items-center justify-center">
                {/* Background Water Rays */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 via-blue-900 to-black" />

                {/* 3x3 Grid */}
                <div className="grid grid-cols-3 gap-2 w-64 h-64 relative z-10">
                    {tiles.map((tileVal, idx) => {
                        const isSelected = selectedTile === idx;
                        const isCorrectPos = tileVal === idx;

                        return (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTileClick(idx)}
                                className={`rounded-xl border font-mono font-bold text-lg flex flex-col items-center justify-center transition-all cursor-pointer ${isSelected
                                        ? 'bg-cyan-500/40 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.9)] text-white'
                                        : isCorrectPos
                                            ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                                            : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-cyan-500/40'
                                    }`}
                            >
                                <span>{tileVal + 1}</span>
                                {isCorrectPos && <Check className="w-3.5 h-3.5 text-cyan-400 mt-1" />}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                <span>TAP TWO TILES TO SWAP POSITIONS (ORDER 1 TO 9)</span>
            </span>
        </div>
    );
}
