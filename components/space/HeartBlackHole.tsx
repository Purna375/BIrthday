'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/store/useExperienceStore';

export interface HeartBlackHoleProps {
    position?: [number, number, number];
    scale?: number;
    onSelect?: () => void;
}

// 1. Generate 2D Heart Outline for Extruded 3D Heart Geometry
function generateHeartPoints(steps = 128, scale = 1.15): THREE.Vector2[] {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);
        points.push(new THREE.Vector2((x / 16) * scale, (y / 16) * scale));
    }
    return points;
}

// 2. Central Event Horizon Solid 3D Heart Geometry
function createHeartGeometry(): THREE.BufferGeometry {
    const outline = generateHeartPoints(128, 1.15);
    const heartShape = new THREE.Shape(outline);

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.12,
        bevelSegments: 8,
        curveSegments: 32,
    });

    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
}

// 3. Photon Ring Rim Shader (Glowing edge hugging the heart shape)
const photonRingVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position + normal * 0.04;
    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const photonRingFragmentShader = `
  uniform float uTime;
  uniform float uIsError;
  uniform float uIsSuccess;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 4.5);

    vec3 intenseWhite = vec3(1.0, 1.0, 0.95);
    vec3 fieryOrange = vec3(1.0, 0.65, 0.15);

    vec3 rimColor = mix(fieryOrange, intenseWhite, fresnel);

    if (uIsError > 0.5) rimColor = vec3(1.0, 0.1, 0.2);
    if (uIsSuccess > 0.5) rimColor = vec3(0.2, 1.0, 0.5);

    float alpha = clamp(fresnel * 2.5, 0.0, 1.0);
    gl_FragColor = vec4(rimColor * 1.6, alpha);
  }
`;

// 4. Photorealistic Interstellar Accretion Disk Shader
const accretionDiskVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const accretionDiskFragmentShader = `
  uniform float uTime;
  uniform float uIsError;
  uniform float uIsSuccess;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    float dist = length(st) * 2.0;

    if (dist < 0.24 || dist > 0.98) discard;

    float angle = atan(st.y, st.x);

    // Multi-layer turbulent plasma spiral pattern
    float spiral = fbm(vec2(angle * 4.0, dist * 10.0 - uTime * 0.3));
    float turbulence = fbm(vec2(dist * 18.0 + uTime * 0.2, angle * 6.0));
    float plasmaPattern = spiral * 0.6 + turbulence * 0.4;

    // Doppler beaming asymmetry (front-left side illuminated)
    float doppler = sin(angle - 0.4) * 0.25 + 0.85;

    // Interstellar Color Palette: Incandescent White -> Warm Golden Amber -> Deep Crimson Red
    vec3 hotWhite = vec3(1.0, 0.98, 0.9);
    vec3 fieryAmber = vec3(1.0, 0.58, 0.08);
    vec3 darkCrimson = vec3(0.65, 0.08, 0.02);

    vec3 color = mix(hotWhite, fieryAmber, smoothstep(0.24, 0.48, dist));
    color = mix(color, darkCrimson, smoothstep(0.48, 0.98, dist));

    if (uIsError > 0.5) color = mix(color, vec3(1.0, 0.1, 0.2), 0.8);
    if (uIsSuccess > 0.5) color = mix(color, vec3(0.2, 1.0, 0.5), 0.8);

    color += vec3(plasmaPattern * 0.25);
    color *= doppler;

    float alpha = smoothstep(0.24, 0.3, dist) * (1.0 - smoothstep(0.75, 0.98, dist)) * 0.95;
    gl_FragColor = vec4(color * 1.3, alpha);
  }
`;

// 5. Gravitational Lensing Arch Shader (Curved halos bending OVER/UNDER the heart shadow)
const lensArchVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const lensArchFragmentShader = `
  uniform float uTime;
  uniform float uIsError;
  uniform float uIsSuccess;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv - vec2(0.5);
    float dist = length(st) * 2.0;

    if (dist < 0.28 || dist > 0.98) discard;

    float arcMask = smoothstep(0.28, 0.42, dist) * (1.0 - smoothstep(0.75, 0.98, dist));

    // Smooth fiery golden gradient for lensing arch
    vec3 brightCore = vec3(1.0, 0.96, 0.88);
    vec3 goldenAmber = vec3(1.0, 0.6, 0.1);
    vec3 darkOuter = vec3(0.5, 0.06, 0.01);

    vec3 color = mix(brightCore, goldenAmber, smoothstep(0.28, 0.52, dist));
    color = mix(color, darkOuter, smoothstep(0.52, 0.98, dist));

    if (uIsError > 0.5) color = vec3(1.0, 0.15, 0.2);
    if (uIsSuccess > 0.5) color = vec3(0.2, 1.0, 0.5);

    float alpha = arcMask * 0.92;
    gl_FragColor = vec4(color * 1.25, alpha);
  }
`;

// 6. Smooth Round Particles Shader (No square blocks)
const roundParticleVertexShader = `
  attribute float aSize;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const roundParticleFragmentShader = `
  uniform vec3 uColor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float alpha = (1.0 - smoothstep(0.2, 0.5, dist)) * 0.8;
    gl_FragColor = vec4(uColor * 1.2, alpha);
  }
`;

export default function HeartBlackHole({
    position = [0, 0, 0],
    scale = 0.9,
    onSelect,
}: HeartBlackHoleProps) {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const [isHovered, setIsHovered] = useState(false);

    const setPasswordModalOpen = useExperienceStore((state) => state.setPasswordModalOpen);
    const isPasswordError = useExperienceStore((state) => state.isPasswordError);
    const isPasswordSuccess = useExperienceStore((state) => state.isPasswordSuccess);
    const isAuthenticated = useExperienceStore((state) => state.isAuthenticated);
    const triggerWarp = useExperienceStore((state) => state.triggerWarp);

    const heartGeo = useMemo(() => createHeartGeometry(), []);

    // Round Dust Particle Attributes
    const particleCount = 500;
    const { particlePositions, particleSizes } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const radius = 2.4 + Math.random() * 5.2;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 0.5;

            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = height;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
            sizes[i] = 0.04 + Math.random() * 0.05;
        }
        return { particlePositions: pos, particleSizes: sizes };
    }, [particleCount]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uIsError: { value: 0 },
            uIsSuccess: { value: 0 },
        }),
        []
    );

    const particleUniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color('#ffb700') },
        }),
        []
    );

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        uniforms.uTime.value = time;
        uniforms.uIsError.value = isPasswordError ? 1.0 : 0.0;
        uniforms.uIsSuccess.value = isPasswordSuccess ? 1.0 : 0.0;

        if (isPasswordError) {
            particleUniforms.uColor.value.set('#ef4444');
        } else if (isHovered) {
            particleUniforms.uColor.value.set('#ffffff');
        } else {
            particleUniforms.uColor.value.set('#ffb700');
        }

        // Particle orbital movement
        if (particlesRef.current) {
            const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
            const array = posAttr.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                let x = array[i * 3];
                let z = array[i * 3 + 2];
                const currentDist = Math.sqrt(x * x + z * z);
                const angle = Math.atan2(z, x) + delta * 0.25;

                array[i * 3] = Math.cos(angle) * currentDist;
                array[i * 3 + 2] = Math.sin(angle) * currentDist;
            }
            posAttr.needsUpdate = true;
        }
    });

    const handleClick = (e: any) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
        if (isAuthenticated) {
            triggerWarp();
        } else {
            setPasswordModalOpen(true);
        }
        if (onSelect) onSelect();
    };

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* 1. Heart-Shaped Event Horizon Solid Shadow Core (Interactive Target) */}
            <mesh
                ref={coreRef}
                geometry={heartGeo}
                renderOrder={1}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                }}
                onClick={handleClick}
            >
                <meshBasicMaterial color="#000000" depthTest={true} depthWrite={true} />
            </mesh>

            {/* 2. Thin Photon Ring Rim hugging the heart's beveled edge */}
            <mesh geometry={heartGeo} renderOrder={2}>
                <shaderMaterial
                    vertexShader={photonRingVertexShader}
                    fragmentShader={photonRingFragmentShader}
                    uniforms={uniforms}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 3. Photorealistic Horizontal Accretion Disk Ring (Non-clickable visual effect) */}
            <mesh rotation={[-Math.PI / 2.25, 0, 0]} renderOrder={3}>
                <ringGeometry args={[1.35, 6.4, 128, 1]} />
                <shaderMaterial
                    vertexShader={accretionDiskVertexShader}
                    fragmentShader={accretionDiskFragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 4. Top Gravitational Lensing Arch */}
            <mesh position={[0, 0.35, -0.25]} rotation={[0.4, 0, 0]} renderOrder={4}>
                <ringGeometry args={[1.4, 5.2, 128, 1, 0, Math.PI]} />
                <shaderMaterial
                    vertexShader={lensArchVertexShader}
                    fragmentShader={lensArchFragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 5. Bottom Gravitational Lensing Arch */}
            <mesh position={[0, -0.35, -0.25]} rotation={[-0.4, 0, Math.PI]} renderOrder={4}>
                <ringGeometry args={[1.4, 5.2, 128, 1, 0, Math.PI]} />
                <shaderMaterial
                    vertexShader={lensArchVertexShader}
                    fragmentShader={lensArchFragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 6. Smooth Circular Round Particle Dust */}
            <points ref={particlesRef} renderOrder={5}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
                    <bufferAttribute attach="attributes-aSize" args={[particleSizes, 1]} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={roundParticleVertexShader}
                    fragmentShader={roundParticleFragmentShader}
                    uniforms={particleUniforms}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Warm Atmospheric Point Light */}
            <pointLight
                color="#ff8c00"
                intensity={isPasswordError ? 3.5 : 1.8}
                distance={10}
                decay={2}
            />
        </group>
    );
}