'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAudioStore } from '@/store/useAudioStore';
import { SceneId } from '@/types/scene';

export interface CinematicCameraProps {
    targetPosition?: [number, number, number];
    orbitRadius?: number;
    orbitSpeed?: number;
}

export default function CinematicCamera({
    targetPosition = [0, 0, 0],
}: CinematicCameraProps) {
    const { camera } = useThree();

    const currentScene = useExperienceStore((state) => state.currentScene);
    const isWarping = useExperienceStore((state) => state.isWarping);
    const setWarpProgress = useExperienceStore((state) => state.setWarpProgress);
    const nextScene = useExperienceStore((state) => state.nextScene);
    const resetWarp = useExperienceStore((state) => state.resetWarp);
    const { playTransition } = useAudioStore();

    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const isSpaceScene = currentScene === SceneId.INTRO || currentScene === SceneId.SPACE;

    // 3D Cinematic Perspective Pitch Angle (20 degrees down view to render 3D lensing depth)
    const CAM_POS: [number, number, number] = [0, 1.6, 7.5];

    useEffect(() => {
        if (isSpaceScene && camera instanceof THREE.PerspectiveCamera) {
            camera.fov = 55;
            camera.position.set(...CAM_POS);
            camera.lookAt(targetPosition[0], targetPosition[1] - 0.2, targetPosition[2]);
            camera.updateProjectionMatrix();
        }
    }, [camera, isSpaceScene, targetPosition]);

    // Handle Warp Speed Transition Timeline & Play Cosmic SFX
    useEffect(() => {
        if (!isWarping) return;

        playTransition();
        const perspectiveCam = camera as THREE.PerspectiveCamera;

        const tl = gsap.timeline({
            onUpdate: () => {
                const progress = tl.progress();
                setWarpProgress(progress);
            },
            onComplete: () => {
                resetWarp();
                nextScene();
            },
        });

        timelineRef.current = tl;

        tl.to(camera.position, {
            x: targetPosition[0] * 0.5,
            y: targetPosition[1] + 0.3,
            z: targetPosition[2] + 4.0,
            duration: 4.0,
            ease: 'power2.inOut',
        });

        if (perspectiveCam.fov) {
            tl.to(
                perspectiveCam,
                {
                    fov: 50,
                    duration: 4.0,
                    ease: 'power2.inOut',
                    onUpdate: () => perspectiveCam.updateProjectionMatrix(),
                },
                '0'
            );
        }

        tl.to(camera.position, {
            x: targetPosition[0],
            y: targetPosition[1],
            z: targetPosition[2] + 0.3,
            duration: 5.0,
            ease: 'expo.in',
        });

        if (perspectiveCam.fov) {
            tl.to(
                perspectiveCam,
                {
                    fov: 115,
                    duration: 5.0,
                    ease: 'expo.in',
                    onUpdate: () => perspectiveCam.updateProjectionMatrix(),
                },
                '4.0'
            );
        }

        tl.to(camera.position, {
            z: targetPosition[2] - 0.5,
            duration: 3.0,
            ease: 'power3.out',
        });

        if (perspectiveCam.fov) {
            tl.to(
                perspectiveCam,
                {
                    fov: 60,
                    duration: 3.0,
                    ease: 'power3.out',
                    onUpdate: () => perspectiveCam.updateProjectionMatrix(),
                },
                '9.0'
            );
        }

        return () => {
            tl.kill();
        };
    }, [isWarping, camera, targetPosition, setWarpProgress, nextScene, resetWarp, playTransition]);

    // Frame Loop: Keep Camera Fixed & Stationary at 3D Cinematic Pitch Angle
    useFrame((state) => {
        if (!isSpaceScene && !isWarping) return;

        const warpProg = useExperienceStore.getState().warpProgress;

        if (!isWarping) {
            camera.position.set(...CAM_POS);
            camera.lookAt(targetPosition[0], targetPosition[1] - 0.2, targetPosition[2]);
        } else {
            // Apply Camera Shake during Warp Phase
            if (warpProg > 0.25 && warpProg < 0.95) {
                const shakeIntensity = Math.sin((warpProg - 0.25) * Math.PI) * 0.25;
                const time = state.clock.getElapsedTime() * 60;

                camera.position.x += (Math.sin(time * 1.3) * 0.08 - 0.04) * shakeIntensity;
                camera.position.y += (Math.cos(time * 1.7) * 0.08 - 0.04) * shakeIntensity;
                camera.position.z += (Math.sin(time * 2.1) * 0.08 - 0.04) * shakeIntensity;
            }

            camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2]);
        }
    });

    return null;
}
