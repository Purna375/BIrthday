'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';
import { useExperienceStore } from '@/store/useExperienceStore';

export interface CarouselCard {
    num: string;
    title: string;
    image?: string;
    fallbackImage?: string;
}

const CAROUSEL_ITEMS: CarouselCard[] = [
    {
        num: '01',
        title: 'Hi 👋',
    },
    {
        num: '02',
        title: 'I want to tell you Something 😍',
    },
    {
        num: '03',
        title: 'Please Keep Dragging 😊',
    },
    {
        num: '04',
        title: 'You are Amazing 🤩',
        image: '/images/image1day7.png',
    },
    {
        num: '05',
        title: 'Most Beautiful Person on Earth 💯',
        image: '/images/image2day7.png',
    },
    {
        num: '06',
        title: 'And Cutest 🎀',
        image: '/images/image3day7.png',
    },
    {
        num: '07',
        title: 'Golden Hour Royalty 👑',
        image: '/images/image4day7.png',
    },
    {
        num: '08',
        title: 'I feel very Lucky Everyday 😇',
        image: '/images/image5day7.png',
    },
    {
        num: '09',
        title: 'and I have Crush on You 🥰',
        image: '/images/image6day7.png',
    },
    {
        num: '10',
        title: 'I love You ❤️',
        image: '/images/image7day7.png',
    },
];

interface AstraliaCarouselGiftProps {
    onClose?: () => void;
}

export default function AstraliaCarouselGift({ onClose }: AstraliaCarouselGiftProps) {
    const [progress, setProgress] = useState(2); // Start at card 03 in center focus
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [progressOnDown, setProgressOnDown] = useState(2);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { playClick } = useAudioStore();

    const closePlanetPuzzle = useExperienceStore((state) => state.closePlanetPuzzle);
    const closeVaultGift = useExperienceStore((state) => state.closeVaultGift);

    const handleDismiss = () => {
        if (onClose) {
            onClose();
        } else {
            closePlanetPuzzle();
            closeVaultGift();
        }
    };

    const total = CAROUSEL_ITEMS.length;

    // Smooth navigation helper
    const goToProgress = useCallback(
        (targetProgress: number) => {
            const clamped = Math.max(0, Math.min(targetProgress, total - 1));
            setProgress(clamped);
            playClick();
        },
        [total, playClick]
    );

    const activeIndex = Math.round(progress);

    // Pointer drag logic for smooth dragging across cards (supports vertical upwards/downwards & horizontal drag)
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
        setProgressOnDown(progress);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        // Update custom trailing cursor coordinates
        setCursorPos({
            x: e.clientX,
            y: e.clientY,
        });

        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // Determine primary drag direction: dragging upwards (-deltaY) or leftwards (-deltaX) advances cards
        const primaryDelta = Math.abs(deltaY) > Math.abs(deltaX) ? -deltaY : -deltaX;
        const dragSensitivity = 0.0035;

        const newProgress = progressOnDown + primaryDelta * dragSensitivity;
        setProgress(Math.max(0, Math.min(newProgress, total - 1)));
    };

    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        // Snap smoothly to nearest integer card
        setProgress(Math.round(progress));
    };

    // When user clicks/taps any photo/card in the archway, it automatically slides into focus!
    const handleCardClick = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        goToProgress(idx);
    };

    // Wheel scroll navigation (scrolling up/down moves cards automatically)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.35 : -0.35;
            setProgress((prev) => Math.max(0, Math.min(prev + delta, total - 1)));
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [total]);

    // Keyboard arrow keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                goToProgress(Math.min(progress + 1, total - 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                goToProgress(Math.max(progress - 1, 0));
            } else if (e.key === 'Escape') {
                handleDismiss();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [progress, total, goToProgress]);

    const handleImageError = (index: number) => {
        setFailedImages((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="fixed inset-0 z-[9999] w-screen h-screen bg-gradient-to-br from-black via-[#160024] to-[#220033] overflow-hidden select-none cursor-grab active:cursor-grabbing font-orelo flex items-center justify-center"
        >
            {/* Custom Dual Trailing Cursor */}
            <div
                className="fixed pointer-events-none z-[10000] w-10 h-10 rounded-full border border-white/30 -ml-5 -mt-5 transition-transform duration-100 ease-out hidden md:block"
                style={{
                    transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
                }}
            />
            <div
                className="fixed pointer-events-none z-[10000] w-1 h-1 rounded-full bg-white -ml-0.5 -mt-0.5 transition-transform duration-75 ease-out hidden md:block"
                style={{
                    transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
                }}
            />

            {/* Top-Right Close [X] Button */}
            <button
                onClick={handleDismiss}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-110 group"
                title="Close Astralia Carousel"
            >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Main 3D Curved Archway Card Stage */}
            <div className="relative w-full h-full flex items-center justify-center">
                {CAROUSEL_ITEMS.map((item, idx) => {
                    // Offset relative to current smooth progress float
                    const activeOffset = idx - progress;

                    // Exact 3D Archway transforms mapping offsets to curved 3D archway
                    const normalizedActive = activeOffset * 0.12;
                    const xPercent = normalizedActive * 650; // Horizontal fanning translation
                    const yPercent = normalizedActive * 160; // Vertical archway offset (upwards / downwards curve)
                    const rotationDeg = normalizedActive * 110; // Curved rotation angle
                    const zIndex = 100 - Math.round(Math.abs(activeOffset) * 10);
                    const opacity = Math.max(0, 1 - Math.abs(activeOffset) * 0.22);
                    const scale = Math.max(0.7, 1 - Math.abs(activeOffset) * 0.05);

                    const isFailed = failedImages[idx];
                    const imgSrc = isFailed ? item.fallbackImage : (item.image || item.fallbackImage);

                    return (
                        <motion.div
                            key={idx}
                            onClick={(e) => handleCardClick(idx, e)}
                            animate={{
                                x: `${xPercent}%`,
                                y: `${yPercent}%`,
                                rotate: `${rotationDeg}deg`,
                                scale,
                                opacity,
                            }}
                            transition={{
                                duration: 0.8,
                                ease: [0, 0.02, 0, 1], // Exact cubic-bezier(0, 0.02, 0, 1) transition
                            }}
                            style={{
                                zIndex,
                                width: 'clamp(180px, 28vw, 320px)',
                                height: 'clamp(240px, 38vw, 440px)',
                                transformOrigin: '0% 100%',
                            }}
                            className="absolute rounded-[14px] overflow-hidden bg-black shadow-[0_15px_60px_15px_rgba(0,0,0,0.7)] pointer-events-all select-none border border-white/10 hover:border-yellow-400/40 transition-colors"
                        >
                            {/* Card Box & Content Overlay */}
                            <div className="relative w-full h-full z-10 p-6 flex flex-col justify-between font-orelo">
                                {/* Dark Top/Bottom Gradients */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-0 pointer-events-none" />

                                {/* Number badge at top left */}
                                <div className="relative z-10 text-white font-orelo text-4xl sm:text-6xl md:text-7xl tracking-tight drop-shadow-lg">
                                    {item.num}
                                </div>

                                {/* Title text at bottom left */}
                                <div className="relative z-10 text-white font-orelo text-2xl sm:text-3xl md:text-4xl font-normal leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] max-w-[95%]">
                                    {item.title}
                                </div>
                            </div>

                            {/* Background Photo if available */}
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={item.title}
                                    onError={() => handleImageError(idx)}
                                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                                    draggable={false}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-black to-yellow-950 z-0 flex items-center justify-center opacity-80">
                                    <Sparkles className="w-16 h-16 text-yellow-400/30 animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Navigation Controls Overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-2xl">
                <button
                    onClick={() => goToProgress(progress - 1)}
                    disabled={progress <= 0}
                    className={`p-2 rounded-full transition-all ${
                        progress <= 0
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Previous Slide"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="font-mono text-xs font-semibold text-yellow-300 tracking-wider">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </div>

                <button
                    onClick={() => goToProgress(progress + 1)}
                    disabled={progress >= total - 1}
                    className={`p-2 rounded-full transition-all ${
                        progress >= total - 1
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Next Slide"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {activeIndex === total - 1 && (
                    <button
                        onClick={() => goToProgress(0)}
                        className="p-2 rounded-full bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 transition-all cursor-pointer"
                        title="Replay Story"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
