'use client';

import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

export default function VolumetricFogVFX() {
    const { scene } = useThree();
    const cfg = DEFAULT_VFX_CONFIG.volumetricFog;

    React.useEffect(() => {
        if (!cfg.enabled) {
            scene.fog = null;
            return;
        }
        scene.fog = new THREE.FogExp2(cfg.color, cfg.density);
        return () => {
            scene.fog = null;
        };
    }, [scene, cfg]);

    return null;
}
