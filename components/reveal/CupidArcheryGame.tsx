'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

interface Balloon {
    id: number;
    x: number; // percentage from left (e.g. 50% to 90%)
    y: number; // position from bottom in px
    speed: number;
    size: number;
    popped: boolean;
}

interface Arrow {
    id: number;
    x: number; // percentage from left
    y: number; // px from top
    speed: number;
}

interface Props {
    onComplete: () => void;
}

export default function CupidArcheryGame({ onComplete }: Props) {
    const { playSuccessSFX, playClick } = useAudioStore();
    const [gameStarted, setGameStarted] = useState(false);
    const [hits, setHits] = useState(0);
    const [activeHint, setActiveHint] = useState<string | null>(null);

    // Bow position Y (px from top)
    const [bowY, setBowY] = useState(300);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [balloons, setBalloons] = useState<Balloon[]>([]);

    const gameAreaRef = useRef<HTMLDivElement | null>(null);
    const arrowIdCounter = useRef(0);
    const balloonIdCounter = useRef(0);

    // Track mouse Y for bow movement
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        setBowY(Math.max(80, Math.min(rect.height - 80, relativeY)));
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!gameAreaRef.current || e.touches.length === 0) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeY = e.touches[0].clientY - rect.top;
        setBowY(Math.max(80, Math.min(rect.height - 80, relativeY)));
    };

    // Shoot arrow
    const shootArrow = () => {
        if (!gameStarted || hits >= 9) return;
        arrowIdCounter.current += 1;
        const newArrow: Arrow = {
            id: arrowIdCounter.current,
            x: 8, // start at bow X (8%)
            y: bowY,
            speed: 2.2, // speed percentage per frame
        };
        setArrows((prev) => [...prev, newArrow]);
        playClick();
    };

    // Spawn balloons continuously
    useEffect(() => {
        if (!gameStarted || hits >= 9) return;

        const interval = setInterval(() => {
            if (balloons.length < 6) {
                balloonIdCounter.current += 1;
                const newBalloon: Balloon = {
                    id: balloonIdCounter.current,
                    x: 45 + Math.random() * 45, // 45% to 90%
                    y: -60, // start below bottom
                    speed: 1.5 + Math.random() * 1.8,
                    size: 40 + Math.random() * 20,
                    popped: false,
                };
                setBalloons((prev) => [...prev, newBalloon]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStarted, balloons.length, hits]);

    // Game Animation Loop (Move arrows & balloons, check collisions)
    useEffect(() => {
        if (!gameStarted || hits >= 9) return;

        const animationFrame = requestAnimationFrame(() => {
            if (!gameAreaRef.current) return;
            const containerWidth = gameAreaRef.current.clientWidth;
            const containerHeight = gameAreaRef.current.clientHeight;

            // 1. Move Balloons Upward
            setBalloons((prevBalloons) =>
                prevBalloons
                    .map((b) => ({
                        ...b,
                        y: b.y + b.speed,
                    }))
                    .filter((b) => b.y < containerHeight + 80 && !b.popped)
            );

            // 2. Move Arrows Rightward
            setArrows((prevArrows) =>
                prevArrows
                    .map((a) => ({
                        ...a,
                        x: a.x + a.speed,
                    }))
                    .filter((a) => a.x < 100)
            );

            // 3. Collision Detection
            setArrows((currentArrows) => {
                let updatedArrows = [...currentArrows];

                setBalloons((currentBalloons) => {
                    let updatedBalloons = [...currentBalloons];

                    updatedArrows.forEach((arrow) => {
                        const arrowPxX = (arrow.x / 100) * containerWidth;
                        const arrowPxY = arrow.y;

                        updatedBalloons.forEach((balloon) => {
                            if (balloon.popped) return;

                            const balloonPxX = (balloon.x / 100) * containerWidth;
                            const balloonPxY = containerHeight - balloon.y; // convert from bottom Y

                            const distance = Math.hypot(arrowPxX - balloonPxX, arrowPxY - balloonPxY);

                            // Hit radius check
                            if (distance < balloon.size + 15) {
                                balloon.popped = true;
                                updatedArrows = updatedArrows.filter((a) => a.id !== arrow.id);
                                playSuccessSFX();

                                setHits((prevHits) => {
                                    const nextHits = prevHits + 1;

                                    // Trigger hints at 3, 6, 9
                                    if (nextHits === 3) {
                                        setActiveHint('🗝️ HINT 1 UNLOCKED: Anniversary date');
                                    } else if (nextHits === 6) {
                                        setActiveHint('🗝️ HINT 2 UNLOCKED: First meet date in private space');
                                    } else if (nextHits === 9) {
                                        setActiveHint('🗝️ HINT 3 UNLOCKED: Calculate sum (Hint 1 + Hint 2)!');
                                        setTimeout(() => {
                                            onComplete();
                                        }, 1800);
                                    }

                                    return nextHits;
                                });
                            }
                        });
                    });

                    return updatedBalloons.filter((b) => !b.popped);
                });

                return updatedArrows;
            });
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [gameStarted, arrows, balloons, hits, onComplete, playSuccessSFX]);

    return (
        <div
            ref={gameAreaRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={shootArrow}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 md:p-6 bg-[#fce7f3] text-pink-950 overflow-hidden cursor-crosshair select-none pointer-events-auto"
        >
            {/* Top Floating Polaroid Cards (as seen in screenshot) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-none">
                <div className="p-2 pb-3 bg-white rounded-lg shadow-md border border-pink-200 transform -rotate-6 w-20 text-center">
                    <div className="w-full aspect-[4/3] bg-pink-100 rounded mb-1 flex items-center justify-center text-[9px] font-mono text-pink-500 font-bold">
                        💖 LOVE
                    </div>
                    <span className="text-[9px] font-serif font-bold text-zinc-800">Happy</span>
                </div>
                <div className="p-2 pb-3 bg-white rounded-lg shadow-md border border-pink-200 transform rotate-6 w-20 text-center">
                    <div className="w-full aspect-[4/3] bg-rose-100 rounded mb-1 flex items-center justify-center text-[9px] font-mono text-rose-500 font-bold">
                        🎂 SIRIVALLI PURNA
                    </div>
                    <span className="text-[9px] font-serif font-bold text-zinc-800">Birthday</span>
                </div>
            </div>

            {/* Header Game Score & Status */}
            <div className="w-full max-w-4xl flex items-center justify-between z-20 mt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-pink-300 shadow-md">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-bounce" />
                    <span className="text-xs font-mono font-bold text-pink-900 tracking-wider">
                        CUPID'S ARCHERY GAME
                    </span>
                </div>

                {/* Hits Badge */}
                <div className="px-5 py-2 rounded-full bg-rose-500 text-white font-mono font-bold text-sm shadow-lg border border-pink-300 flex items-center gap-2">
                    <span>HITS:</span>
                    <span className="text-amber-200 text-base">{hits} / 9</span>
                </div>
            </div>

            {/* Hint Popup Toast Banner */}
            <AnimatePresence>
                {activeHint && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="absolute top-20 z-40 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white font-mono text-xs md:text-sm font-bold shadow-[0_0_30px_rgba(225,29,72,0.6)] border-2 border-pink-200 flex items-center gap-2 animate-pulse"
                    >
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span>{activeHint}</span>
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pre-Game Start Banner */}
            {!gameStarted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full p-6 md:p-8 rounded-3xl bg-white/95 border-4 border-pink-400 shadow-[0_0_60px_rgba(244,114,182,0.5)] text-center flex flex-col items-center gap-4 text-pink-950"
                    >
                        <div className="p-4 rounded-full bg-pink-100 border-2 border-pink-300 text-rose-600">
                            <Heart className="w-10 h-10 fill-current animate-pulse" />
                        </div>

                        <h3 className="text-xl font-bold font-serif text-pink-950">
                            💖 Want the Grand Birthday Surprise?
                        </h3>

                        <p className="text-xs md:text-sm text-pink-800 font-sans leading-relaxed">
                            Shoot Cupid's arrows at the floating heart balloons! Hit 9 hearts to reveal 3 password hints and unlock the Grand Finale.
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setGameStarted(true);
                            }}
                            className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            <span>🏹 Start Archery Game</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            )}

            {/* LEFT SIDE: REALISTIC CUPID'S BOW */}
            <div
                className="absolute left-6 z-20 transition-all duration-75 pointer-events-none flex items-center"
                style={{ top: `${bowY}px`, transform: 'translateY(-50%)' }}
            >
                <div className="relative w-16 h-36 flex items-center justify-center filter drop-shadow-md">
                    {/* SVG Curved Wooden Bow */}
                    <svg viewBox="0 0 40 120" className="w-full h-full">
                        {/* Curved Wooden Stave */}
                        <path
                            d="M 35 5 Q 5 60 35 115"
                            fill="none"
                            stroke="#5c2c16"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 35 5 Q 5 60 35 115"
                            fill="none"
                            stroke="#8B4513"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        {/* Bow Center Grip */}
                        <rect x="10" y="52" width="8" height="16" rx="2" fill="#2d150b" />
                        {/* Taut Bowstring */}
                        <line x1="35" y1="5" x2="35" y2="115" stroke="#fbcfe8" strokeWidth="1.5" />
                    </svg>

                    {/* Arrow Mounted Ready to Shoot */}
                    <div className="absolute left-6 w-14 h-2 flex items-center pointer-events-none">
                        <div className="w-12 h-1 bg-gradient-to-r from-zinc-800 via-amber-900 to-zinc-900 shadow-sm" />
                        {/* Arrowhead */}
                        <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[10px] border-l-rose-600 drop-shadow" />
                    </div>
                </div>
            </div>

            {/* SHOOTING ARROWS IN FLIGHT */}
            {arrows.map((arrow) => (
                <div
                    key={arrow.id}
                    className="absolute z-20 pointer-events-none flex items-center drop-shadow-md"
                    style={{
                        left: `${arrow.x}%`,
                        top: `${arrow.y}px`,
                        transform: 'translateY(-50%)',
                    }}
                >
                    {/* Feather Fletchings */}
                    <div className="w-2.5 h-3 bg-pink-400 skew-x-12 rounded-sm" />
                    {/* Arrow Shaft */}
                    <div className="w-14 h-1 bg-gradient-to-r from-zinc-800 to-zinc-950 shadow-sm" />
                    {/* Metallic Arrowhead */}
                    <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[12px] border-l-rose-600" />
                </div>
            ))}

            {/* FLOATING 3D RED HEART BALLOONS */}
            {balloons.map((balloon) => (
                <div
                    key={balloon.id}
                    className="absolute z-10 pointer-events-none flex flex-col items-center"
                    style={{
                        left: `${balloon.x}%`,
                        bottom: `${balloon.y}px`,
                    }}
                >
                    {/* Shiny 3D Heart Balloon */}
                    <div className="relative flex flex-col items-center filter drop-shadow-[0_8px_16px_rgba(225,29,72,0.35)]">
                        <svg
                            viewBox="0 0 32 32"
                            style={{ width: `${balloon.size}px`, height: `${balloon.size}px` }}
                            className="animate-pulse"
                        >
                            <defs>
                                <radialGradient id={`heartGrad-${balloon.id}`} cx="35%" cy="30%" r="65%">
                                    <stop offset="0%" stopColor="#ff6b81" />
                                    <stop offset="50%" stopColor="#e11d48" />
                                    <stop offset="100%" stopColor="#9f1239" />
                                </radialGradient>
                            </defs>
                            {/* Heart Balloon Body */}
                            <path
                                d="M 16 28 C 16 28 3 19 3 10.5 C 3 6 6.5 3 11 3 C 13.8 3 15.5 4.5 16 5.5 C 16.5 4.5 18.2 3 21 3 C 25.5 3 29 6 29 10.5 C 29 19 16 28 16 28 Z"
                                fill={`url(#heartGrad-${balloon.id})`}
                            />
                            {/* Balloon Gloss Highlight */}
                            <path
                                d="M 8 7 C 6.5 9 6.5 12 7.5 14"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                            {/* Balloon Knot */}
                            <polygon points="14,28 18,28 16,31" fill="#9f1239" />
                        </svg>

                        {/* Thin Trailing String */}
                        <div className="w-0.5 h-12 bg-pink-300/80 shadow-sm" />
                    </div>
                </div>
            ))}

            {/* Bottom Hint Progress Indicator */}
            <div className="z-20 mb-2 px-6 py-2 rounded-full bg-white/80 border border-pink-300 shadow-md font-mono text-xs text-pink-900 font-semibold">
                🎯 Click anywhere to shoot arrows! Target: 9 Hearts
            </div>
        </div>
    );
}
