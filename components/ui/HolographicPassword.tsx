'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function HolographicPassword() {
    const isPasswordModalOpen = useExperienceStore((state) => state.isPasswordModalOpen);
    const isPasswordError = useExperienceStore((state) => state.isPasswordError);
    const isPasswordSuccess = useExperienceStore((state) => state.isPasswordSuccess);
    const setPasswordModalOpen = useExperienceStore((state) => state.setPasswordModalOpen);
    const verifyPassword = useExperienceStore((state) => state.verifyPassword);
    const checkExistingAuth = useExperienceStore((state) => state.checkExistingAuth);
    const isAuthenticated = useExperienceStore((state) => state.isAuthenticated);

    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        checkExistingAuth();
    }, [checkExistingAuth]);

    useEffect(() => {
        if (isPasswordModalOpen) {
            setPassword('');
        }
    }, [isPasswordModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim() || isVerifying) return;

        setIsVerifying(true);
        await verifyPassword(password);
        setIsVerifying(false);
    };

    const handleUndo = () => {
        setPasswordModalOpen(false);
    };

    return (
        <AnimatePresence>
            {isPasswordModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg pointer-events-auto select-none"
                >
                    <motion.div
                        initial={{ scale: 0.85, y: 20 }}
                        animate={{
                            scale: 1,
                            y: 0,
                            x: isPasswordError ? [-12, 12, -12, 12, 0] : 0,
                        }}
                        exit={{ scale: 0.85, y: 20, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                            x: { duration: 0.4 },
                        }}
                        className={`relative max-w-md w-full p-8 rounded-3xl bg-zinc-950/95 border ${isPasswordError
                            ? 'border-red-500/80 shadow-[0_0_50px_rgba(244,63,94,0.5)]'
                            : isPasswordSuccess
                                ? 'border-white/90 shadow-[0_0_60px_rgba(255,255,255,0.6)]'
                                : 'border-zinc-700 shadow-[0_0_40px_rgba(255,255,255,0.1)]'
                            } backdrop-blur-2xl flex flex-col items-center gap-6 text-center overflow-hidden transition-all duration-500`}
                    >
                        {/* Decorative Top Glowing Border */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 via-white to-zinc-700"></div>

                        {/* Header Info */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                                SINGULARITY GATEWAY ACCESS
                            </span>
                            <h2 className="text-2xl font-serif text-white tracking-wider">
                                {isPasswordSuccess
                                    ? 'Singularity Unlocked'
                                    : isPasswordError
                                        ? 'Access Denied'
                                        : 'Singularity of Eternal Love'}
                            </h2>
                            <p className="text-xs text-zinc-400 font-mono max-w-xs">
                                {isPasswordSuccess
                                    ? 'Gravitational barrier collapsed. Entering inner realm...'
                                    : isPasswordError
                                        ? 'Invalid passkey. Space-time dilation distortion detected.'
                                        : 'Please enter the passkey to enter into the Singularity.'}
                            </p>
                        </div>

                        {/* Password Input Form */}
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                            <div className="relative w-full">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password..."
                                    disabled={isVerifying || isPasswordSuccess}
                                    autoFocus
                                    className={`w-full px-5 py-3.5 rounded-xl bg-zinc-900/90 text-center text-lg font-mono tracking-widest outline-none border transition-all ${isPasswordError
                                        ? 'border-red-500 text-red-300 placeholder-red-900/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                        : isPasswordSuccess
                                            ? 'border-white text-white placeholder-zinc-700 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                                            : 'border-zinc-700 text-white placeholder-zinc-600 focus:border-white focus:shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                                        }`}
                                />
                            </div>

                            {/* Action Buttons: Undo (Cancel) & Unlock and Enter */}
                            <div className="flex gap-4 w-full">
                                <button
                                    type="button"
                                    onClick={handleUndo}
                                    disabled={isVerifying || isPasswordSuccess}
                                    className="flex-1 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-700 active:scale-95 disabled:opacity-50"
                                >
                                    Undo
                                </button>
                                <button
                                    type="submit"
                                    disabled={isVerifying || !password.trim() || isPasswordSuccess}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${isPasswordSuccess
                                        ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                                        : isPasswordError
                                            ? 'bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]'
                                            : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {isVerifying ? 'Verifying...' : isPasswordSuccess ? 'Unlocking...' : 'Unlock & Enter'}
                                </button>
                            </div>
                        </form>

                        {/* Footer Status Hint */}
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                            <span>Default Key: birthday2026</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
