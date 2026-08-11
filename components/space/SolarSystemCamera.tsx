'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useRevealStore } from '@/store/useRevealStore';
import { PLANETS_DATA } from '@/constants/planets';

export default function SolarSystemCamera() {
    const { camera } = useThree();
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const enterPlanetSurface = useExperienceStore((state) => state.enterPlanetSurface);
    const { phase } = useRevealStore();

    const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
    const isZoomingInRef = useRef(false);

    useEffect(() => {
        if (camera && planetViewMode === 'orbit') {
            camera.position.set(0, 35, 75);
            camera.lookAt(0, 0, 0);
        }
        if (controlsRef.current && planetViewMode === 'orbit') {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    }, [camera, planetViewMode]);

    useFrame((state) => {
        if (!controlsRef.current || planetViewMode === 'surface') return;

        if (phase === 'camera_diving') {
            // Rapid cinematic camera dive directly into the heart core
            camera.position.lerp(new THREE.Vector3(0, 0, 0.5), 0.1);
            targetPosition.current.set(0, 0, 0);
        } else if (!selectedPlanetId) {
            targetPosition.current.set(0, 0, 0);
            isZoomingInRef.current = false;
        } else {
            const planetData = PLANETS_DATA.find((p) => p.id === selectedPlanetId);
            if (planetData) {
                const time = state.clock.getElapsedTime();
                const angle = time * planetData.orbitSpeed;
                const planetX = Math.sin(angle) * planetData.orbitRadius;
                const planetZ = Math.cos(angle) * planetData.orbitRadius;
                const planetPos = new THREE.Vector3(planetX, 0, planetZ);

                targetPosition.current.copy(planetPos);

                if (planetViewMode === 'zooming') {
                    // Zoom camera position in towards the planet
                    const targetCamPos = new THREE.Vector3(planetX, 3, planetZ + planetData.size * 3.5);
                    camera.position.lerp(targetCamPos, 0.08);

                    const dist = camera.position.distanceTo(targetCamPos);
                    if (dist < 4.0 && !isZoomingInRef.current) {
                        isZoomingInRef.current = true;
                        setTimeout(() => {
                            enterPlanetSurface(planetData.id);
                            isZoomingInRef.current = false;
                        }, 200);
                    }
                }
            }
        }

        controlsRef.current.target.lerp(targetPosition.current, 0.08);
        controlsRef.current.update();
    });

    if (planetViewMode === 'surface') return null;

    return (
        <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.7}
            zoomSpeed={0.9}
            panSpeed={0.8}
            minDistance={0.1}
            maxDistance={220}
            maxPolarAngle={Math.PI / 1.75}
            makeDefault
        />
    );
}
