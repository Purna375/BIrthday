'use client';

import React, { useRef } from 'react';
import { Group } from 'three';

export default function IntroScene() {
    const groupRef = useRef<Group>(null);

    return (
        <group ref={groupRef}>
            {/* Intro 3D elements will be placed here */}
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#8884d8" wireframe />
            </mesh>
        </group>
    );
}
