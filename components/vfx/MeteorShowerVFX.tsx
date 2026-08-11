'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

export default function MeteorShowerVFX() {
    const lineGroupRef = useRef<THREE.Group>(null);
    const cfg = DEFAULT_VFX_CONFIG.meteorShower;

    const meteors = useMemo(() => {
        return Array.from({ length: cfg.count }).map(() => ({
            startPos: new THREE.Vector3(
                (Math.random() - 0.5) * 200 + 40,
                Math.random() * 80 + 30,
                (Math.random() - 0.5) * 200
            ),
            length: 8 + Math.random() * 12,
            speed: cfg.speed * (1 + Math.random() * 0.5),
            progress: Math.random(),
        }));
    }, [cfg.count, cfg.speed]);

    useFrame((_, delta) => {
        if (!lineGroupRef.current) return;
        lineGroupRef.current.children.forEach((child, idx) => {
            const m = meteors[idx];
            m.progress += delta * m.speed * 0.25;
            if (m.progress > 1) {
                m.progress = 0;
                m.startPos.set(
                    (Math.random() - 0.5) * 200 + 40,
                    Math.random() * 80 + 30,
                    (Math.random() - 0.5) * 200
                );
            }

            const currentHead = m.startPos.clone().add(new THREE.Vector3(-m.progress * 80, -m.progress * 60, -m.progress * 40));
            const currentTail = currentHead.clone().add(new THREE.Vector3(m.length, m.length * 0.75, m.length * 0.5));

            const line = child as THREE.Line;
            const geo = line.geometry as THREE.BufferGeometry;
            const positions = new Float32Array([
                currentHead.x, currentHead.y, currentHead.z,
                currentTail.x, currentTail.y, currentTail.z,
            ]);
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        });
    });

    if (!cfg.enabled) return null;

    return (
        <group ref={lineGroupRef}>
            {meteors.map((_, i) => (
                <line key={i}>
                    <bufferGeometry />
                    <lineBasicMaterial
                        color={cfg.color}
                        transparent
                        opacity={0.75}
                        blending={THREE.AdditiveBlending}
                        linewidth={2}
                    />
                </line>
            ))}
        </group>
    );
}
