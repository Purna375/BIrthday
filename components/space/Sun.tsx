'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const sunVertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const sunFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.8);

    // Dynamic solar flare noise calculation
    float flare = sin(vUv.x * 25.0 + uTime * 2.5) * cos(vUv.y * 25.0 + uTime * 2.0) * 0.5 + 0.5;

    vec3 coreColor = vec3(1.0, 0.65, 0.15); // Warm solar amber core
    vec3 flareColor = vec3(1.0, 0.35, 0.05); // Fiery orange solar flares
    vec3 coronaColor = vec3(1.0, 0.9, 0.5); // Golden corona

    vec3 color = mix(coreColor, flareColor, flare * 0.5);
    color = mix(color, coronaColor, fresnel);

    gl_FragColor = vec4(color * 1.25, 1.0);
  }
`;

export default function Sun({ size = 3.2 }: { size?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const coronaRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    );

    useFrame((state, delta) => {
        uniforms.uTime.value = state.clock.getElapsedTime();

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.06;
        }
        if (coronaRef.current) {
            coronaRef.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Central Solar Surface */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[size, 64, 64]} />
                <shaderMaterial
                    vertexShader={sunVertexShader}
                    fragmentShader={sunFragmentShader}
                    uniforms={uniforms}
                />
            </mesh>

            {/* Outer Solar Corona Atmosphere */}
            <mesh ref={coronaRef} scale={1.18}>
                <sphereGeometry args={[size, 32, 32]} />
                <shaderMaterial
                    vertexShader={sunVertexShader}
                    fragmentShader={sunFragmentShader}
                    uniforms={uniforms}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Solar Point Light casting realistic shadows */}
            <pointLight
                color="#fbbf24"
                intensity={3.0}
                distance={160}
                decay={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <ambientLight intensity={0.2} />
        </group>
    );
}
