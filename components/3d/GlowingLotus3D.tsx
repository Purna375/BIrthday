'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* =========================================================
   TYPES
========================================================= */

export type LotusTheme = 'rose' | 'gold' | 'sapphire';

interface GlowingLotusProps {
    triggerBloom?: number;
    theme?: LotusTheme;
    className?: string;
    autoRotate?: boolean;
    bloomProgress?: number;
}

interface PetalProps {
    length: number;
    width: number;
    curve: number;
    angle: number;
    tilt: number;
    y: number;
    color: string;
    emissive: string;
    opacity: number;
    delay: number;
    bloomRef: React.MutableRefObject<number>;
    glow: number;
}

/* =========================================================
   THEME COLORS
========================================================= */

const THEMES = {
    rose: {
        petal: '#fce8f5',   // near-white pink — crystal glass
        inner: '#fff5fb',
        edge: '#f9d0ec',
        emissive: '#dd5599',  // softer, not neon
        core: '#fff8e8',
        glow: '#ffcc88',
    },

    gold: {
        petal: '#fff5e0',
        inner: '#fffaee',
        edge: '#ffe4a0',
        emissive: '#ffaa44',
        core: '#fff8e0',
        glow: '#ffd060',
    },

    sapphire: {
        petal: '#e8f4ff',
        inner: '#f4faff',
        edge: '#b8d8ff',
        emissive: '#4499dd',
        core: '#f0fbff',
        glow: '#88ccff',
    },
};

/* =========================================================
   PETAL GEOMETRY

   Unlike the old ExtrudeGeometry version, this creates a
   very thin curved surface.

   This is what gives the petals the soft translucent
   appearance of Image 2.
========================================================= */

function createLotusPetal(
    length: number,
    width: number,
    curve: number
): THREE.BufferGeometry {
    const radialSegments = 18;
    const widthSegments = 12;

    const vertices: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y <= radialSegments; y++) {
        const v = y / radialSegments;

        /*
          Petal starts narrow at the base,
          becomes widest around the middle,
          then narrows into a sharp tip.
        */
        const widthProfile =
            Math.sin(v * Math.PI) ** 0.72;

        const currentWidth = width * widthProfile;

        /*
          Slight inward narrowing near the tip.
        */
        const tipCompression =
            v > 0.72
                ? 1 - ((v - 0.72) / 0.28) * 0.30
                : 1;

        const finalWidth =
            currentWidth * tipCompression;

        /*
          Smooth upward arch.
    
          Outer petals use a larger curve.
          Inner petals use a smaller curve.
        */
        const zCurve =
            Math.sin(v * Math.PI) * curve;

        /*
          Small upward lift near the tip.
          This keeps the tip elegant rather than flat.
        */
        const yPosition =
            v * length +
            Math.sin(v * Math.PI) * 0.10;

        for (let x = 0; x <= widthSegments; x++) {
            const u = x / widthSegments;

            /*
              Center = 0
              Left = -1
              Right = +1
            */
            const side = u * 2 - 1;

            /*
              Slightly round the petal surface.
            */
            const surfaceCurve =
                Math.pow(Math.abs(side), 1.65) * 0.035;

            const px =
                side * finalWidth;

            const pz =
                zCurve -
                surfaceCurve +
                Math.cos(v * Math.PI) * 0.01;

            vertices.push(
                px,
                yPosition,
                pz
            );
        }
    }

    for (let y = 0; y < radialSegments; y++) {
        for (let x = 0; x < widthSegments; x++) {
            const a =
                y * (widthSegments + 1) + x;

            const b = a + 1;
            const c =
                a + (widthSegments + 1);

            const d = c + 1;

            indices.push(
                a,
                c,
                b,
                b,
                c,
                d
            );
        }
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    return geometry;
}

/* =========================================================
   PETAL
========================================================= */

function LotusPetal({
    length,
    width,
    curve,
    angle,
    tilt,
    y,
    color,
    emissive,
    opacity,
    delay,
    bloomRef,
    glow,
}: PetalProps) {
    const groupRef =
        useRef<THREE.Group>(null);

    const material = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(emissive),
            emissiveIntensity: 0.07,  // very low — petals lit by scene lights, not self-glow
            transparent: true,
            opacity: opacity,
            roughness: 0.04,
            metalness: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            iridescence: 0.75,
            iridescenceIOR: 1.65,
            iridescenceThicknessRange: [60, 480],
            side: THREE.DoubleSide,
            depthWrite: false,
            attenuationColor: new THREE.Color(color),
            attenuationDistance: 2.5,
        });
    }, [color, emissive, opacity]);

    const geometry = useMemo(() => {
        return createLotusPetal(
            length,
            width,
            curve
        );
    }, [length, width, curve]);

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        const progress = THREE.MathUtils.clamp(
            (bloomRef.current - delay) /
            Math.max(0.001, 1 - delay),
            0,
            1
        );

        /*
          Smooth opening animation.
        */
        const eased =
            progress *
            progress *
            (3 - 2 * progress);

        /*
          Start folded.
          Finish at the requested tilt.
        */
        const closedTilt = 0.12;

        groupRef.current.rotation.x =
            closedTilt +
            (tilt - closedTilt) * eased;

        /*
          Tiny breathing motion after opening.
        */
        if (progress >= 1) {
            groupRef.current.rotation.x =
                tilt +
                Math.sin(
                    clock.elapsedTime * 0.7
                ) *
                0.006;
        }

        const scale =
            0.72 + eased * 0.28;

        groupRef.current.scale.set(
            scale,
            scale,
            scale
        );

        material.emissiveIntensity =
            0.18 +
            eased * glow;
    });

    return (
        <group
            rotation={[0, angle, 0]}
        >
            <group
                ref={groupRef}
                position={[0, y, 0]}
            >
                <mesh
                    geometry={geometry}
                    material={material}
                />

                {/* Soft glowing edge/tip */}
                <PetalTip
                    length={length}
                    color={color}
                    emissive={emissive}
                    opacity={opacity}
                    bloomRef={bloomRef}
                    delay={delay}
                />
            </group>
        </group>
    );
}

/* =========================================================
   PETAL TIP
========================================================= */

function PetalTip({
    length,
    color,
    emissive,
    opacity,
    bloomRef,
    delay,
}: {
    length: number;
    color: string;
    emissive: string;
    opacity: number;
    bloomRef: React.MutableRefObject<number>;
    delay: number;
}) {
    const lightRef =
        useRef<THREE.PointLight>(null);

    const meshRef =
        useRef<THREE.Mesh>(null);

    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: '#fff4ff',
            emissive: new THREE.Color(
                emissive
            ),
            emissiveIntensity: 2.5,
            transparent: true,
            opacity: 0.85,
        });
    }, [emissive]);

    useFrame(() => {
        const progress =
            THREE.MathUtils.clamp(
                (bloomRef.current - delay) /
                Math.max(0.001, 1 - delay),
                0,
                1
            );

        if (lightRef.current) {
            lightRef.current.intensity =
                progress * 0.35;
        }

        if (meshRef.current) {
            meshRef.current.scale.setScalar(
                0.5 + progress * 0.5
            );
        }
    });

    return (
        <group
            position={[
                0,
                length,
                0.04,
            ]}
        >
            <mesh
                ref={meshRef}
                material={material}
            >
                <sphereGeometry
                    args={[0.035, 12, 12]}
                />
            </mesh>

            <pointLight
                ref={lightRef}
                color={emissive}
                intensity={0}
                distance={1.3}
                decay={2}
            />
        </group>
    );
}

/* =========================================================
   GLOWING CORE

   Image 2 has a large soft white/yellow heart,
   not the small hard sphere from Image 1.
========================================================= */

function LotusCore({
    theme,
    bloomRef,
}: {
    theme: typeof THEMES.rose;
    bloomRef: React.MutableRefObject<number>;
}) {
    const coreRef =
        useRef<THREE.Mesh>(null);

    const haloRef =
        useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const pulse =
            1 +
            Math.sin(
                clock.elapsedTime * 1.6
            ) *
            0.08;

        if (coreRef.current) {
            coreRef.current.scale.setScalar(
                pulse
            );
        }

        if (haloRef.current) {
            haloRef.current.scale.setScalar(
                1.0 +
                Math.sin(
                    clock.elapsedTime * 1.2
                ) *
                0.04
            );
        }
    });

    return (
        <>
            {/* Outer soft halo — very subtle */}
            <mesh
                ref={haloRef}
                position={[0, 0.15, 0.05]}
            >
                <sphereGeometry args={[0.42, 32, 32]} />
                <meshBasicMaterial
                    color={theme.glow}
                    transparent
                    opacity={0.055}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Main luminous heart — warm amber, not blinding white */}
            <mesh ref={coreRef} position={[0, 0.17, 0.08]}>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial
                    color={theme.core}
                    emissive={theme.core}
                    emissiveIntensity={1.6}
                    transparent
                    opacity={0.95}
                    roughness={0.05}
                />
            </mesh>

            {/* Gentle warm core light — just enough to light inner petals */}
            <pointLight
                color={theme.glow}
                intensity={1.0}
                distance={3.5}
                decay={2}
                position={[0, 0.15, 0.1]}
            />
        </>
    );
}

/* =========================================================
   INNER LIGHT FILAMENTS

   These replace the heavy yellow stamens from the
   original design.
========================================================= */

function InnerFilaments({
    bloomRef,
    color,
}: {
    bloomRef: React.MutableRefObject<number>;
    color: string;
}) {
    const groupRef =
        useRef<THREE.Group>(null);

    const count = 30;

    const positions = useMemo(() => {
        return Array.from({
            length: count,
        }).map((_, i) => {
            const angle =
                (i / count) *
                Math.PI *
                2;

            const radius =
                0.10 +
                (i % 4) * 0.045;

            return {
                angle,
                radius,
            };
        });
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;

        const progress =
            THREE.MathUtils.clamp(
                (bloomRef.current - 0.62) /
                0.38,
                0,
                1
            );

        groupRef.current.scale.setScalar(
            progress
        );
    });

    return (
        <group ref={groupRef}>
            {positions.map((item, i) => {
                const x =
                    Math.cos(item.angle) *
                    item.radius;

                const z =
                    Math.sin(item.angle) *
                    item.radius;

                return (
                    <group
                        key={i}
                        position={[
                            x,
                            0.15,
                            z,
                        ]}
                        rotation={[
                            0,
                            item.angle,
                            0,
                        ]}
                    >
                        <mesh
                            position={[
                                0,
                                0.20,
                                0,
                            ]}
                        >
                            <cylinderGeometry
                                args={[
                                    0.006,
                                    0.009,
                                    0.38,
                                    6,
                                ]}
                            />

                            <meshStandardMaterial
                                color="#fff3c9"
                                emissive={color}
                                emissiveIntensity={2}
                                transparent
                                opacity={0.85}
                            />
                        </mesh>

                        <mesh
                            position={[
                                0,
                                0.40,
                                0,
                            ]}
                        >
                            <sphereGeometry
                                args={[
                                    0.018,
                                    8,
                                    8,
                                ]}
                            />

                            <meshStandardMaterial
                                color="#fff"
                                emissive="#fff"
                                emissiveIntensity={1.8}  // reduced from 4 — no more bright blobs
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

/* =========================================================
   LOTUS SCENE
========================================================= */

function LotusScene({
    triggerBloom,
    themeName = 'rose',
    autoRotate = true,
}: {
    triggerBloom?: number;
    themeName?: LotusTheme;
    autoRotate?: boolean;
}) {
    const bloomRef =
        useRef(0);

    const flowerRef =
        useRef<THREE.Group>(null);

    const theme =
        THEMES[themeName];

    useEffect(() => {
        bloomRef.current = 0;
    }, [triggerBloom]);

    useFrame((_, delta) => {
        /*
          Slower bloom so the flower feels like
          it is opening naturally.
        */
        bloomRef.current =
            Math.min(
                1,
                bloomRef.current +
                delta * 0.12
            );

        if (
            autoRotate &&
            flowerRef.current
        ) {
            flowerRef.current.rotation.y +=
                delta * 0.025;
        }
    });

    /*
      5 layers.
  
      Notice the major difference:
      outer petals are very wide and horizontal,
      while inner petals rise gradually.
  
      This is much closer to Image 2.
    */
    const petals = useMemo(() => {
        const result: PetalProps[] = [];

        /* ---------------------------------------------
           LAYER 1
           Large horizontal outer petals
        --------------------------------------------- */

        const outerCount = 10;

        for (
            let i = 0;
            i < outerCount;
            i++
        ) {
            result.push({
                length: 2.45,
                width: 1.20,
                curve: 0.26,

                angle:
                    (i / outerCount) *
                    Math.PI *
                    2,

                /*
                  Almost horizontal.
                */
                tilt: 1.43,

                y: -0.03,

                color: theme.petal,
                emissive: theme.emissive,

                opacity: 0.28,   // crystal glass — very translucent outer petals

                delay: 0.00,

                bloomRef,

                glow: 0.20,
            });
        }

        /* ---------------------------------------------
           LAYER 2
           Broad pink petals
        --------------------------------------------- */

        const secondCount = 9;

        for (
            let i = 0;
            i < secondCount;
            i++
        ) {
            result.push({
                length: 2.35,
                width: 1.05,
                curve: 0.30,

                angle:
                    (i / secondCount) *
                    Math.PI *
                    2 +
                    Math.PI / secondCount,

                tilt: 1.18,

                y: 0.01,

                color: theme.petal,
                emissive: theme.emissive,

                opacity: 0.30,

                delay: 0.10,

                bloomRef,

                glow: 0.22,
            });
        }

        /* ---------------------------------------------
           LAYER 3
           Middle translucent petals
        --------------------------------------------- */

        const middleCount = 8;

        for (
            let i = 0;
            i < middleCount;
            i++
        ) {
            result.push({
                length: 2.15,
                width: 0.88,
                curve: 0.34,

                angle:
                    (i / middleCount) *
                    Math.PI *
                    2 +
                    0.18,

                tilt: 0.88,

                y: 0.06,

                color: theme.inner,
                emissive: theme.emissive,

                opacity: 0.33,

                delay: 0.22,

                bloomRef,

                glow: 0.28,
            });
        }

        /* ---------------------------------------------
           LAYER 4
           Inner upright petals
    
           IMPORTANT:
           These are shorter than the original
           version so they don't form a giant bud.
        --------------------------------------------- */

        const innerCount = 7;

        for (
            let i = 0;
            i < innerCount;
            i++
        ) {
            result.push({
                length: 1.85,
                width: 0.72,
                curve: 0.26,

                angle:
                    (i / innerCount) *
                    Math.PI *
                    2 +
                    0.35,

                tilt: 0.54,

                y: 0.10,

                color: theme.inner,
                emissive: theme.emissive,

                opacity: 0.38,

                delay: 0.36,

                bloomRef,

                glow: 0.32,
            });
        }

        /* ---------------------------------------------
           LAYER 5
           Small crown around the center
        --------------------------------------------- */

        const crownCount = 5;

        for (
            let i = 0;
            i < crownCount;
            i++
        ) {
            result.push({
                length: 1.40,
                width: 0.52,
                curve: 0.18,

                angle:
                    (i / crownCount) *
                    Math.PI *
                    2 +
                    0.12,

                tilt: 0.30,

                y: 0.14,

                color: '#fff4fb',
                emissive: theme.emissive,

                opacity: 0.42,

                delay: 0.52,

                bloomRef,

                glow: 0.38,
            });
        }

        return result;
    }, [theme, bloomRef]);

    return (
        <>
            {/* =================================================
          BACKGROUND
      ================================================= */}

            <color
                attach="background"
                args={['#100613']}
            />

            {/* =================================================
          LIGHTING
      ================================================= */}

            <ambientLight color="#ffd8f0" intensity={0.70} />

            {/* Key: warm from above-front — main illumination of petals */}
            <directionalLight color="#fff6f0" intensity={2.4} position={[2, 6, 4]} />

            {/* Blue fill from LEFT — iridescent shimmer (image 2 blue tint on left petal) */}
            <directionalLight color="#88aaff" intensity={1.6} position={[-6, 2, 0]} />

            {/* Warm pink from camera direction — front fill so petals look lit */}
            <directionalLight color="#ffccee" intensity={1.2} position={[0, 1, 6]} />

            {/* Warm fill from right */}
            <directionalLight color="#ffddcc" intensity={0.5} position={[5, 1, 2]} />

            {/* Soft backlight pink */}
            <directionalLight color="#ffaabb" intensity={0.25} position={[0, 2, -5]} />

            {/* =================================================
          STAR FIELD
      ================================================= */}

            <Stars
                radius={70}
                depth={35}
                count={2200}
                factor={2.4}
                saturation={0.15}
                fade
                speed={0.25}
            />

            {/* =================================================
          LOTUS
      ================================================= */}

            <group
                ref={flowerRef}
                position={[
                    0,
                    -0.25,
                    0,
                ]}
            >
                {/* ---------------------------------------------
            Stem
        --------------------------------------------- */}

                <mesh
                    position={[
                        0,
                        -1.45,
                        0,
                    ]}
                >
                    <cylinderGeometry
                        args={[
                            0.035,
                            0.055,
                            2.5,
                            12,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#315f42"
                        roughness={0.65}
                    />
                </mesh>

                {/* ---------------------------------------------
            Petals
        --------------------------------------------- */}

                {petals.map(
                    (petal, index) => (
                        <LotusPetal
                            key={index}
                            {...petal}
                        />
                    )
                )}

                {/* ---------------------------------------------
            Center
        --------------------------------------------- */}

                <LotusCore
                    theme={theme}
                    bloomRef={bloomRef}
                />

                {/* ---------------------------------------------
            Fine glowing filaments
        --------------------------------------------- */}

                <InnerFilaments
                    bloomRef={bloomRef}
                    color={theme.emissive}
                />
            </group>

            {/* =================================================
          BLOOM
      ================================================= */}

            {/* Bloom: ONLY hits very bright emitters (core sphere, tips) — NOT petals */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.52} luminanceSmoothing={0.90} intensity={1.10} mipmapBlur />
            </EffectComposer>

            {/* =================================================
          CAMERA CONTROL
      ================================================= */}

            <OrbitControls
                target={[
                    0,
                    0.15,
                    0,
                ]}
                enableZoom
                enablePan={false}
                minDistance={4}
                maxDistance={9}
                minPolarAngle={0.65}
                maxPolarAngle={
                    Math.PI * 0.58
                }
            />
        </>
    );
}

/* =========================================================
   EXPORTED COMPONENT
========================================================= */

export default function GlowingLotus3D({
    triggerBloom,
    theme = 'rose',
    className =
    'w-full h-full min-h-[460px]',
    autoRotate = true,
}: GlowingLotusProps) {
    return (
        <div
            className={`relative overflow-hidden flex items-center justify-center ${className}`}
            style={{
                background:
                    'radial-gradient(circle at center, #210c1d 0%, #100613 45%, #050207 100%)',
            }}
        >
            <Canvas
                camera={{
                    /*
                      Lower and closer camera.
          
                      This makes the lotus fill the frame
                      like Image 2 rather than looking
                      down onto it from above.
                    */
                    position: [
                        0,
                        1.45,
                        6.6,
                    ],

                    fov: 38,

                    near: 0.1,
                    far: 100,
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference:
                        'high-performance',

                    toneMapping:
                        THREE.ACESFilmicToneMapping,

                    toneMappingExposure: 0.90,   // reduced — stops petals looking washed out
                }}
                dpr={[1, 2]}
            >
                <LotusScene
                    triggerBloom={
                        triggerBloom
                    }
                    themeName={theme}
                    autoRotate={
                        autoRotate
                    }
                />
            </Canvas>
        </div>
    );
}