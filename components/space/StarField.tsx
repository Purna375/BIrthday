'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface StarFieldProps {
    count?: number;
    radius?: number;
    minRadius?: number;
    minSize?: number;
    maxSize?: number;
    twinkleSpeed?: number;
    speed?: number;
}

const starVertexShader = `
  uniform float uTime;
  uniform float uTwinkleSpeed;
  attribute float aSize;
  attribute float aTwinkleSpeed;
  attribute float aTwinklePhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;

    float twinkle = sin(uTime * aTwinkleSpeed * uTwinkleSpeed + aTwinklePhase) * 0.5 + 0.5;
    vOpacity = 0.4 + 0.6 * twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function StarField({
    count = 7000,
    radius = 400,
    minRadius = 80,
    minSize = 1.0,
    maxSize = 3.5,
    twinkleSpeed = 1.5,
    speed = 0.02,
}: StarFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const { positions, sizes, twinkleSpeeds, twinklePhases, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sz = new Float32Array(count);
        const twSpd = new Float32Array(count);
        const twPhs = new Float32Array(count);
        const col = new Float32Array(count * 3);

        // Pure white star field palette
        const pureWhite = new THREE.Color('#ffffff');

        for (let i = 0; i < count; i++) {
            const r = minRadius + Math.random() * (radius - minRadius);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            sz[i] = minSize + Math.random() * (maxSize - minSize);
            twSpd[i] = 0.5 + Math.random() * 2.0;
            twPhs[i] = Math.random() * Math.PI * 2;

            col[i * 3] = pureWhite.r;
            col[i * 3 + 1] = pureWhite.g;
            col[i * 3 + 2] = pureWhite.b;
        }

        return {
            positions: pos,
            sizes: sz,
            twinkleSpeeds: twSpd,
            twinklePhases: twPhs,
            colors: col,
        };
    }, [count, radius, minRadius, minSize, maxSize]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uTwinkleSpeed: { value: twinkleSpeed },
        }),
        [twinkleSpeed]
    );

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * speed * 0.1;
            pointsRef.current.rotation.x += delta * speed * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
                <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeeds, 1]} />
                <bufferAttribute attach="attributes-aTwinklePhase" args={[twinklePhases, 1]} />
                <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={starVertexShader}
                fragmentShader={starFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
