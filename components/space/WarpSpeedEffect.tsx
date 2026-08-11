'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/store/useExperienceStore';

const warpVertexShader = `
  uniform float uWarpProgress;
  uniform float uTime;
  attribute float aLength;
  attribute float aSpeed;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec3 pos = position;

    // Move particles along Z axis fast during warp
    float zOffset = mod(pos.z + uTime * aSpeed * (1.0 + uWarpProgress * 40.0), 120.0) - 60.0;
    pos.z = zOffset;

    // Stretch particles proportionally to warp factor
    float stretch = 1.0 + uWarpProgress * aLength * 80.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.5 + uWarpProgress * 3.5) * (200.0 / -mvPosition.z);

    // Alpha intensity based on warp progress
    vAlpha = smoothstep(0.05, 0.95, uWarpProgress);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const warpFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function WarpSpeedEffect() {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const warpProgress = useExperienceStore((state) => state.warpProgress);

    const count = 2500;
    const { positions, lengths, speeds, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const len = new Float32Array(count);
        const spd = new Float32Array(count);
        const col = new Float32Array(count * 3);

        const palette = [
            new THREE.Color('#38bdf8'), // Electric cyan
            new THREE.Color('#c084fc'), // Neon purple
            new THREE.Color('#ffffff'), // Starlight white
            new THREE.Color('#f43f5e'), // Magenta highlight
        ];

        for (let i = 0; i < count; i++) {
            // Cylinder distribution surrounding camera path
            const radius = 1.5 + Math.random() * 25.0;
            const angle = Math.random() * Math.PI * 2;
            const z = (Math.random() - 0.5) * 120;

            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = Math.sin(angle) * radius;
            pos[i * 3 + 2] = z;

            len[i] = 0.5 + Math.random() * 2.5;
            spd[i] = 2.0 + Math.random() * 8.0;

            const color = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }

        return { positions: pos, lengths: len, speeds: spd, colors: col };
    }, [count]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uWarpProgress: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            materialRef.current.uniforms.uWarpProgress.value = warpProgress;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aLength" args={[lengths, 1]} />
                <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
                <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={warpVertexShader}
                fragmentShader={warpFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
