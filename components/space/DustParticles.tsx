'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DustParticlesProps {
    count?: number;
    bounds?: [number, number, number];
    size?: number;
    speed?: number;
    color?: string;
    opacity?: number;
}

export default function DustParticles({
    count = 500,
    bounds = [40, 40, 40],
    size = 0.08,
    speed = 0.05,
    color = '#ffffff',
    opacity = 0.6,
}: DustParticlesProps) {
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);

        const [bx, by, bz] = bounds;

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * bx;
            pos[i * 3 + 1] = (Math.random() - 0.5) * by;
            pos[i * 3 + 2] = (Math.random() - 0.5) * bz;

            vel[i * 3] = (Math.random() - 0.5) * 0.02 * speed;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02 * speed;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02 * speed;
        }

        return { positions: pos, velocities: vel };
    }, [count, bounds, speed]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const positionAttribute = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const array = positionAttribute.array as Float32Array;
        const [bx, by, bz] = bounds;
        const halfX = bx / 2;
        const halfY = by / 2;
        const halfZ = bz / 2;

        for (let i = 0; i < count; i++) {
            let x = array[i * 3] + velocities[i * 3] * delta * 60;
            let y = array[i * 3 + 1] + velocities[i * 3 + 1] * delta * 60;
            let z = array[i * 3 + 2] + velocities[i * 3 + 2] * delta * 60;

            // Wrap around bounds for continuous floating illusion
            if (x > halfX) x = -halfX;
            if (x < -halfX) x = halfX;
            if (y > halfY) y = -halfY;
            if (y < -halfY) y = halfY;
            if (z > halfZ) z = -halfZ;
            if (z < -halfZ) z = halfZ;

            array[i * 3] = x;
            array[i * 3 + 1] = y;
            array[i * 3 + 2] = z;
        }

        positionAttribute.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                transparent
                opacity={opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
