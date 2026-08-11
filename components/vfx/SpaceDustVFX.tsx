'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

export default function SpaceDustVFX() {
    const pointsRef = useRef<THREE.Points>(null);
    const cfg = DEFAULT_VFX_CONFIG.spaceDust;

    const { positions, speeds } = useMemo(() => {
        const pos = new Float32Array(cfg.count * 3);
        const spd = new Float32Array(cfg.count);

        for (let i = 0; i < cfg.count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 160;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 160;
            spd[i] = 0.05 + Math.random() * 0.15;
        }

        return { positions: pos, speeds: spd };
    }, [cfg.count]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        const geo = pointsRef.current.geometry;
        const posAttr = geo.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < cfg.count; i++) {
            let y = posAttr.getY(i);
            y += delta * speeds[i];
            if (y > 60) y = -60;
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
        pointsRef.current.rotation.y += delta * 0.02;
    });

    if (!cfg.enabled) return null;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={cfg.size}
                color={cfg.color}
                transparent
                opacity={cfg.opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
