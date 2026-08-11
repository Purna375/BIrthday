'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FloatingCameraProps {
    floatSpeed?: number;
    floatIntensity?: number;
    rotationIntensity?: number;
}

export default function FloatingCamera({
    floatSpeed = 0.5,
    floatIntensity = 0.8,
    rotationIntensity = 0.2,
}: FloatingCameraProps) {
    const initialPos = useRef<THREE.Vector3 | null>(null);
    const initialRot = useRef<THREE.Euler | null>(null);

    useFrame((state) => {
        const { camera, clock } = state;
        const t = clock.getElapsedTime() * floatSpeed;

        if (!initialPos.current) {
            initialPos.current = camera.position.clone();
            initialRot.current = camera.rotation.clone();
        }

        // Lissajous smooth floating drift offset
        const offsetX = Math.sin(t * 0.7) * floatIntensity;
        const offsetY = Math.cos(t * 0.5) * floatIntensity * 0.8;
        const offsetZ = Math.sin(t * 0.3) * floatIntensity * 0.5;

        camera.position.x = initialPos.current.x + offsetX;
        camera.position.y = initialPos.current.y + offsetY;
        camera.position.z = initialPos.current.z + offsetZ;

        // Gentle rotational roll & pitch drift
        if (initialRot.current) {
            camera.rotation.z = initialRot.current.z + Math.sin(t * 0.4) * 0.02 * rotationIntensity;
            camera.rotation.x = initialRot.current.x + Math.cos(t * 0.6) * 0.015 * rotationIntensity;
        }
    });

    return null;
}
