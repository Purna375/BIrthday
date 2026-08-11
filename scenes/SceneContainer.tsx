'use client';

import React from 'react';
import { useExperienceStore } from '@/store/useExperienceStore';
import { SceneId } from '@/types/scene';
import SpaceScene from './SpaceScene';
import SolarSystemScene from './SolarSystemScene';
import CelebrationScene from './CelebrationScene';

export default function SceneContainer() {
    const currentScene = useExperienceStore((state) => state.currentScene);

    switch (currentScene) {
        case SceneId.INTRO:
        case SceneId.SPACE:
            return <SpaceScene />;
        case SceneId.SOLAR_SYSTEM:
            return <SolarSystemScene />;
        case SceneId.BIRTHDAY:
        case SceneId.CELEBRATION:
        case SceneId.OUTRO:
            return <CelebrationScene />;
        default:
            return <SpaceScene />;
    }
}
