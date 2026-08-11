'use client';

import React from 'react';
import * as THREE from 'three';

export default function OrbitRing({ radius, color = '#38bdf8' }: { radius: number; color?: string }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.38}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}
