'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioStore } from '@/store/useAudioStore';
import { useRevealStore } from '@/store/useRevealStore';
import { useExperienceStore } from '@/store/useExperienceStore';

// Sculpt Left Half of the 3D Heart Geometry (Split cleanly at x = 0)
function createLeftHeartHalfGeometry(): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const x = 0, y = 0;

    shape.moveTo(x, y + 0.5);
    shape.bezierCurveTo(x, y + 0.95, x - 0.45, y + 1.45, x - 1.05, y + 1.45);
    shape.bezierCurveTo(x - 1.7, y + 1.45, x - 1.7, y + 0.8, x - 1.7, y + 0.8);
    shape.bezierCurveTo(x - 1.7, y + 0.2, x - 1.2, y - 0.45, x, y - 1.4);
    shape.lineTo(x, y + 0.5);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.6,
        bevelEnabled: true,
        bevelSegments: 32,
        steps: 4,
        bevelSize: 0.45,
        bevelThickness: 0.45,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.translate(0, 0, -0.3);
    geometry.computeVertexNormals();
    return geometry;
}

// Sculpt Right Half of the 3D Heart Geometry (Split cleanly at x = 0)
function createRightHeartHalfGeometry(): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const x = 0, y = 0;

    shape.moveTo(x, y + 0.5);
    shape.bezierCurveTo(x, y + 0.95, x + 0.45, y + 1.45, x + 1.05, y + 1.45);
    shape.bezierCurveTo(x + 1.7, y + 1.45, x + 1.7, y + 0.8, x + 1.7, y + 0.8);
    shape.bezierCurveTo(x + 1.7, y + 0.2, x + 1.2, y - 0.45, x, y - 1.4);
    shape.lineTo(x, y + 0.5);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.6,
        bevelEnabled: true,
        bevelSegments: 32,
        steps: 4,
        bevelSize: 0.45,
        bevelThickness: 0.45,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.translate(0, 0, -0.3);
    geometry.computeVertexNormals();
    return geometry;
}

// Complete Whole Corona Shell Geometry
function createHeartSunGeometry(): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const x = 0, y = 0;

    shape.moveTo(x, y + 0.5);
    shape.bezierCurveTo(x, y + 0.95, x - 0.45, y + 1.45, x - 1.05, y + 1.45);
    shape.bezierCurveTo(x - 1.7, y + 1.45, x - 1.7, y + 0.8, x - 1.7, y + 0.8);
    shape.bezierCurveTo(x - 1.7, y + 0.2, x - 1.2, y - 0.45, x, y - 1.4);
    shape.bezierCurveTo(x + 1.2, y - 0.45, x + 1.7, y + 0.2, x + 1.7, y + 0.8);
    shape.bezierCurveTo(x + 1.7, y + 0.8, x + 1.7, y + 1.45, x + 1.05, y + 1.45);
    shape.bezierCurveTo(x + 0.45, y + 1.45, x, y + 0.95, x, y + 0.5);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.6,
        bevelEnabled: true,
        bevelSegments: 32,
        steps: 4,
        bevelSize: 0.45,
        bevelThickness: 0.45,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();

    return geometry;
}

export default function LivingHeartSun({ size = 3.8 }: { size?: number }) {
    const heartGroupRef = useRef<THREE.Group>(null);
    const leftHalfRef = useRef<THREE.Mesh>(null);
    const rightHalfRef = useRef<THREE.Mesh>(null);
    const coreOrbRef = useRef<THREE.Mesh>(null);
    const solarLightRef = useRef<THREE.PointLight>(null);
    const corePortalLightRef = useRef<THREE.PointLight>(null);
    const sparkPointsRef = useRef<THREE.Points>(null);
    const coronaMeshRef = useRef<THREE.Mesh>(null);

    const lastBeatRef = useRef<number>(0);
    const currentOpenRef = useRef<number>(0);

    const { playHeartbeat } = useAudioStore();
    const { heartBeatRate, heartOpenAmount, setHeartOpenAmount, solarSystemGlow, phase, isDay10Revealing, showHeartWarningToast, triggerDay10Reveal } = useRevealStore();
    const activePuzzlePlanetId = useExperienceStore((state) => state.activePuzzlePlanetId);
    const unlockedVaultGift = useExperienceStore((state) => state.unlockedVaultGift);
    const currentScene = useExperienceStore((state) => state.currentScene);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const isMuted = useExperienceStore((state) => state.isMuted);
    const solvedPlanetIds = useExperienceStore((state) => state.solvedPlanetIds);

    const leftGeo = useMemo(() => createLeftHeartHalfGeometry(), []);
    const rightGeo = useMemo(() => createRightHeartHalfGeometry(), []);
    const coronaGeo = useMemo(() => createHeartSunGeometry(), []);

    // Solar flare spark particles
    const sparkCount = 220;
    const { sparkPositions } = useMemo(() => {
        const pos = new Float32Array(sparkCount * 3);
        for (let i = 0; i < sparkCount; i++) {
            const radius = 1.0 + Math.random() * 3.5;
            const angle = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;

            pos[i * 3] = radius * Math.cos(phi) * Math.cos(angle);
            pos[i * 3 + 1] = radius * Math.sin(phi);
            pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(angle);
        }
        return { sparkPositions: pos };
    }, [sparkCount]);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        // Smooth Lerp for Heart Opening Animation
        currentOpenRef.current = THREE.MathUtils.lerp(
            currentOpenRef.current,
            heartOpenAmount,
            delta * 3.0
        );

        // Natural calm heartbeat pulse rhythm (~60 BPM)
        const beatInterval = 1.25 / Math.max(0.8, heartBeatRate);

        const isViewingGiftOrPuzzle =
            activePuzzlePlanetId !== null ||
            unlockedVaultGift !== null ||
            currentScene !== 'SOLAR_SYSTEM' ||
            planetViewMode === 'surface' ||
            isDay10Revealing ||
            phase !== 'idle';

        if (time - lastBeatRef.current >= beatInterval) {
            lastBeatRef.current = time;
            if (!isViewingGiftOrPuzzle && !isMuted) {
                playHeartbeat();
            }
        }

        const pulsePhase = ((time - lastBeatRef.current) / beatInterval) * Math.PI * 2;
        const smoothCycle = Math.sin(pulsePhase) * 0.5 + 0.5;
        const beatScale = 1.0 + Math.pow(smoothCycle, 3.0) * 0.15;

        if (heartGroupRef.current) {
            heartGroupRef.current.scale.setScalar(size * beatScale);
            heartGroupRef.current.rotation.set(0, 0, 0);
        }

        if (coronaMeshRef.current) {
            coronaMeshRef.current.rotation.set(0, 0, 0);
            coronaMeshRef.current.scale.setScalar(1.15 + currentOpenRef.current * 0.3);
        }

        // Heart opening animation sideways (Left half slides left, Right half slides right)
        if (leftHalfRef.current && rightHalfRef.current) {
            leftHalfRef.current.position.x = -currentOpenRef.current * 1.6;
            rightHalfRef.current.position.x = currentOpenRef.current * 1.6;
        }

        // Core Glowing Portal Orb inside
        if (coreOrbRef.current) {
            const orbScale = currentOpenRef.current * 1.2;
            coreOrbRef.current.scale.setScalar(orbScale);
            coreOrbRef.current.rotation.y += delta * 1.5;
        }

        // Dynamic Solar Light Intensity
        if (solarLightRef.current) {
            solarLightRef.current.intensity = 25.0 + smoothCycle * 15.0 + solarSystemGlow * 50.0;
        }

        if (corePortalLightRef.current) {
            corePortalLightRef.current.intensity = currentOpenRef.current * 120.0;
        }

        if (sparkPointsRef.current) {
            sparkPointsRef.current.rotation.y += delta * (0.1 + solarSystemGlow * 0.2);
        }
    });

    const handleToggleOpen = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        if (solvedPlanetIds.length < 9) {
            showHeartWarningToast('You need to collect all the keys before entering into the heart.');
            return;
        }
        const nextState = heartOpenAmount > 0 ? 0.0 : 1.0;
        setHeartOpenAmount(nextState);
        if (nextState > 0) {
            triggerDay10Reveal();
        }
    };

    return (
        <group position={[0, 0, 0]}>
            {/* 3D Incandescent Solar Fire Heart Group (Stationary, Interactive Click to Open/Close) */}
            <group
                ref={heartGroupRef}
                onClick={handleToggleOpen}
                onPointerOver={() => (document.body.style.cursor = 'pointer')}
                onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
                {/* Left Half Mesh */}
                <mesh ref={leftHalfRef} geometry={leftGeo}>
                    <meshStandardMaterial
                        color="#ff9900"
                        roughness={0.1}
                        metalness={0.1}
                        emissive="#ff5500"
                        emissiveIntensity={3.2 + solarSystemGlow * 1.5}
                        toneMapped={false}
                    />
                </mesh>

                {/* Right Half Mesh */}
                <mesh ref={rightHalfRef} geometry={rightGeo}>
                    <meshStandardMaterial
                        color="#ff9900"
                        roughness={0.1}
                        metalness={0.1}
                        emissive="#ff5500"
                        emissiveIntensity={3.2 + solarSystemGlow * 1.5}
                        toneMapped={false}
                    />
                </mesh>

                {/* Internal Blinding Core Portal Orb (Revealed when split) */}
                <mesh ref={coreOrbRef} position={[0, 0, 0]}>
                    <sphereGeometry args={[0.9, 32, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        toneMapped={false}
                    />
                </mesh>

                {/* Outer Solar Corona Glow Shell */}
                <mesh ref={coronaMeshRef} geometry={coronaGeo}>
                    <meshBasicMaterial
                        color="#ffaa00"
                        transparent
                        opacity={0.35}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            </group>

            {/* Internal Core Portal Light */}
            <pointLight ref={corePortalLightRef} color="#ffffff" intensity={0} distance={150} />

            {/* Solar Flare Radiating Sparkles */}
            <points ref={sparkPointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08 + solarSystemGlow * 0.05}
                    color="#ffea00"
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Sunlight Sources illuminating all surrounding planets */}
            <directionalLight position={[0, 10, 0]} color="#fff3cc" intensity={2.5} />
            <pointLight
                ref={solarLightRef}
                color="#ffaa00"
                intensity={35.0}
                distance={450}
                decay={1.0}
            />
            <ambientLight color="#fff0d4" intensity={0.6 + solarSystemGlow * 0.5} />
        </group>
    );
}
