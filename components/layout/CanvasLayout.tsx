'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_CANVAS_PROPS } from '@/lib/three-config';
import SpaceBackground from '@/components/space/SpaceBackground';
import PostProcessing from '@/components/effects/PostProcessing';
import SceneContainer from '@/scenes/SceneContainer';

interface CanvasLayoutProps {
    children?: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-auto bg-black">
            <Canvas {...DEFAULT_CANVAS_PROPS}>
                <SpaceBackground />
                <SceneContainer />
                <PostProcessing />
                {children}
            </Canvas>
        </div>
    );
}
