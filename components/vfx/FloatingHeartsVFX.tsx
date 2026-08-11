'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

function createMiniHeartShape(): THREE.Shape {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.25);
    shape.bezierCurveTo(x, y + 0.5, x - 0.25, y + 0.75, x - 0.5, y + 0.75);
    shape.bezierCurveTo(x - 0.85, y + 0.75, x - 0.85, y + 0.4, x - 0.85, y + 0.4);
    shape.bezierCurveTo(x - 0.85, y + 0.1, x - 0.6, y - 0.25, x, y - 0.7);
    shape.bezierCurveTo(x + 0.6, y - 0.25, x + 0.85, y + 0.1, x + 0.85, y + 0.4);
    shape.bezierCurveTo(x + 0.85, y + 0.4, x + 0.85, y + 0.75, x + 0.5, y + 0.75);
    shape.bezierCurveTo(x + 0.25, y + 0.75, x, y + 0.5, x, y + 0.25);
    return shape;
}

export default function FloatingHeartsVFX() {
    const groupRef = useRef<THREE.Group>(null);
    const cfg = DEFAULT_VFX_CONFIG.floatingHearts;

    const heartGeo = useMemo(() => {
        const shape = createMiniHeartShape();
        const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 8 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return geo;
    }, []);

    const heartData = useMemo(() => {
        return Array.from({ length: cfg.count }).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 35,
                (Math.random() - 0.5) * 20 - 5,
                (Math.random() - 0.5) * 35
            ),
            speed: cfg.speed * (0.5 + Math.random() * 0.8),
            scale: 0.3 + Math.random() * 0.4,
            rotationSpeed: (Math.random() - 0.5) * 1.5,
        }));
    }, [cfg.count, cfg.speed]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, idx) => {
            const h = heartData[idx];
            h.position.y += delta * h.speed * 4;
            if (h.position.y > 25) {
                h.position.y = -15;
            }
            child.position.copy(h.position);
            child.rotation.y += delta * h.rotationSpeed;
        });
    });

    if (!cfg.enabled) return null;

    return (
        <group ref={groupRef}>
            {heartData.map((h, i) => (
                <mesh key={i} geometry={heartGeo} scale={h.scale}>
                    <meshStandardMaterial
                        color="#ff69b4"
                        emissive="#ff8da1"
                        emissiveIntensity={0.4}
                        roughness={0.2}
                        metalness={0.1}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}
