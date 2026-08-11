'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Heart, Lock, Unlock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

interface Props {
    onUnlockSuccess: () => void;
}

export default function Day10PasswordGate({ onUnlockSuccess }: Props) {
    const { playSuccessSFX } = useAudioStore();
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanInput = passwordInput.trim().toLowerCase().replace(/\s+/g, '');

        // Secret password: 15 + 19 = 34 (Also accept 1519 or 15+19 for user convenience)
        if (cleanInput === '34' || cleanInput === '1519' || cleanInput === '15+19') {
            setErrorMsg(null);
            playSuccessSFX();
            onUnlockSuccess();
        } else {
            setErrorMsg('Incorrect passkey! Calculate: Hint 1 + Hint 2');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#fce7f3] text-pink-950 overflow-y-auto pointer-events-auto">
            {/* Ambient Background Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-200/50 via-pink-100 to-[#fce7f3] pointer-events-none" />

            {/* Password Gate Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-white/95 border-4 border-pink-300 shadow-[0_0_80px_rgba(244,114,182,0.5)] flex flex-col items-center gap-6 text-center z-10"
            >
                {/* Lock Header Icon */}
                <div className="p-4 rounded-full bg-rose-500 text-white shadow-lg border-2 border-pink-200">
                    <Key className="w-10 h-10 animate-bounce" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-pink-100 text-rose-600 border border-pink-300 font-bold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Day 10 Passkey Challenge
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-pink-950 tracking-wide">
                        Unlock Birthday Surprises
                    </h2>
                </div>

                {/* 3 Unlocked Hints Cards */}
                <div className="w-full flex flex-col gap-2.5 text-left">
                    <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="text-xs md:text-sm font-mono font-semibold text-pink-900">
                            Hint 1: Anniversary date
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="text-xs md:text-sm font-mono font-semibold text-pink-900">
                            Hint 2: First meet date in private space
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-100 to-pink-100 border border-pink-300 flex items-center gap-3 shadow-sm">
                        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-spin-slow" />
                        <span className="text-xs md:text-sm font-mono font-bold text-rose-950">
                            Hint 3: Calculate sum: (Hint 1 + Hint 2)
                        </span>
                    </div>
                </div>

                {/* Password Form Input */}
                <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4 mt-1">
                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-pink-800">
                            Enter Passkey Below:
                        </label>
                        <input
                            type="text"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Type password..."
                            className="w-full px-5 py-3.5 rounded-2xl bg-pink-50 border-2 border-pink-300 text-pink-950 text-base md:text-lg font-mono font-bold placeholder:text-pink-300 focus:outline-none focus:border-rose-500 transition-colors shadow-inner text-center tracking-widest"
                            autoFocus
                        />
                    </div>

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Unlock className="w-4 h-4" />
                        <span>Unlock Grand Surprises</span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
