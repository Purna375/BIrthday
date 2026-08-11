'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, VolumeX, Play, Pause, RotateCcw, RotateCw, Radio } from 'lucide-react';

interface Props {
    audioUrl?: string;
    title?: string;
    onClose?: () => void;
}

export default function VoiceNoteGift({
    audioUrl = '/audio/voice_gift.mpeg',
    title = 'Secret Voice Recording for Zephyria ❤️',
    onClose,
}: Props) {
    const [isInserted, setIsInserted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const skipTime = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                Math.max(audioRef.current.currentTime + seconds, 0),
                duration || Infinity
            );
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto pointer-events-auto">
            {/* Ambient Pink Rose Aura Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-zinc-950 to-black pointer-events-none" />

            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={() => {
                    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
                }}
                onLoadedMetadata={() => {
                    if (audioRef.current) setDuration(audioRef.current.duration);
                }}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                {isInserted && (
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            setIsInserted(false);
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Eject Tape 🎙️</span>
                    </button>
                )}

                {onClose && (
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            if (audioRef.current) audioRef.current.pause();
                            onClose();
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <span>Close ✕</span>
                    </button>
                )}
            </div>

            <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-6">
                {!isInserted ? (
                    /* STAGE 1: HOLOGRAPHIC CASSETTE TAPE */
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        onClick={() => {
                            setIsInserted(true);
                            setIsPlaying(true);
                        }}
                        className="group relative cursor-pointer flex flex-col items-center gap-6 w-full max-w-md text-center"
                    >
                        {/* Cassette Tape Object */}
                        <div className="relative w-72 h-44 rounded-3xl bg-gradient-to-tr from-rose-950 via-zinc-900 to-pink-950 border-4 border-rose-400/80 flex flex-col items-center justify-between p-5 shadow-[0_0_80px_rgba(244,63,94,0.6)] group-hover:scale-105 transition-transform duration-500">
                            {/* Tape Wheels */}
                            <div className="w-full flex justify-around items-center px-4 mt-2">
                                <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-rose-400/60 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-rose-400 animate-spin-slow" />
                                </div>
                                <span className="text-[10px] font-mono text-rose-300 tracking-widest uppercase">
                                    ZEPHYRIA DAY 6 TAPE
                                </span>
                                <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-rose-400/60 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-rose-400 animate-spin-slow" />
                                </div>
                            </div>

                            <div className="p-3 rounded-full bg-rose-600/30 border border-rose-300 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.8)]">
                                <Mic className="w-6 h-6 text-rose-200 animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm flex items-center gap-2">
                                <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Day 6 Voice Vault
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-white tracking-wide">
                                Secret Birthday Voice Note
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-rose-300 bg-rose-950/60 px-5 py-2.5 rounded-full border border-rose-500/40 mt-2 group-hover:bg-rose-900/80 transition-colors">
                                🎙️ Tap Tape to Insert & Play Voice Note
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* STAGE 2: CASSETTE DECK PLAYING */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center gap-6"
                    >
                        <div className="text-center flex flex-col items-center gap-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-2">
                                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                                ZEPHYRIA VOICE DECK • {isPlaying ? 'PLAYING' : 'PAUSED'}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-rose-100">
                                {title}
                            </h3>
                        </div>

                        {/* Cassette Deck Stage Box */}
                        <div className="relative w-full max-w-lg p-8 rounded-3xl bg-zinc-950/90 border-2 border-rose-500/60 shadow-[0_0_80px_rgba(244,63,94,0.5)] flex flex-col items-center gap-6 overflow-hidden">
                            {/* Live Soundwave Rings & Reels */}
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                {isPlaying && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-4 border-rose-500/60 animate-ping" />
                                        <div className="absolute inset-3 rounded-full border-2 border-pink-400/40 animate-ping delay-150" />
                                    </>
                                )}
                                <motion.div
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                                    className="w-24 h-24 rounded-full bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.8)]"
                                >
                                    <Mic className="w-10 h-10" />
                                </motion.div>
                            </div>

                            {/* Equalizer Wavebars */}
                            <div className="flex items-end gap-1.5 h-8 my-1">
                                {[40, 75, 50, 90, 60, 100, 45, 80, 55, 70, 85, 40].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 bg-gradient-to-t from-rose-500 to-pink-400 rounded-full transition-all duration-200"
                                        style={{ height: isPlaying ? `${h}%` : '20%' }}
                                    />
                                ))}
                            </div>

                            {/* Progress Bar & Seek Slider */}
                            <div className="w-full flex flex-col gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                />
                                <div className="flex justify-between items-center text-xs text-rose-300 font-mono">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>Recorded with Love ❤️</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls Bar */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => skipTime(-10)}
                                    title="Rewind 10s"
                                    className="p-3 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/80 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.7)] hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                    <span>{isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}</span>
                                </button>

                                <button
                                    onClick={() => skipTime(10)}
                                    title="Forward 10s"
                                    className="p-3 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/80 transition-colors"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={toggleMute}
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                    className="p-3 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/80 transition-colors"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

