'use client';

import React from 'react';
import HeartBlackHole from '@/components/space/HeartBlackHole';
import FloatingAstronaut from '@/components/space/FloatingAstronaut';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function SpaceScene() {
    const setPasswordModalOpen = useExperienceStore((state) => state.setPasswordModalOpen);

    return (
        <group name="space-scene">
            {/* Photorealistic Interstellar Gargantua Black Hole at Origin */}
            <HeartBlackHole
                position={[0, 0, 0]}
                scale={0.85}
                onSelect={() => {
                    setPasswordModalOpen(true);
                }}
            />

            {/* Astronaut Space Explorer Floating in Middle-Front (Matching Reference Image) */}
            <FloatingAstronaut position={[0, -0.15, 2.2]} scale={0.35} />
        </group>
    );
}
