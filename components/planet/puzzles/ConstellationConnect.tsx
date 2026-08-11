'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Heart constellation: star positions and connection order
const STARS = [
    { id: 0, x: 200, y: 60 },   // top center dip
    { id: 1, x: 140, y: 40 },   // left upper lobe
    { id: 2, x: 90, y: 55 },    // left peak
    { id: 3, x: 60, y: 90 },    // left shoulder
    { id: 4, x: 55, y: 140 },   // left mid
    { id: 5, x: 80, y: 190 },   // left lower
    { id: 6, x: 120, y: 230 },  // left bottom curve
    { id: 7, x: 200, y: 270 },  // bottom point
    { id: 8, x: 280, y: 230 },  // right bottom curve
    { id: 9, x: 320, y: 190 },  // right lower
    { id: 10, x: 345, y: 140 }, // right mid
    { id: 11, x: 340, y: 90 },  // right shoulder
    { id: 12, x: 310, y: 55 },  // right peak
    { id: 13, x: 260, y: 40 },  // right upper lobe
];

// Correct order to trace the heart shape
const CORRECT_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0];

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function ConstellationConnect({ onSolve, planetColor }: Props) {
    const [connectedPath, setConnectedPath] = useState<number[]>([]);
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const sparkleIdRef = useRef(0);

    const currentStep = connectedPath.length;
    const progress = Math.min(100, (currentStep / (CORRECT_ORDER.length - 1)) * 100);

    const addSparkle = useCallback((x: number, y: number) => {
        const id = sparkleIdRef.current++;
        setSparkles((prev) => [...prev, { id, x, y }]);
        setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 800);
    }, []);

    const handleStarClick = (starId: number) => {
        if (isComplete) return;

        const expectedStarId = CORRECT_ORDER[currentStep];

        if (starId === expectedStarId) {
            const newPath = [...connectedPath, starId];
            setConnectedPath(newPath);

            // Sparkle burst at star
            const star = STARS[starId];
            for (let i = 0; i < 6; i++) {
                addSparkle(
                    star.x + (Math.random() - 0.5) * 40,
                    star.y + (Math.random() - 0.5) * 40
                );
            }

            // Check if heart is complete
            if (newPath.length >= CORRECT_ORDER.length) {
                setIsComplete(true);
                // Massive sparkle burst
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => {
                        addSparkle(
                            200 + (Math.random() - 0.5) * 300,
                            150 + (Math.random() - 0.5) * 250
                        );
                    }, i * 30);
                }
                setTimeout(onSolve, 1500);
            }
        } else {
            // Wrong star — flash red
            setWrongFlash(starId);
            setTimeout(() => setWrongFlash(null), 500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Connect the stars to reveal the shape that started it all...&quot;
            </p>

            {/* Deep Space Canvas */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800"
                style={{
                    height: '320px',
                    background: 'radial-gradient(ellipse at center, #0a0e27 0%, #020408 70%)',
                }}
            >
                {/* Nebula clouds */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(ellipse at 30% 40%, ${planetColor}22 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, #a855f722 0%, transparent 50%)`,
                    }}
                />

                {/* SVG for connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 310">
                    {/* Completed connection beams */}
                    {connectedPath.length > 1 && connectedPath.map((starId, idx) => {
                        if (idx === 0) return null;
                        const prev = STARS[connectedPath[idx - 1]];
                        const curr = STARS[starId];
                        return (
                            <g key={`line-${idx}`}>
                                {/* Glow beam */}
                                <line
                                    x1={prev.x} y1={prev.y}
                                    x2={curr.x} y2={curr.y}
                                    stroke="#fbbf24"
                                    strokeWidth="4"
                                    opacity="0.3"
                                    filter="url(#glow)"
                                />
                                {/* Solid beam */}
                                <line
                                    x1={prev.x} y1={prev.y}
                                    x2={curr.x} y2={curr.y}
                                    stroke="#fbbf24"
                                    strokeWidth="1.5"
                                    opacity="0.9"
                                />
                            </g>
                        );
                    })}
                    {/* SVG filter for glow */}
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                {/* Stars */}
                {STARS.map((star) => {
                    const isConnected = connectedPath.includes(star.id);
                    const isNext = CORRECT_ORDER[currentStep] === star.id;
                    const isWrong = wrongFlash === star.id;

                    return (
                        <motion.button
                            key={star.id}
                            onClick={() => handleStarClick(star.id)}
                            className="absolute rounded-full flex items-center justify-center cursor-pointer"
                            style={{
                                left: `${(star.x / 400) * 100}%`,
                                top: `${(star.y / 310) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                            animate={{
                                scale: isConnected ? [1, 1.3, 1] : isNext ? [1, 1.15, 1] : 1,
                                boxShadow: isWrong
                                    ? '0 0 25px rgba(239,68,68,0.9)'
                                    : isConnected
                                        ? '0 0 20px rgba(251,191,36,0.8)'
                                        : isNext
                                            ? '0 0 15px rgba(255,255,255,0.5)'
                                            : '0 0 8px rgba(255,255,255,0.2)',
                            }}
                            transition={{
                                scale: { duration: isNext ? 1.5 : 0.3, repeat: isNext ? Infinity : 0 },
                            }}
                            whileHover={{ scale: 1.5 }}
                        >
                            <div
                                className={`rounded-full transition-all duration-300 ${isWrong
                                        ? 'w-5 h-5 bg-red-500'
                                        : isConnected
                                            ? 'w-4 h-4 bg-amber-300'
                                            : 'w-3 h-3 bg-white/80'
                                    }`}
                            />
                            {/* Outer ring for next star */}
                            {isNext && !isComplete && (
                                <div className="absolute w-8 h-8 rounded-full border border-white/30 animate-ping" />
                            )}
                        </motion.button>
                    );
                })}

                {/* Sparkle particles */}
                {sparkles.map((s) => (
                    <motion.div
                        key={s.id}
                        className="absolute w-2 h-2 rounded-full bg-amber-300"
                        style={{
                            left: `${(s.x / 400) * 100}%`,
                            top: `${(s.y / 310) * 100}%`,
                        }}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                    />
                ))}

                {/* Completion Flash */}
                {isComplete && (
                    <motion.div
                        className="absolute inset-0 bg-amber-400/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0] }}
                        transition={{ duration: 1.5 }}
                    />
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>CONSTELLATION PROGRESS</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {isComplete && (
                <motion.p
                    className="text-sm font-bold text-amber-300 text-center animate-pulse"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ✨ Heart Constellation Complete — Vault Opening... ✨
                </motion.p>
            )}
        </div>
    );
}
