'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingObject({
    modelType = 'heart',
    color = '#ff69b4',
    rotateSpeed = 1.0,
}: {
    modelType?: string;
    color?: string;
    rotateSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * rotateSpeed;
            meshRef.current.rotation.x += delta * rotateSpeed * 0.4;
        }
    });

    const getGeometry = () => {
        switch (modelType) {
            case 'crystal':
                return <octahedronGeometry args={[1.5, 0]} />;
            case 'star':
                return <dodecahedronGeometry args={[1.4, 0]} />;
            case 'ring':
                return <torusGeometry args={[1.2, 0.4, 16, 64]} />;
            case 'giftBox':
                return <boxGeometry args={[1.8, 1.8, 1.8]} />;
            case 'heart':
            default:
                return <icosahedronGeometry args={[1.5, 1]} />;
        }
    };

    return (
        <mesh ref={meshRef}>
            {getGeometry()}
            <meshStandardMaterial
                color={color}
                roughness={0.15}
                metalness={0.4}
                emissive={color}
                emissiveIntensity={0.3}
                wireframe={modelType === 'star'}
            />
        </mesh>
    );
}

export default function Memory3DViewer({
    modelType = 'heart',
    color = '#ff69b4',
    rotateSpeed = 1.0,
}: {
    modelType?: 'heart' | 'crystal' | 'star' | 'ring' | 'giftBox';
    color?: string;
    rotateSpeed?: number;
}) {
    return (
        <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 relative shadow-inner">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
                <pointLight position={[-5, -5, -5]} intensity={1.0} color={color} />
                <RotatingObject modelType={modelType} color={color} rotateSpeed={rotateSpeed} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/40 pointer-events-none">
                3D Interactive Model • Drag to Rotate
            </div>
        </div>
    );
}
