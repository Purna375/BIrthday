'use client';

import React, { useState, useEffect } from 'react';
import { useAudioStore } from '@/store/useAudioStore';

interface TypewriterTextProps {
    text: string;
    speed?: number; // ms per character
    className?: string;
    onComplete?: () => void;
    enableSound?: boolean;
}

export default function TypewriterText({
    text,
    speed = 100, // Deliberate, comfortable RPG typing speed
    className = '',
    onComplete,
    enableSound = true,
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const { playTypewriterClick } = useAudioStore();

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                const char = text.charAt(currentIndex);
                setDisplayedText((prev) => prev + char);

                // Play click audio for non-whitespace characters
                if (enableSound && char.trim() !== '') {
                    playTypewriterClick();
                }

                currentIndex++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, enableSound, playTypewriterClick, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {!isComplete && (
                <span className="inline-block w-2.5 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
            )}
        </span>
    );
}
