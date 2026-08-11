'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface GalaxyProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
    count?: number;
    radius?: number;
    branches?: number;
    spinSpeed?: number;
    randomness?: number;
    power?: number;
    innerColor?: string;
    outerColor?: string;
}

const galaxyVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (250.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function Galaxy({
    position = [60, 20, -120],
    rotation = [Math.PI * 0.2, 0, Math.PI * 0.1],
    scale = 1,
    count = 12000,
    radius = 40,
    branches = 4,
    spinSpeed = 0.08,
    randomness = 0.5,
    power = 3,
    innerColor = '#ffaa44', // Warm galaxy nucleus core
    outerColor = '#4488ff', // Cool spiral arm outer rim
}: GalaxyProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const { positions, colors, sizes } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const sz = new Float32Array(count);

        const colorInside = new THREE.Color(innerColor);
        const colorOutside = new THREE.Color(outerColor);

        for (let i = 0; i < count; i++) {
            // Position along galaxy radius
            const r = Math.random() * radius;

            // Spiral angle offset per arm
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;
            const spinAngle = r * 0.2;

            // Random jitter off spiral curve
            const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

            pos[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
            pos[i * 3 + 1] = randomY;
            pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

            // Color interpolation: core is innerColor, arms fade to outerColor
            const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
            col[i * 3] = mixedColor.r;
            col[i * 3 + 1] = mixedColor.g;
            col[i * 3 + 2] = mixedColor.b;

            // Larger size at dense core
            sz[i] = (1 - r / radius) * 2.5 + Math.random() * 1.5;
        }

        return {
            positions: pos,
            colors: col,
            sizes: sz,
        };
    }, [count, radius, branches, randomness, power, innerColor, outerColor]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    );

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * spinSpeed * 0.1;
        }
    });

    const parsedScale: [number, number, number] = typeof scale === 'number' ? [scale, scale, scale] : scale;

    return (
        <points ref={pointsRef} position={position} rotation={rotation} scale={parsedScale}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aColor"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={galaxyVertexShader}
                fragmentShader={galaxyFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
