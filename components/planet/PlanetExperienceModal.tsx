'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { PLANETS_DATA } from '@/constants/planets';
import { isDayUnlocked, getTimeUntilUnlock } from '@/utils/progression';
import { fetchPlanetMemories } from '@/lib/memoryEngineApi';
import { MemoryItem } from '@/types/memoryEngine';
import MemoryEngineViewer from '@/components/memoryEngine/MemoryEngineViewer';
import {
    X,
    BookOpen,
    Image as ImageIcon,
    Video,
    Mic,
    Gamepad2,
    Volume2,
    VolumeX,
    Lock,
    Clock,
    Box,
} from 'lucide-react';

export default function PlanetExperienceModal() {
    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const setSelectedPlanetId = useExperienceStore((state) => state.setSelectedPlanetId);

    const [activeTab, setActiveTab] = useState<'memories' | 'overview' | 'letters' | 'photos' | 'videos' | 'voice' | 'games'>('memories');
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [countdownStr, setCountdownStr] = useState<string>('');
    const [memories, setMemories] = useState<MemoryItem[]>([]);
    const [loadingMemories, setLoadingMemories] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const planet = useMemo(
        () => PLANETS_DATA.find((p) => p.id === selectedPlanetId),
        [selectedPlanetId]
    );

    const unlocked = planet ? isDayUnlocked(planet.dayNumber) : false;

    // Lazily load dynamic memories via reusable API
    useEffect(() => {
        if (!planet || !unlocked) return;
        setLoadingMemories(true);
        fetchPlanetMemories(planet.id)
            .then((items) => setMemories(items))
            .finally(() => setLoadingMemories(false));
    }, [planet, unlocked]);

    useEffect(() => {
        if (!planet || unlocked) return;

        const updateTimer = () => {
            const result = getTimeUntilUnlock(planet.dayNumber);
            setCountdownStr(result.formattedCountdown);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [planet, unlocked]);

    useEffect(() => {
        if (planet?.backgroundAudio && unlocked) {
            audioRef.current = new Audio(planet.backgroundAudio);
            audioRef.current.loop = true;
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [planet, unlocked]);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlayingAudio) {
            audioRef.current.pause();
            setIsPlayingAudio(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlayingAudio(true);
        }
    };

    if (!selectedPlanetId || !planet || planetViewMode === 'surface' || planetViewMode === 'zooming') return null;

    const content = planet.content || {};
    const themeColor = planet.customTheme?.primaryColor || planet.color;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/15 bg-slate-950/85 p-6 shadow-2xl text-white backdrop-blur-xl flex flex-col"
                    style={{
                        boxShadow: `0 0 50px ${themeColor}25`,
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full shadow-lg"
                                style={{ backgroundColor: themeColor, boxShadow: `0 0 12px ${themeColor}` }}
                            />
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{planet.name}</h2>
                                <p className="text-xs text-white/60 font-mono">Day {planet.dayNumber} Memory Archive</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {planet.backgroundAudio && unlocked && (
                                <button
                                    onClick={toggleAudio}
                                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 transition-colors"
                                    title="Toggle Custom Planet Music"
                                >
                                    {isPlayingAudio ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedPlanetId(null)}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Locked State Shield View */}
                    {!unlocked ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                <Lock className="w-10 h-10 animate-bounce" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-2xl font-serif text-amber-200">Memory Vault Locked</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Day {planet.dayNumber} ({planet.name}) is sealed in the cosmic timeline. Access will automatically unlock on its scheduled date.
                                </p>
                            </div>

                            {/* Countdown Timer Display */}
                            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono space-y-1">
                                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-amber-400/80">
                                    <Clock className="w-4 h-4" /> Time Remaining Until Unlock
                                </div>
                                <div className="text-3xl font-bold tracking-widest text-amber-200">{countdownStr}</div>
                            </div>
                        </div>
                    ) : (
                        /* Unlocked Experience View */
                        <>
                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-2 my-4 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
                                <button
                                    onClick={() => setActiveTab('memories')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'memories'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Box className="w-4 h-4 text-amber-400" /> Memory Engine ({memories.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('letters')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'letters'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4" /> Letters ({content.letters?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('photos')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'photos'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" /> Photos ({content.photos?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'videos'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Video className="w-4 h-4" /> Videos ({content.videos?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('voice')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'voice'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Mic className="w-4 h-4" /> Voice ({content.voiceNotes?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('games')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'games'
                                        ? 'bg-white/15 text-white border border-white/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Gamepad2 className="w-4 h-4" /> Mini Games ({content.miniGames?.length || 0})
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto pr-2 my-2 space-y-4">
                                {activeTab === 'memories' && (
                                    <div className="space-y-4">
                                        {loadingMemories ? (
                                            <div className="text-center py-12 text-white/50 font-mono text-sm">
                                                Fetching memories dynamically...
                                            </div>
                                        ) : memories.length > 0 ? (
                                            memories.map((mem) => <MemoryEngineViewer key={mem.id} item={mem} />)
                                        ) : (
                                            <div className="text-center py-12 text-white/40">No memories loaded for this planet.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'overview' && (
                                    <div className="space-y-4">
                                        <p className="text-white/80 leading-relaxed text-base">{planet.description}</p>
                                    </div>
                                )}

                                {activeTab === 'letters' && (
                                    <div className="grid gap-4">
                                        {content.letters && content.letters.length > 0 ? (
                                            content.letters.map((letter) => (
                                                <div key={letter.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                                    <h4 className="font-semibold text-lg text-white">{letter.title}</h4>
                                                    <p className="text-white/80 leading-relaxed">{letter.body}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-white/40">No letters configured yet for {planet.name}.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'photos' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {content.photos && content.photos.length > 0 ? (
                                            content.photos.map((photo) => (
                                                <div key={photo.id} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-2">
                                                    <div className="h-32 bg-slate-900 rounded-xl flex items-center justify-center text-white/30">
                                                        Photo Placeholder
                                                    </div>
                                                    <p className="mt-2 text-xs font-medium text-white/80 truncate">{photo.title}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-white/40">No photos configured yet.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'videos' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {content.videos && content.videos.length > 0 ? (
                                            content.videos.map((vid) => (
                                                <div key={vid.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <div className="h-40 bg-slate-900 rounded-xl flex items-center justify-center text-white/30">
                                                        Video Player Placeholder
                                                    </div>
                                                    <h5 className="mt-2 text-sm font-semibold">{vid.title}</h5>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-white/40">No videos configured yet.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'voice' && (
                                    <div className="grid gap-3">
                                        {content.voiceNotes && content.voiceNotes.length > 0 ? (
                                            content.voiceNotes.map((vn) => (
                                                <div key={vn.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <div>
                                                        <h5 className="font-semibold text-sm">{vn.title}</h5>
                                                        <span className="text-xs text-white/40 font-mono">{vn.duration || '00:00'}</span>
                                                    </div>
                                                    <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold">
                                                        Play Voice Note
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-white/40">No voice notes configured yet.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'games' && (
                                    <div className="grid gap-3">
                                        {content.miniGames && content.miniGames.length > 0 ? (
                                            content.miniGames.map((game) => (
                                                <div key={game.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <div>
                                                        <h5 className="font-semibold text-sm">{game.title}</h5>
                                                        <span className="text-xs text-white/40 uppercase font-mono">{game.type}</span>
                                                    </div>
                                                    <button className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                                                        Start Game
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-white/40">No mini games configured yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
