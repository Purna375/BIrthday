'use client';

import React, { useState } from 'react';
import { useRevealStore } from '@/store/useRevealStore';
import CupidArcheryGame from './CupidArcheryGame';
import Day10PasswordGate from './Day10PasswordGate';
import Day10GrandHub from './Day10GrandHub';
import StoryBookRealm from './StoryBookRealm';

export default function HiddenUniverseRealm() {
    const phase = useRevealStore((state) => state.phase);
    const isDay10Unlocked = useRevealStore((state) => state.isDay10Unlocked);
    const whiteFlashOpacity = useRevealStore((state) => state.whiteFlashOpacity);

    const [stage, setStage] = useState<'archery' | 'password_gate' | 'grand_hub' | 'storybook'>(() => {
        return isDay10Unlocked ? 'grand_hub' : 'archery';
    });

    return (
        <>
            {/* Intense White Flash Screen Overlay during reveal transition */}
            {whiteFlashOpacity > 0 && (
                <div
                    className="fixed inset-0 z-50 pointer-events-none bg-white transition-opacity duration-75"
                    style={{ opacity: whiteFlashOpacity }}
                />
            )}

            {/* Day 10 Grand Finale Flow */}
            {phase === 'hidden_universe' && (
                <>
                    {stage === 'archery' && (
                        <CupidArcheryGame onComplete={() => setStage('password_gate')} />
                    )}

                    {stage === 'password_gate' && (
                        <Day10PasswordGate onUnlockSuccess={() => setStage('grand_hub')} />
                    )}

                    {stage === 'grand_hub' && (
                        <Day10GrandHub onOpenStoryBook={() => setStage('storybook')} />
                    )}

                    {stage === 'storybook' && (
                        <StoryBookRealm onClose={() => setStage('grand_hub')} />
                    )}
                </>
            )}
        </>
    );
}
