'use client';

import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { useExperienceStore } from '@/store/useExperienceStore';
import { SceneId } from '@/types/scene';
import { audioManager } from '@/lib/audio-manager';

export default function AmbientAudioManager() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const activeTrackRef = useRef<string | null>(null);

    const currentScene = useExperienceStore((state) => state.currentScene);
    const { isMuted, volume, setAutoplayBlocked, unlockAudio } = useAudioStore();

    // Determine target track based on active scene:
    // INTRO/SPACE -> Deep Space Black Hole Ambient
    // SOLAR_SYSTEM -> NO background music (null), only heartbeat & touch SFX
    const getTrackForScene = (scene: SceneId): string | null => {
        switch (scene) {
            case SceneId.INTRO:
            case SceneId.SPACE:
                return '/audio/ambient-space.mp3'; // Black Hole Space Ambient
            case SceneId.SOLAR_SYSTEM:
            default:
                return null; // NO background music in solar system
        }
    };

    useEffect(() => {
        // ALWAYS stop any Howl instances from legacy audioManager
        audioManager.stop('ambient-space');
        audioManager.stop('celebration-theme');

        const targetTrack = getTrackForScene(currentScene);

        // If target track is null (e.g. SOLAR_SYSTEM), stop & destroy HTML5 audio immediately
        if (!targetTrack) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
            activeTrackRef.current = null;
            return;
        }

        // If current HTML5 audio track is already playing target track, keep playing
        if (activeTrackRef.current === targetTrack && audioRef.current && !audioRef.current.paused) {
            return;
        }

        // IMMEDIATELY kill previous HTML5 audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        // Create new HTML5 audio for target scene track
        const newAudio = new Audio(targetTrack);
        newAudio.loop = true;
        newAudio.volume = isMuted ? 0 : volume * 0.4;
        audioRef.current = newAudio;
        activeTrackRef.current = targetTrack;

        // Attempt playback
        const playPromise = newAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.log('Autoplay blocked by browser policy:', err.message);
                setAutoplayBlocked(true);
            });
        }

        // Global gesture handler to unlock audio
        const handleFirstUserGesture = () => {
            unlockAudio();
            if (audioRef.current && audioRef.current.paused && !isMuted) {
                audioRef.current.play().catch(() => { });
            }
            window.removeEventListener('click', handleFirstUserGesture);
            window.removeEventListener('keydown', handleFirstUserGesture);
            window.removeEventListener('touchstart', handleFirstUserGesture);
        };

        window.addEventListener('click', handleFirstUserGesture);
        window.addEventListener('keydown', handleFirstUserGesture);
        window.addEventListener('touchstart', handleFirstUserGesture);

        return () => {
            window.removeEventListener('click', handleFirstUserGesture);
            window.removeEventListener('keydown', handleFirstUserGesture);
            window.removeEventListener('touchstart', handleFirstUserGesture);
        };
    }, [currentScene, isMuted, volume, setAutoplayBlocked, unlockAudio]);

    // Update volume dynamically
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = isMuted ? 0 : volume * 0.4;
    }, [isMuted, volume]);

    return null;
}
