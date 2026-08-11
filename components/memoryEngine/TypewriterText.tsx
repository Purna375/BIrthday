'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
    text: string;
    speed?: number; // ms per character
    onComplete?: () => void;
    className?: string;
}

export default function TypewriterText({
    text,
    speed = 35,
    onComplete,
    className = '',
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsDone(false);
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(timer);
                setIsDone(true);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <div className={`font-serif leading-relaxed text-white/90 ${className}`}>
            <span>{displayedText}</span>
            {!isDone && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block w-2 h-5 ml-1 bg-amber-400 align-middle shadow-[0_0_8px_#fbbf24]"
                />
            )}
        </div>
    );
}
