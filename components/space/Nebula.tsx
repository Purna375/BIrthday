'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface NebulaProps {
    position?: [number, number, number];
    scale?: number | [number, number, number];
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    density?: number;
    rotationSpeed?: number;
    count?: number;
}

const nebulaVertexShader = `
  uniform float uTime;
  attribute float aScale;
  attribute float aOpacity;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    vOpacity = aOpacity;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const nebulaFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    // Soft gaussian cloud puff particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Smooth volumetric falloff
    float alpha = exp(-dist * dist * 8.0) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function Nebula({
    position = [0, 0, -50],
    scale = 1,
    primaryColor = '#6366f1',   // Indigo/Purple core
    secondaryColor = '#ec4899', // Cyan/Pink atmospheric haze
    accentColor = '#38bdf8',    // Bright electric blue highlights
    density = 1.0,
    rotationSpeed = 0.015,
    count = 1500,
}: NebulaProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const totalPoints = Math.floor(count * density);

    const { positions, scales, opacities, colors } = useMemo(() => {
        const pos = new Float32Array(totalPoints * 3);
        const scl = new Float32Array(totalPoints);
        const opac = new Float32Array(totalPoints);
        const col = new Float32Array(totalPoints * 3);

        const color1 = new THREE.Color(primaryColor);
        const color2 = new THREE.Color(secondaryColor);
        const color3 = new THREE.Color(accentColor);

        for (let i = 0; i < totalPoints; i++) {
            // Gaussian distribution for cloud core density
            const u1 = Math.random();
            const u2 = Math.random();
            const radius = Math.sqrt(-2.0 * Math.log(u1)) * 40;
            const theta = 2.0 * Math.PI * u2;
            const phi = (Math.random() - 0.5) * Math.PI;

            pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
            pos[i * 3 + 1] = radius * Math.sin(phi);
            pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

            scl[i] = 12 + Math.random() * 28;
            opac[i] = 0.05 + Math.random() * 0.15;

            // Interpolate colors based on distance from nebula center
            const distRatio = Math.min(1, radius / 50);
            const lerpColor = new THREE.Color();

            if (distRatio < 0.4) {
                lerpColor.copy(color1).lerp(color3, distRatio / 0.4);
            } else {
                lerpColor.copy(color3).lerp(color2, (distRatio - 0.4) / 0.6);
            }

            col[i * 3] = lerpColor.r;
            col[i * 3 + 1] = lerpColor.g;
            col[i * 3 + 2] = lerpColor.b;
        }

        return {
            positions: pos,
            scales: scl,
            opacities: opac,
            colors: col,
        };
    }, [totalPoints, primaryColor, secondaryColor, accentColor]);

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
            pointsRef.current.rotation.z += delta * rotationSpeed * 0.05;
            pointsRef.current.rotation.y += delta * rotationSpeed * 0.08;
        }
    });

    const parsedScale: [number, number, number] = typeof scale === 'number' ? [scale, scale, scale] : scale;

    return (
        <points ref={pointsRef} position={position} scale={parsedScale}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    args={[scales, 1]}
                />
                <bufferAttribute
                    attach="attributes-aOpacity"
                    args={[opacities, 1]}
                />
                <bufferAttribute
                    attach="attributes-aColor"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={nebulaVertexShader}
                fragmentShader={nebulaFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
