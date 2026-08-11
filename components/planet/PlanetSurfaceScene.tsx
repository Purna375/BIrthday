'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS_DATA } from '@/constants/planets';
import LivingHeartSun from '@/components/space/LivingHeartSun';
import FloatingHeartsVFX from '@/components/vfx/FloatingHeartsVFX';
import SpaceDustVFX from '@/components/vfx/SpaceDustVFX';
import { PlanetData } from '@/types/planet';

// Custom Shaders for Planet Surface Terrain
const terrainVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Wave landscape displacement
    float elevation = sin(pos.x * 0.08) * cos(pos.y * 0.08) * 3.5;
    elevation += sin(pos.x * 0.18 + pos.y * 0.12) * 1.5;
    pos.z += elevation;

    vElevation = elevation;
    vPosition = pos;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAtmoColor;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vElevation;

  void main() {
    vec3 baseColor = uColor * 0.35;
    vec3 accentColor = uAtmoColor;
    
    // Grid pattern on surface for sci-fi vault look
    float gridX = abs(sin(vPosition.x * 0.5));
    float gridY = abs(sin(vPosition.y * 0.5));
    float gridLine = smoothstep(0.96, 1.0, max(gridX, gridY));

    // Elevation glow mix
    float elevNorm = smoothstep(-4.0, 5.0, vElevation);
    vec3 surfaceColor = mix(baseColor, accentColor * 0.8, elevNorm);

    // Add glowing energy veins
    float veinNoise = sin(vPosition.x * 0.1 + uTime * 0.5) * cos(vPosition.y * 0.1 + uTime * 0.4);
    if (veinNoise > 0.4) {
      surfaceColor += accentColor * (veinNoise - 0.4) * 1.5;
    }

    surfaceColor = mix(surfaceColor, accentColor * 1.8, gridLine * 0.4);

    // Fresnel edge lighting from atmospheric horizon
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.0);
    surfaceColor += uAtmoColor * fresnel * 0.5;

    gl_FragColor = vec4(surfaceColor, 1.0);
  }
`;

// Sky Dome Shader for Atmospheric Sky Gradient
const skyDomeVertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyDomeFragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform float uExponent;

  varying vec3 vWorldPosition;

  void main() {
    float h = normalize(vWorldPosition).y;
    float factor = max(0.0, pow(max(0.0, h), uExponent));
    vec3 skyColor = mix(uBottomColor, uTopColor, factor);
    gl_FragColor = vec4(skyColor, 1.0);
  }
`;

import { useExperienceStore } from '@/store/useExperienceStore';

interface PlanetSurfaceSceneProps {
    planetId: string;
}

export default function PlanetSurfaceScene({ planetId }: PlanetSurfaceSceneProps) {
    const planet = useMemo(
        () => PLANETS_DATA.find((p) => p.id === planetId) || PLANETS_DATA[0],
        [planetId]
    );

    const isSupernovaBlasting = useExperienceStore((state) => state.isSupernovaBlasting);

    const controlsRef = useRef<OrbitControlsImpl>(null);
    const terrainRef = useRef<THREE.Mesh>(null);
    const heartSunGroupRef = useRef<THREE.Group>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();

    // Terrain Uniforms
    const terrainUniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color(planet.color) },
            uAtmoColor: { value: new THREE.Color(planet.atmosphereColor) },
            uTime: { value: 0 },
        }),
        [planet.color, planet.atmosphereColor]
    );

    // Sky Dome Uniforms
    const skyUniforms = useMemo(
        () => ({
            uTopColor: { value: new THREE.Color('#030712') },
            uBottomColor: { value: new THREE.Color(planet.atmosphereColor).multiplyScalar(0.7) },
            uExponent: { value: 0.6 },
        }),
        [planet.atmosphereColor]
    );

    // Adjust initial surface camera placement to frame the Heart Sun and landscape ground perfectly
    useEffect(() => {
        if (camera) {
            camera.position.set(0, 6, 28);
            camera.lookAt(0, 16, -60);
        }
        if (controlsRef.current) {
            controlsRef.current.target.set(0, 16, -60);
            controlsRef.current.update();
        }
    }, [camera]);

    useFrame((state, delta) => {
        terrainUniforms.uTime.value = state.clock.getElapsedTime();

        // Gentle camera floating on surface
        if (controlsRef.current) {
            const time = state.clock.getElapsedTime();
            controlsRef.current.target.y = 16 + Math.sin(time * 0.8) * 0.3;
            controlsRef.current.update();
        }

        // Supernova Blast 3D Animation & Expansion Loop
        if (heartSunGroupRef.current) {
            const targetScale = isSupernovaBlasting ? 4.8 : 1.8;
            heartSunGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
            if (isSupernovaBlasting) {
                heartSunGroupRef.current.rotation.y += delta * 5.0;
            }
        }

        // Shockwave expansion animation
        if (shockwaveRef.current) {
            if (isSupernovaBlasting) {
                shockwaveRef.current.visible = true;
                const scale = (shockwaveRef.current.scale.x + delta * 25) % 35;
                shockwaveRef.current.scale.set(scale, scale, scale);
                const mat = shockwaveRef.current.material as THREE.MeshStandardMaterial;
                if (mat) mat.opacity = Math.max(0, 1 - scale / 35);
            } else {
                shockwaveRef.current.visible = false;
                shockwaveRef.current.scale.set(1, 1, 1);
            }
        }
    });

    return (
        <group name="planet-surface-scene">
            {/* Surface Atmospheric Fog */}
            <fog attach="fog" args={[planet.atmosphereColor, 20, 180]} />

            {/* Surface Interactive Orbit Controls */}
            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.7}
                minDistance={5}
                maxDistance={70}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2 - 0.02}
                target={[0, 16, -60]}
                makeDefault
            />

            {/* Atmospheric Sky Dome */}
            <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
                <sphereGeometry args={[180, 32, 32]} />
                <shaderMaterial
                    vertexShader={skyDomeVertexShader}
                    fragmentShader={skyDomeFragmentShader}
                    uniforms={skyUniforms}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 3D Radiant Heart Sun Floating in Planet's Sky overhead - Supernova Blasting Capable */}
            <group ref={heartSunGroupRef} position={[0, 22, -75]} scale={1.8}>
                <LivingHeartSun size={2.5} />
            </group>

            {/* Shockwave Blast Ring VFX */}
            <mesh ref={shockwaveRef} position={[0, 22, -74]} visible={false}>
                <ringGeometry args={[1.5, 3.5, 64]} />
                <meshStandardMaterial
                    color="#fef08a"
                    emissive="#f59e0b"
                    emissiveIntensity={10.0}
                    transparent
                    opacity={0.9}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Surface Ground Terrain */}
            <mesh
                ref={terrainRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -2, 0]}
                receiveShadow
            >
                <planeGeometry args={[260, 260, 128, 128]} />
                <shaderMaterial
                    vertexShader={terrainVertexShader}
                    fragmentShader={terrainFragmentShader}
                    uniforms={terrainUniforms}
                    wireframe={false}
                />
            </mesh>

            {/* Saturn Rings Overhead if planet has rings (e.g. Astralia) */}
            {planet.hasRings && (
                <mesh position={[0, 45, -60]} rotation={[1.1, 0.4, 0.2]}>
                    <ringGeometry args={[40, 75, 64]} />
                    <meshStandardMaterial
                        color={planet.ringColor || planet.color}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.65}
                        emissive={planet.ringColor || planet.color}
                        emissiveIntensity={0.4}
                    />
                </mesh>
            )}

            {/* Floating Sparkles & Heart Embers Drifting Across the Surface Atmosphere */}
            <FloatingHeartsVFX />
            <SpaceDustVFX />

            {/* Surface Ambient & Directional Lighting originating from the Heart Sun */}
            <ambientLight color={planet.atmosphereColor} intensity={isSupernovaBlasting ? 3.0 : 0.7} />
            <directionalLight position={[0, 35, -75]} color="#fff3cc" intensity={isSupernovaBlasting ? 8.0 : 3.0} castShadow />
            <pointLight position={[0, 22, -70]} color={planet.color} intensity={isSupernovaBlasting ? 80.0 : 25.0} distance={250} />
        </group>
    );
}
