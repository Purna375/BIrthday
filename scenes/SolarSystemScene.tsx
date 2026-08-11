'use client';

import React from 'react';
import LivingHeartSun from '@/components/space/LivingHeartSun';
import Planet from '@/components/space/Planet';
import OrbitRing from '@/components/space/OrbitRing';
import AsteroidBelt from '@/components/space/AsteroidBelt';
import SolarSystemCamera from '@/components/space/SolarSystemCamera';
import StarField from '@/components/space/StarField';
import PlanetSurfaceScene from '@/components/planet/PlanetSurfaceScene';
import { PLANETS_DATA } from '@/constants/planets';
import { useExperienceStore } from '@/store/useExperienceStore';

// Advanced GPU-Optimized VFX System
import SpaceDustVFX from '@/components/vfx/SpaceDustVFX';
import MeteorShowerVFX from '@/components/vfx/MeteorShowerVFX';
import EnergyWavesVFX from '@/components/vfx/EnergyWavesVFX';
import FloatingHeartsVFX from '@/components/vfx/FloatingHeartsVFX';
import VolumetricFogVFX from '@/components/vfx/VolumetricFogVFX';

export default function SolarSystemScene() {
    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);

    if (planetViewMode === 'surface' && selectedPlanetId) {
        return <PlanetSurfaceScene planetId={selectedPlanetId} />;
    }

    return (
        <group name="solar-system-scene">
            {/* Volumetric Fog Effect */}
            <VolumetricFogVFX />

            {/* Interactive 3D OrbitControls Camera */}
            <SolarSystemCamera />

            {/* Faint, Minimal Deep Space Pure White Starfields (Drastically reduced count for clear planet identification) */}
            <StarField count={1200} radius={500} minRadius={120} minSize={0.5} maxSize={1.5} twinkleSpeed={1.2} />
            <StarField count={500} radius={300} minRadius={120} minSize={0.8} maxSize={1.8} twinkleSpeed={1.8} />

            {/* Advanced VFX System */}
            <SpaceDustVFX />
            <MeteorShowerVFX />
            <EnergyWavesVFX />
            <FloatingHeartsVFX />

            {/* Central Incandescent Solar Fire Heart Sun (Stationary) */}
            <LivingHeartSun size={2.5} />

            {/* Procedural 3D Asteroid Belt */}
            <AsteroidBelt count={1200} innerRadius={27} outerRadius={31} />

            {/* 9 Fictional Cosmic Planets & Orbit Pathways */}
            {PLANETS_DATA.map((planet) => (
                <React.Fragment key={planet.id}>
                    {/* Faint Orbital Pathway Ring */}
                    <OrbitRing radius={planet.orbitRadius} color={planet.atmosphereColor} />

                    {/* Interactive Realistic Planet with High Visibility */}
                    <Planet data={planet} />
                </React.Fragment>
            ))}
        </group>
    );
}
