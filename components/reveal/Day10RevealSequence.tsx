'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRevealStore } from '@/store/useRevealStore';
import { useAudioStore } from '@/store/useAudioStore';

export default function Day10RevealSequence() {
    const {
        isDay10Revealing,
        setPhase,
        setHeartBeatRate,
        setHeartOpenAmount,
        setSolarSystemGlow,
        setPlanetsAligned,
        setWhiteFlashOpacity,
    } = useRevealStore();

    const { playTransition } = useAudioStore();
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!isDay10Revealing) return;

        // Build Master GSAP Cinematic Timeline
        const tl = gsap.timeline({
            onComplete: () => {
                setPhase('hidden_universe');
            },
        });

        timelineRef.current = tl;

        // Phase 1: Heartbeats Faster & System Glow (0s -> 3s)
        tl.to({}, {
            duration: 3,
            onStart: () => {
                setPhase('accelerating_heartbeat');
                playTransition();
            },
            onUpdate: function () {
                const progress = this.progress();
                setHeartBeatRate(1.0 + progress * 9.0); // 1x to 10x
                setSolarSystemGlow(progress);
            },
        });

        // Phase 2: Planets Align in Straight Line (3s -> 6s)
        tl.to({}, {
            duration: 3,
            onStart: () => {
                setPhase('aligning_planets');
                setPlanetsAligned(true);
            },
            onUpdate: function () {
                const progress = this.progress();
                setSolarSystemGlow(1.0 + progress * 0.5);
            },
        });

        // Phase 3: Heart Slowly Opens & Energy Portal (6s -> 8.5s)
        tl.to({}, {
            duration: 2.5,
            onStart: () => {
                setPhase('opening_heart');
            },
            onUpdate: function () {
                const progress = this.progress();
                setHeartOpenAmount(progress);
            },
        });

        // Phase 4: Camera Dives into Heart Core (8.5s -> 10.5s)
        tl.to({}, {
            duration: 2.0,
            onStart: () => {
                setPhase('camera_diving');
            },
        });

        // Phase 5: Intense White Flash & Hidden Universe Reveal (10.5s -> 12s)
        tl.to({}, {
            duration: 1.5,
            onStart: () => {
                setPhase('white_flash');
            },
            onUpdate: function () {
                const progress = this.progress();
                setWhiteFlashOpacity(progress > 0.6 ? 1.0 - (progress - 0.6) * 2.5 : progress * 1.6);
            },
        });

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [
        isDay10Revealing,
        setPhase,
        setHeartBeatRate,
        setHeartOpenAmount,
        setSolarSystemGlow,
        setPlanetsAligned,
        setWhiteFlashOpacity,
        playTransition,
    ]);

    return null;
}
