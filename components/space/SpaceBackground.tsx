'use client';

import React from 'react';
import StarField from './StarField';
import DustParticles from './DustParticles';
import SpaceLighting from './SpaceLighting';
import CinematicCamera from './CinematicCamera';
import WarpSpeedEffect from './WarpSpeedEffect';

export interface SpaceBackgroundProps {
    enableStars?: boolean;
    enableDust?: boolean;
    enableCinematicCamera?: boolean;
}

export default function SpaceBackground({
    enableStars = true,
    enableDust = true,
    enableCinematicCamera = true,
}: SpaceBackgroundProps) {
    return (
        <group name="space-environment">
            {/* Space Lighting */}
            <SpaceLighting />

            {/* Cinematic Camera Controller */}
            {enableCinematicCamera && <CinematicCamera orbitRadius={8.0} orbitSpeed={0.08} />}

            {/* Warp Speed Hyper-Drive Light Streaks */}
            <WarpSpeedEffect />

            {/* Infinite Deep Space Star Fields - Clean realistic space background */}
            {enableStars && (
                <>
                    <StarField count={8000} radius={450} minSize={0.6} maxSize={2.2} twinkleSpeed={1.5} speed={0.01} />
                    <StarField count={3000} radius={250} minSize={1.2} maxSize={3.0} twinkleSpeed={2.0} speed={0.02} />
                </>
            )}

            {/* Ambient Floating Dust Particles */}
            {enableDust && <DustParticles count={400} bounds={[50, 50, 50]} size={0.06} speed={0.02} opacity={0.4} />}
        </group>
    );
}
