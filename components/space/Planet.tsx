'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetData } from '@/types/planet';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { isDayUnlocked } from '@/utils/progression';

// Common Vertex Shader
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 1. Earth-like Planet Shader (Aetheria)
const earthPlanetFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float landNoise = sin(vUv.x * 12.0 + sin(vUv.y * 10.0)) * cos(vUv.y * 14.0);
    vec3 oceanColor = vec3(0.08, 0.35, 0.75);
    vec3 landColor = vec3(0.18, 0.55, 0.28);
    vec3 iceColor = vec3(0.9, 0.95, 1.0);
    vec3 cloudColor = vec3(1.0, 1.0, 1.0);

    float isLand = smoothstep(-0.05, 0.05, landNoise);
    vec3 surface = mix(oceanColor, landColor, isLand);

    if (abs(vUv.y - 0.5) > 0.42) {
      surface = iceColor;
    }

    float clouds = sin(vUv.x * 25.0 + uTime * 0.4) * cos(vUv.y * 20.0 + uTime * 0.3);
    float cloudMask = smoothstep(0.3, 0.6, clouds);
    surface = mix(surface, cloudColor, cloudMask * 0.7);

    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.5);
    surface += vec3(0.2, 0.6, 1.0) * fresnel * 0.8;

    gl_FragColor = vec4(surface, 1.0);
  }
`;

// 2. Fiery Magma Lava Shader (Solaria)
const magmaPlanetFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float lavaNoise = sin(vUv.x * 22.0 + uTime * 1.5) * cos(vUv.y * 22.0 + uTime * 1.2);
    vec3 darkCrust = vec3(0.15, 0.05, 0.05);
    vec3 glowingLava = vec3(1.0, 0.25, 0.05);
    vec3 hotCore = vec3(1.0, 0.85, 0.2);

    float isLava = smoothstep(-0.1, 0.2, lavaNoise);
    vec3 surface = mix(darkCrust, glowingLava, isLava);

    if (lavaNoise > 0.3) {
      surface = mix(surface, hotCore, (lavaNoise - 0.3) * 2.5);
    }

    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.2);
    surface += vec3(1.0, 0.3, 0.1) * fresnel * 1.2;

    gl_FragColor = vec4(surface, 1.0);
  }
`;

// 3. Frozen Icy Glacier Shader (Zephyria)
const icePlanetFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float iceCrag = sin(vUv.x * 30.0) * cos(vUv.y * 30.0);
    vec3 deepIce = vec3(0.1, 0.45, 0.7);
    vec3 brightGlacier = vec3(0.7, 0.9, 1.0);

    vec3 surface = mix(deepIce, brightGlacier, smoothstep(-0.2, 0.3, iceCrag));

    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.0);
    surface += vec3(0.4, 0.8, 1.0) * fresnel * 1.5;

    gl_FragColor = vec4(surface, 1.0);
  }
`;

// 4. Gas Giant Multi-Band Shader (Celestia, Aura Nova, Astralia)
const gasBandFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAtmoColor;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float bands = sin(vUv.y * 40.0 + uTime * 0.4) * 0.5 + 0.5;
    float swirl = cos(vUv.x * 25.0 + vUv.y * 18.0) * 0.25;

    vec3 baseColor = uColor;
    vec3 bandColor = uColor * 1.45 + vec3(0.15);
    vec3 surface = mix(baseColor, bandColor, bands + swirl);

    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.4);
    surface = mix(surface, uAtmoColor * 1.8, fresnel);

    gl_FragColor = vec4(surface, 1.0);
  }
`;

export default function Planet({ data }: { data: PlanetData }) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const [isHovered, setIsHovered] = useState(false);

    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const setSelectedPlanetId = useExperienceStore((state) => state.setSelectedPlanetId);
    const { playHover, playTransition } = useAudioStore();

    const isUnlocked = isDayUnlocked(data.dayNumber);
    const isSelected = selectedPlanetId === data.id;
    const angleRef = useRef(Math.random() * Math.PI * 2);

    const uniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color(data.color) },
            uAtmoColor: { value: new THREE.Color(data.atmosphereColor) },
            uTime: { value: 0 },
        }),
        [data.color, data.atmosphereColor]
    );

    useFrame((state, delta) => {
        angleRef.current += delta * data.orbitSpeed;
        const x = Math.sin(angleRef.current) * data.orbitRadius;
        const z = Math.cos(angleRef.current) * data.orbitRadius;

        if (groupRef.current) {
            groupRef.current.position.set(x, 0, z);
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * data.rotationSpeed;
        }

        uniforms.uTime.value = state.clock.getElapsedTime();

        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 0.1;
        }
    });

    const handlePointerOver = (e: any) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (!isHovered) {
            playHover();
        }
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerOut = () => {
        setIsHovered(false);
        document.body.style.cursor = 'auto';
    };

    const handleClick = (e: any) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
        playTransition();
        setSelectedPlanetId(data.id);
    };

    const displaySize = data.size * 1.6;

    // Custom Shader Selection per Planet ID
    const renderPlanetMesh = () => {
        if (data.id === 'aetheria') {
            return (
                <shaderMaterial
                    vertexShader={planetVertexShader}
                    fragmentShader={earthPlanetFragmentShader}
                    uniforms={uniforms}
                />
            );
        }
        if (data.id === 'solaria') {
            return (
                <shaderMaterial
                    vertexShader={planetVertexShader}
                    fragmentShader={magmaPlanetFragmentShader}
                    uniforms={uniforms}
                />
            );
        }
        if (data.id === 'zephyria') {
            return (
                <shaderMaterial
                    vertexShader={planetVertexShader}
                    fragmentShader={icePlanetFragmentShader}
                    uniforms={uniforms}
                />
            );
        }
        if (data.hasRings || data.id === 'celestia' || data.id === 'aura-nova' || data.id === 'astralia') {
            return (
                <shaderMaterial
                    vertexShader={planetVertexShader}
                    fragmentShader={gasBandFragmentShader}
                    uniforms={uniforms}
                />
            );
        }
        return (
            <meshStandardMaterial
                color={data.color}
                roughness={0.25}
                metalness={0.35}
                emissive={data.atmosphereColor}
                emissiveIntensity={isHovered || isSelected ? 0.5 : 0.3}
            />
        );
    };

    return (
        <group ref={groupRef}>
            <group
                scale={isHovered ? displaySize * 1.15 : isSelected ? displaySize * 1.2 : displaySize}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
            >
                {/* Main Solid Planet Sphere with Full Realistic Shaded Texture */}
                <mesh ref={meshRef} castShadow receiveShadow>
                    <sphereGeometry args={[1, 64, 64]} />
                    {renderPlanetMesh()}
                </mesh>

                {/* Detailed Planetary Rings */}
                {data.hasRings && (
                    <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
                        <ringGeometry args={[1.35, 2.5, 64]} />
                        <meshStandardMaterial
                            color={data.ringColor || data.color}
                            side={THREE.DoubleSide}
                            transparent
                            opacity={0.85}
                            roughness={0.2}
                            emissive={data.ringColor || data.color}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                )}
            </group>
        </group>
    );
}
