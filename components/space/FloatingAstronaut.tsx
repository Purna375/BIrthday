'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FloatingAstronautProps {
    position?: [number, number, number];
    scale?: number;
}

export default function FloatingAstronaut({
    position = [0, -0.4, 2.6],
    scale = 0.38,
}: FloatingAstronautProps) {
    const groupRef = useRef<THREE.Group>(null);
    const astronautRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Natural weightless floating motion in center front
            groupRef.current.position.y = position[1] + Math.sin(time * 1.1) * 0.08;
            groupRef.current.position.x = position[0] + Math.cos(time * 0.7) * 0.04;
            groupRef.current.position.z = position[2] + Math.sin(time * 0.8) * 0.03;

            groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.04;
            groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
        }

        if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = 0.28 + Math.sin(time * 1.3) * 0.05;
            rightArmRef.current.rotation.z = -0.28 - Math.cos(time * 1.2) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <group ref={astronautRef}>
                {/* Helmet Base - White NASA Helmet */}
                <mesh position={[0, 1.35, 0]}>
                    <sphereGeometry args={[0.34, 32, 32]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
                </mesh>

                {/* Visor - Interstellar Gold Surface */}
                <mesh position={[0, 1.37, 0.15]} rotation={[0.1, 0, 0]}>
                    <sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                    <meshStandardMaterial
                        color="#d97706"
                        roughness={0.1}
                        metalness={0.9}
                        emissive="#b45309"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Soft Helmet Light */}
                <pointLight position={[0, 1.4, 0.5]} color="#fbbf24" intensity={0.6} distance={2.0} />

                {/* Torso Suit - Crisp White Fabric */}
                <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.32, 0.28, 0.85, 24]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.15} />
                </mesh>

                {/* Chest Pack */}
                <mesh position={[0, 0.75, 0.3]}>
                    <boxGeometry args={[0.28, 0.3, 0.1]} />
                    <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
                </mesh>

                {/* Status Indicator Lights */}
                <mesh position={[-0.08, 0.8, 0.36]}>
                    <sphereGeometry args={[0.025, 12, 12]} />
                    <meshBasicMaterial color="#38bdf8" />
                </mesh>
                <mesh position={[0, 0.8, 0.36]}>
                    <sphereGeometry args={[0.025, 12, 12]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>
                <mesh position={[0.08, 0.8, 0.36]}>
                    <sphereGeometry args={[0.025, 12, 12]} />
                    <meshBasicMaterial color="#f43f5e" />
                </mesh>

                {/* Backpack (PLSS) */}
                <mesh position={[0, 0.75, -0.3]}>
                    <boxGeometry args={[0.52, 0.8, 0.3]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
                </mesh>

                {/* Left Arm */}
                <group ref={leftArmRef} position={[-0.38, 0.9, 0]}>
                    <mesh position={[-0.15, -0.25, 0]} rotation={[0, 0, -0.4]}>
                        <capsuleGeometry args={[0.1, 0.42, 12, 24]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.35} />
                    </mesh>
                    <mesh position={[-0.34, -0.48, 0]}>
                        <sphereGeometry args={[0.09, 16, 16]} />
                        <meshStandardMaterial color="#0284c7" roughness={0.4} />
                    </mesh>
                </group>

                {/* Right Arm */}
                <group ref={rightArmRef} position={[0.38, 0.9, 0]}>
                    <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, 0.4]}>
                        <capsuleGeometry args={[0.1, 0.42, 12, 24]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.35} />
                    </mesh>
                    <mesh position={[0.34, -0.48, 0]}>
                        <sphereGeometry args={[0.09, 16, 16]} />
                        <meshStandardMaterial color="#0284c7" roughness={0.4} />
                    </mesh>
                </group>

                {/* Left Leg */}
                <mesh position={[-0.18, 0.05, 0]} rotation={[0.1, 0, -0.1]}>
                    <capsuleGeometry args={[0.12, 0.6, 12, 24]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.35} />
                </mesh>
                <mesh position={[-0.2, -0.38, 0.05]}>
                    <boxGeometry args={[0.16, 0.18, 0.3]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>

                {/* Right Leg */}
                <mesh position={[0.18, 0.05, 0]} rotation={[-0.1, 0, 0.1]}>
                    <capsuleGeometry args={[0.12, 0.6, 12, 24]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.35} />
                </mesh>
                <mesh position={[0.2, -0.38, -0.02]}>
                    <boxGeometry args={[0.16, 0.18, 0.3]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
            </group>
        </group>
    );
}
