'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useExperienceStore } from '@/store/useExperienceStore';
import { DEFAULT_VFX_CONFIG } from '@/config/vfx.config';

const CustomWarpShader = {
    uniforms: {
        tDiffuse: { value: null },
        uWarpProgress: { value: 0 },
        uTime: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uWarpProgress;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      float caOffset = pow(uWarpProgress, 2.0) * 0.035;
      float r = texture2D(tDiffuse, uv + vec2(caOffset, 0.0)).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(caOffset, 0.0)).b;
      vec3 color = vec3(r, g, b);

      vec2 st = uv - vec2(0.5);
      float dist = length(st);
      float vignette = smoothstep(0.85, 0.25 - uWarpProgress * 0.1, dist);
      color *= vignette;

      float noise = (fract(sin(dot(uv * (uTime + 1.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (uWarpProgress * 0.08);
      color += vec3(noise);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default function PostProcessing() {
    const { gl, scene, camera, size } = useThree();
    const warpProgress = useExperienceStore((state) => state.warpProgress);

    const composerRef = useRef<EffectComposer | null>(null);
    const renderPassRef = useRef<RenderPass | null>(null);
    const bloomPassRef = useRef<UnrealBloomPass | null>(null);
    const customPassRef = useRef<ShaderPass | null>(null);

    const bloomCfg = DEFAULT_VFX_CONFIG.bloom;

    useEffect(() => {
        const composer = new EffectComposer(gl);
        composer.setSize(size.width, size.height);

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        renderPassRef.current = renderPass;

        if (bloomCfg.enabled) {
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(size.width, size.height),
                bloomCfg.intensity,
                0.4,
                bloomCfg.luminanceThreshold
            );
            composer.addPass(bloomPass);
            bloomPassRef.current = bloomPass;
        }

        const customPass = new ShaderPass({
            uniforms: THREE.UniformsUtils.clone(CustomWarpShader.uniforms),
            vertexShader: CustomWarpShader.vertexShader,
            fragmentShader: CustomWarpShader.fragmentShader,
        });
        composer.addPass(customPass);
        customPassRef.current = customPass;

        composerRef.current = composer;

        return () => {
            composer.dispose();
            composerRef.current = null;
            renderPassRef.current = null;
            bloomPassRef.current = null;
            customPassRef.current = null;
        };
    }, [gl, bloomCfg.enabled, bloomCfg.intensity, bloomCfg.luminanceThreshold]);

    useEffect(() => {
        if (composerRef.current) {
            composerRef.current.setSize(size.width, size.height);
        }
    }, [size]);

    useFrame((state, delta) => {
        if (!composerRef.current || !renderPassRef.current || !scene || !camera) return;

        // Keep renderPass synced with active R3F scene and camera without destroying composer
        renderPassRef.current.scene = scene;
        renderPassRef.current.camera = camera;

        if (customPassRef.current?.uniforms?.uWarpProgress) {
            customPassRef.current.uniforms.uWarpProgress.value = warpProgress;
            customPassRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }

        if (bloomPassRef.current && bloomCfg.enabled) {
            bloomPassRef.current.strength = bloomCfg.intensity + warpProgress * 1.8;
        }

        try {
            composerRef.current.render(delta);
        } catch {
            // Guard against temporary render frame glitches during webgl context sync
        }
    }, 1);

    return null;
}
