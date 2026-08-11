'use client';

import React from 'react';
import CanvasLayout from './CanvasLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HolographicPassword from '@/components/ui/HolographicPassword';
import GameHUDOverlay from '@/components/ui/GameHUDOverlay';
import PlanetCard from '@/components/ui/PlanetCard';
import PlanetExperienceModal from '@/components/planet/PlanetExperienceModal';
import PlanetSurfaceHUD from '@/components/planet/PlanetSurfaceHUD';
import PlanetPuzzleModal from '@/components/planet/PlanetPuzzleModal';
import AmbientAudioManager from '@/components/audio/AmbientAudioManager';
import AudioControlHUD from '@/components/ui/AudioControlHUD';
import Day10RevealSequence from '@/components/reveal/Day10RevealSequence';
import HiddenUniverseRealm from '@/components/reveal/HiddenUniverseRealm';
import SolarSystemIntroModal from '@/components/ui/SolarSystemIntroModal';
import SolarSystemTimerHUD from '@/components/ui/SolarSystemTimerHUD';
import StoryBookRealm from '@/components/reveal/StoryBookRealm';
import { useUrlSync } from '@/hooks/useUrlSync';

interface ExperienceLayoutProps {
    children?: React.ReactNode;
}

export default function ExperienceLayout({ children }: ExperienceLayoutProps) {
    useUrlSync();
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-amber-400 selection:text-black">
            {/* Immersive Audio System */}
            <AmbientAudioManager />
            <AudioControlHUD />

            {/* Sci-Fi Game HUD Overlay for Singularity of Love & Universe Info */}
            <GameHUDOverlay />

            {/* Solar System Vault Lock Countdown & Heart Control HUD */}
            <SolarSystemTimerHUD />

            {/* Solar System Welcome & Unlocking Protocol Rules Modal */}
            <SolarSystemIntroModal />

            {/* Cinematic Day 10 Reveal Sequence Controller */}
            <Day10RevealSequence />
            <HiddenUniverseRealm />

            {/* 3D WebGL Canvas Layer */}
            <CanvasLayout />

            {/* Loading Screen Overlay */}
            <LoadingScreen />

            {/* Floating Holographic Password UI */}
            <HolographicPassword />

            {/* Fictional Planet Quick Info Card */}
            <PlanetCard />

            {/* Planet Surface View HUD Landing Experience */}
            <PlanetSurfaceHUD />

            {/* Planet Surface Heart Sun Puzzle & Gift Vault Modals */}
            <PlanetPuzzleModal />

            {/* Full Modular Reusable Planet Experience Modal Framework */}
            <PlanetExperienceModal />

            {/* 2D HUD / UI Overlay Layer */}
            <main className="relative z-10 w-full h-full pointer-events-none">
                {children}
            </main>
        </div>
    );
}
