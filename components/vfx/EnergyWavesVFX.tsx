'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

export default function EnergyWavesVFX() {
    const wave1Ref = useRef<THREE.Mesh>(null);
    const wave2Ref = useRef<THREE.Mesh>(null);
    const wave3Ref = useRef<THREE.Mesh>(null);

    const cfg = DEFAULT_VFX_CONFIG.energyWaves;

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * cfg.speed;

        const scale1 = ((time % 4) / 4) * cfg.radiusMax;
        const scale2 = (((time + 1.3) % 4) / 4) * cfg.radiusMax;
        const scale3 = (((time + 2.6) % 4) / 4) * cfg.radiusMax;

        if (wave1Ref.current) {
            wave1Ref.current.scale.set(scale1, scale1, scale1);
            (wave1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale1 / cfg.radiusMax);
        }
        if (wave2Ref.current) {
            wave2Ref.current.scale.set(scale2, scale2, scale2);
            (wave2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale2 / cfg.radiusMax);
        }
        if (wave3Ref.current) {
            wave3Ref.current.scale.set(scale3, scale3, scale3);
            (wave3Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale3 / cfg.radiusMax);
        }
    });

    if (!cfg.enabled) return null;

    return (
        <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh ref={wave1Ref}>
                <ringGeometry args={[0.95, 1.0, 64]} />
                <meshBasicMaterial
                    color={cfg.color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <mesh ref={wave2Ref}>
                <ringGeometry args={[0.95, 1.0, 64]} />
                <meshBasicMaterial
                    color="#ff8da1"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <mesh ref={wave3Ref}>
                <ringGeometry args={[0.95, 1.0, 64]} />
                <meshBasicMaterial
                    color="#38bdf8"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}
