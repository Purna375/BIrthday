'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Moon, Sun, Compass } from 'lucide-react';

const CARD_ICONS = [
    { id: 1, name: 'Our First Hug', Icon: Heart, color: 'text-rose-400' },
    { id: 2, name: 'Late Night Texts', Icon: Star, color: 'text-amber-300' },
    { id: 3, name: 'Deep Conversations', Icon: Moon, color: 'text-indigo-300' },
    { id: 4, name: 'Endless Laughter', Icon: Sun, color: 'text-yellow-400' },
    { id: 5, name: 'Future Dreams', Icon: Sparkles, color: 'text-cyan-300' },
    { id: 6, name: 'Growing Together', Icon: Compass, color: 'text-emerald-400' },
];

interface Card {
    instanceId: number;
    pairId: number;
    name: string;
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface Props {
    onSolve: () => void;
    planetColor: string;
}

export default function MemoryCardFlip({ onSolve, planetColor }: Props) {
    const [cards, setCards] = useState<Card[]>(() => {
        const deck: Card[] = [];
        CARD_ICONS.forEach((item, idx) => {
            deck.push({
                instanceId: idx * 2,
                pairId: item.id,
                name: item.name,
                Icon: item.Icon,
                color: item.color,
                isFlipped: false,
                isMatched: false,
            });
            deck.push({
                instanceId: idx * 2 + 1,
                pairId: item.id,
                name: item.name,
                Icon: item.Icon,
                color: item.color,
                isFlipped: false,
                isMatched: false,
            });
        });
        // Shuffle deck
        return deck.sort(() => Math.random() - 0.5);
    });

    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [wrongFlash, setWrongFlash] = useState<number[]>([]);

    const matchedCount = cards.filter((c) => c.isMatched).length / 2;

    const handleCardClick = (instanceId: number) => {
        if (isChecking) return;
        const target = cards.find((c) => c.instanceId === instanceId);
        if (!target || target.isFlipped || target.isMatched) return;

        // Flip card
        const updated = cards.map((c) => (c.instanceId === instanceId ? { ...c, isFlipped: true } : c));
        setCards(updated);

        const newSelected = [...selectedCards, instanceId];
        setSelectedCards(newSelected);

        if (newSelected.length === 2) {
            setIsChecking(true);
            const [firstId, secondId] = newSelected;
            const card1 = updated.find((c) => c.instanceId === firstId)!;
            const card2 = updated.find((c) => c.instanceId === secondId)!;

            if (card1.pairId === card2.pairId) {
                // Match!
                setTimeout(() => {
                    const matchedDeck = updated.map((c) =>
                        c.pairId === card1.pairId ? { ...c, isMatched: true } : c
                    );
                    setCards(matchedDeck);
                    setSelectedCards([]);
                    setIsChecking(false);

                    if (matchedDeck.every((c) => c.isMatched)) {
                        setTimeout(onSolve, 1000);
                    }
                }, 500);
            } else {
                // Wrong match
                setWrongFlash([firstId, secondId]);
                setTimeout(() => {
                    setCards(
                        updated.map((c) =>
                            c.instanceId === firstId || c.instanceId === secondId ? { ...c, isFlipped: false } : c
                        )
                    );
                    setWrongFlash([]);
                    setSelectedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-center font-mono italic" style={{ color: planetColor }}>
                &quot;Find matching cosmic runes to align the violet memory mirror...&quot;
            </p>

            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-md p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/30 backdrop-blur-xl">
                {cards.map((card) => {
                    const isFlipped = card.isFlipped || card.isMatched;
                    const isWrong = wrongFlash.includes(card.instanceId);

                    return (
                        <div key={card.instanceId} className="perspective-1000 h-24">
                            <motion.div
                                className="w-full h-full relative cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => handleCardClick(card.instanceId)}
                            >
                                {/* Front Face (Back of card when hidden) */}
                                <div
                                    className="absolute inset-0 rounded-xl bg-zinc-950 border border-purple-500/40 flex items-center justify-center shadow-lg hover:border-purple-400 transition-colors"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <Sparkles className="w-6 h-6 text-purple-400/60 animate-pulse" />
                                </div>

                                {/* Back Face (Revealed Icon & Text) */}
                                <div
                                    className={`absolute inset-0 rounded-xl border flex flex-col items-center justify-center p-2 text-center shadow-2xl ${isWrong
                                        ? 'bg-red-950/80 border-red-500 shadow-red-500/50'
                                        : card.isMatched
                                            ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                                            : 'bg-zinc-900 border-purple-500/60'
                                        }`}
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <card.Icon className={`w-8 h-8 ${card.color} mb-1`} />
                                    <span className={`text-[8px] font-mono leading-tight ${card.color}`}>
                                        {card.name}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>MEMORY MIRROR MATCHES</span>
                    <span>{matchedCount} / 6</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden border border-purple-500/20">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 transition-all duration-300"
                        style={{ width: `${(matchedCount / 6) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
