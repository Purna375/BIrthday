'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface AsteroidBeltProps {
    count?: number;
    innerRadius?: number;
    outerRadius?: number;
}

export default function AsteroidBelt({
    count = 1200,
    innerRadius = 27,
    outerRadius = 31,
}: AsteroidBeltProps) {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

    // Generate procedural irregular 3D asteroid geometry with vertex displacement
    const asteroidGeo = useMemo(() => {
        const geo = new THREE.DodecahedronGeometry(0.35, 1);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const noise = (Math.sin(x * 5) + Math.cos(y * 5) + Math.sin(z * 5)) * 0.08;
            pos.setXYZ(i, x + noise, y + noise, z + noise);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    // Pre-calculate random orbital data for each asteroid
    const asteroidsData = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const initialAngle = Math.random() * Math.PI * 2;
            const speed = (0.07 + Math.random() * 0.04) * (20 / radius);
            const yOffset = (Math.random() - 0.5) * 1.8;
            const scale = 0.2 + Math.random() * 0.5;
            const rotSpeedX = (Math.random() - 0.5) * 2;
            const rotSpeedY = (Math.random() - 0.5) * 2;

            data.push({
                radius,
                angle: initialAngle,
                speed,
                yOffset,
                scale,
                rotX: Math.random() * Math.PI,
                rotY: Math.random() * Math.PI,
                rotSpeedX,
                rotSpeedY,
            });
        }
        return data;
    }, [count, innerRadius, outerRadius]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, delta) => {
        if (!instancedMeshRef.current) return;

        asteroidsData.forEach((ast, i) => {
            ast.angle += delta * ast.speed;
            ast.rotX += delta * ast.rotSpeedX;
            ast.rotY += delta * ast.rotSpeedY;

            const x = Math.sin(ast.angle) * ast.radius;
            const z = Math.cos(ast.angle) * ast.radius;

            dummy.position.set(x, ast.yOffset, z);
            dummy.rotation.set(ast.rotX, ast.rotY, 0);
            dummy.scale.setScalar(ast.scale);
            dummy.updateMatrix();

            instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={instancedMeshRef}
            args={[asteroidGeo, undefined, count]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial roughness={0.95} metalness={0.1} color="#475569" />
        </instancedMesh>
    );
}
