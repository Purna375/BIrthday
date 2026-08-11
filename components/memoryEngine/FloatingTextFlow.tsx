'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingTextFlow({ messages }: { messages: string[] }) {
    return (
        <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-slate-950/60 border border-white/10 p-6 flex flex-col justify-around">
            {messages.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [-10, -40, -70, -100] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        delay: i * 1.8,
                        ease: 'easeInOut',
                    }}
                    className="text-center font-serif text-lg md:text-xl text-amber-200 tracking-wide filter drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                >
                    ✨ {msg} ✨
                </motion.div>
            ))}
        </div>
    );
}
