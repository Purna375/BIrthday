'use client';

import React from 'react';

export interface SpaceLightingProps {
    ambientIntensity?: number;
    ambientColor?: string;
    keyLightColor?: string;
    keyLightIntensity?: number;
    keyLightPosition?: [number, number, number];
    fillLightColor?: string;
    fillLightIntensity?: number;
    fillLightPosition?: [number, number, number];
    rimLightColor?: string;
    rimLightIntensity?: number;
    rimLightPosition?: [number, number, number];
}

export default function SpaceLighting({
    ambientIntensity = 0.2,
    ambientColor = '#0f172a',
    keyLightColor = '#fbbf24',    // Warm golden starlight key light
    keyLightIntensity = 1.5,
    keyLightPosition = [20, 30, 20],
    fillLightColor = '#38bdf8',   // Soft cyan cosmic fill light
    fillLightIntensity = 0.8,
    fillLightPosition = [-20, -10, -20],
    rimLightColor = '#ec4899',    // Deep magenta rim highlight
    rimLightIntensity = 1.0,
    rimLightPosition = [0, 20, -40],
}: SpaceLightingProps) {
    return (
        <group>
            {/* Deep space ambient base */}
            <ambientLight color={ambientColor} intensity={ambientIntensity} />

            {/* Main key directional light */}
            <directionalLight
                color={keyLightColor}
                intensity={keyLightIntensity}
                position={keyLightPosition}
            />

            {/* Secondary fill light */}
            <pointLight
                color={fillLightColor}
                intensity={fillLightIntensity}
                position={fillLightPosition}
                distance={200}
                decay={2}
            />

            {/* Deep space rim light */}
            <pointLight
                color={rimLightColor}
                intensity={rimLightIntensity}
                position={rimLightPosition}
                distance={300}
                decay={2}
            />
        </group>
    );
}
