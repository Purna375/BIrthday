'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { PLANETS_DATA } from '@/constants/planets';
import { Sparkles, Trophy, Gift, ArrowRight } from 'lucide-react';

// Puzzle Components
import ConstellationConnect from './puzzles/ConstellationConnect';
import MemoryCardFlip from './puzzles/MemoryCardFlip';
import WordGarden from './puzzles/WordGarden';
import LavaQuiz from './puzzles/LavaQuiz';
import DeepSeaJigsaw from './puzzles/DeepSeaJigsaw';
import EmojiCipher from './puzzles/EmojiCipher';
import OrbitalTimeline from './puzzles/OrbitalTimeline';
import SteampunkRiddles from './puzzles/SteampunkRiddles';
import CathedralNineKeys from './puzzles/CathedralNineKeys';

// Gift Components
import LetterGift from './gifts/LetterGift';
import PhotoGalaxyGift from './gifts/PhotoGalaxyGift';
import ReasonsGardenGift from './gifts/ReasonsGardenGift';
import DanceVideoGift from './gifts/DanceVideoGift';
import SoundtrackGift from './gifts/SoundtrackGift';
import VoiceNoteGift from './gifts/VoiceNoteGift';
import CouponsGift from './gifts/CouponsGift';
import PoemGift from './gifts/PoemGift';
import Day10TeaserGift from './gifts/Day10TeaserGift';

const PLANET_VICTORY_INFO: Record<number, { title: string; reward: string; description: string }> = {
    1: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED AETHERIA!',
        reward: '💌 YOU WON: Secret Birthday Letter #1',
        description: 'You unlocked the personal birthday letter written specially for Sirivalli Purna.',
    },
    2: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED CELESTIA!',
        reward: '📸 YOU WON: Cosmic Photo Galaxy Gallery',
        description: 'You unlocked the memory photos of togetherness under Celestia violet skies.',
    },
    3: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED VERDANTINA!',
        reward: '🌿 YOU WON: Reasons I Love You Garden',
        description: 'You unlocked the interactive glowing flora garden of reasons.',
    },
    4: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED SOLARIA!',
        reward: '🎬 YOU WON: Special Solaria Dance Surprise Video',
        description: 'You unlocked the lava world video gift experience.',
    },
    5: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED AURA NOVA!',
        reward: '🎵 YOU WON: Cosmic BGM Soundtrack Vault',
        description: 'You unlocked the ambient music tracks of the universe.',
    },
    6: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED ZEPHYRIA!',
        reward: '🎙️ YOU WON: Birthday Voice Message Note',
        description: 'You unlocked the personal voice message recording.',
    },
    7: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED ASTRALIA!',
        reward: '🪐 YOU WON: Golden Saturn Ring Memory Gallery',
        description: 'You unlocked the golden ring story cards of your beauty.',
    },
    8: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED CHRONOS PRIME!',
        reward: '📜 YOU WON: Stardust Birthday Poem',
        description: 'You unlocked the timeless birthday poem of love.',
    },
    9: {
        title: '🎉 CONGRATULATIONS! YOU SOLVED ETERNIA!',
        reward: '🌸 YOU WON: 3D Glowing Crystal Lotus & Grand Singularity Key',
        description: 'You unlocked the 3D blooming glass lotus flower and gateway key to the Day 10 Singularity Finale!',
    },
};

interface PlanetPuzzleModalContentProps {
    planet: typeof PLANETS_DATA[0];
}

function PlanetPuzzleModalContent({ planet }: PlanetPuzzleModalContentProps) {
    const closePlanetPuzzle = useExperienceStore((state) => state.closePlanetPuzzle);
    const solvePlanetPuzzle = useExperienceStore((state) => state.solvePlanetPuzzle);
    const solvedPlanetIds = useExperienceStore((state) => state.solvedPlanetIds);
    const { playSuccessSFX } = useAudioStore();

    const isAlreadySolved = solvedPlanetIds.includes(planet.id);
    const [showGiftReveal, setShowGiftReveal] = useState(isAlreadySolved);

    // FLute_BGM.mp3 plays automatically with loop=true ONLY for Day 1 Surprise Gift
    useEffect(() => {
        if (showGiftReveal && planet.dayNumber === 1) {
            const audio = new Audio('/audio/planets/FLute_BGM.mp3');
            audio.loop = true; // auto replay enabled
            audio.volume = 0.6;
            audio.play().catch(() => {});

            return () => {
                audio.pause();
                audio.currentTime = 0;
            };
        }
    }, [showGiftReveal, planet.dayNumber]);

    const handleSolve = () => {
        playSuccessSFX();
        solvePlanetPuzzle(planet.id);
        setShowGiftReveal(true);
    };

    const renderPuzzle = () => {
        switch (planet.dayNumber) {
            case 1:
                return <ConstellationConnect onSolve={handleSolve} planetColor={planet.color} />;
            case 2:
                return <MemoryCardFlip onSolve={handleSolve} planetColor={planet.color} />;
            case 3:
                return <WordGarden onSolve={handleSolve} planetColor={planet.color} />;
            case 4:
                return <LavaQuiz onSolve={handleSolve} planetColor={planet.color} />;
            case 5:
                return <DeepSeaJigsaw onSolve={handleSolve} planetColor={planet.color} />;
            case 6:
                return <EmojiCipher onSolve={handleSolve} planetColor={planet.color} />;
            case 7:
                return <OrbitalTimeline onSolve={handleSolve} planetColor={planet.color} />;
            case 8:
                return <SteampunkRiddles onSolve={handleSolve} planetColor={planet.color} />;
            case 9:
                return <CathedralNineKeys onSolve={handleSolve} planetColor={planet.color} />;
            default:
                return null;
        }
    };

    if (showGiftReveal) {
        switch (planet.dayNumber) {
            case 1:
                return (
                    <LetterGift
                        title={planet.content?.letters?.[0]?.title}
                        body={planet.content?.letters?.[0]?.body}
                        onClose={closePlanetPuzzle}
                    />
                );
            case 2:
                return <PhotoGalaxyGift onClose={closePlanetPuzzle} />;
            case 3:
                return <ReasonsGardenGift onClose={closePlanetPuzzle} />;
            case 4:
                return <DanceVideoGift onClose={closePlanetPuzzle} />;
            case 5:
                return <SoundtrackGift onClose={closePlanetPuzzle} />;
            case 6:
                return (
                    <VoiceNoteGift
                        audioUrl={planet.content?.voiceNotes?.[0]?.audioUrl}
                        title={planet.content?.voiceNotes?.[0]?.title}
                        onClose={closePlanetPuzzle}
                    />
                );
            case 7:
                return <CouponsGift />;
            case 8:
                return (
                    <PoemGift
                        title={planet.content?.letters?.[0]?.title}
                        body={planet.content?.letters?.[0]?.body}
                        onClose={closePlanetPuzzle}
                    />
                );
            case 9:
                return <Day10TeaserGift onClose={closePlanetPuzzle} />;
            default:
                break;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-zinc-950/95 border-2 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-white flex flex-col gap-6"
                style={{ borderColor: `${planet.color}60`, boxShadow: `0 0 80px ${planet.color}30` }}
            >
                {/* Top Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-3 rounded-2xl text-black shadow-lg"
                            style={{ backgroundColor: planet.color }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                                Day {planet.dayNumber} Vault {showGiftReveal ? 'Surprise Unlocked' : 'Challenge'}
                            </span>
                            <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                                {planet.name} — {showGiftReveal ? 'Daily Birthday Gift' : 'Interactive Vault Puzzle'}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={closePlanetPuzzle}
                        className="px-3.5 py-1.5 text-xs font-mono uppercase rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors cursor-pointer"
                    >
                        Close ✕
                    </button>
                </div>

                {/* Puzzle Body */}
                <div className="w-full">
                    {renderPuzzle()}
                </div>
            </motion.div>
        </div>
    );
}

export default function PlanetPuzzleModal() {
    const activePuzzlePlanetId = useExperienceStore((state) => state.activePuzzlePlanetId);
    const planet = PLANETS_DATA.find((p) => p.id === activePuzzlePlanetId);

    if (!activePuzzlePlanetId || !planet) return null;

    return (
        <AnimatePresence>
            <PlanetPuzzleModalContent key={planet.id} planet={planet} />
        </AnimatePresence>
    );
}
