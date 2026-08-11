import { CanvasProps } from '@react-three/fiber';
import * as THREE from 'three';
import { APP_CONFIG } from '@/constants/config';

if (typeof window !== 'undefined') {
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
        if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
            return;
        }
        originalWarn.apply(console, args);
    };
}

export const DEFAULT_CANVAS_PROPS: Partial<CanvasProps> = {
    dpr: APP_CONFIG.graphics.dpr,
    camera: {
        fov: APP_CONFIG.camera.fov,
        near: APP_CONFIG.camera.near,
        far: APP_CONFIG.camera.far,
        position: APP_CONFIG.camera.position,
    },
    gl: {
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
    },
    shadows: {
        type: THREE.PCFShadowMap,
    },
};
