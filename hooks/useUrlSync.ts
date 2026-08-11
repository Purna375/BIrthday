'use client';

import { useEffect, useRef } from 'react';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useRevealStore } from '@/store/useRevealStore';
import { SceneId } from '@/types/scene';
import { PLANETS_DATA } from '@/constants/planets';

/**
 * Custom hook to dynamically sync browser address bar with app scene/planet state
 * without requiring any page refreshes, and hydrate state on direct load / back-forward.
 */
export function useUrlSync() {
    const currentScene = useExperienceStore((state) => state.currentScene);
    const setScene = useExperienceStore((state) => state.setScene);
    const selectedPlanetId = useExperienceStore((state) => state.selectedPlanetId);
    const activePuzzlePlanetId = useExperienceStore((state) => state.activePuzzlePlanetId);
    const planetViewMode = useExperienceStore((state) => state.planetViewMode);
    const enterPlanetSurface = useExperienceStore((state) => state.enterPlanetSurface);
    const exitPlanetSurface = useExperienceStore((state) => state.exitPlanetSurface);
    const startExperience = useExperienceStore((state) => state.startExperience);
    const checkExistingAuth = useExperienceStore((state) => state.checkExistingAuth);

    const phase = useRevealStore((state) => state.phase);
    const isDay10Revealing = useRevealStore((state) => state.isDay10Revealing);

    const isInitializedRef = useRef(false);

    // 1. Initial Mount & Browser Back/Forward (popstate) Hydration
    useEffect(() => {
        const syncStateFromUrl = async () => {
            if (typeof window === 'undefined') return;

            const pathname = window.location.pathname.toLowerCase();
            const searchParams = new URLSearchParams(window.location.search);
            const queryScene = searchParams.get('scene')?.toUpperCase();
            const queryPlanet = searchParams.get('planet')?.toLowerCase();

            // Run 30-day auth token validation first
            await checkExistingAuth();

            // Parse URL path or search parameters
            if (pathname.startsWith('/planet/') || queryPlanet) {
                const rawPlanetId = pathname.startsWith('/planet/')
                    ? pathname.replace('/planet/', '').split('/')[0].trim()
                    : queryPlanet;

                const planet = PLANETS_DATA.find(
                    (p) => p.id === rawPlanetId || String(p.dayNumber) === rawPlanetId
                );

                if (planet) {
                    setScene(SceneId.SOLAR_SYSTEM);
                    enterPlanetSurface(planet.id);
                    startExperience();
                }
            } else if (pathname === '/solar-system' || queryScene === 'SOLAR_SYSTEM') {
                setScene(SceneId.SOLAR_SYSTEM);
                exitPlanetSurface();
                startExperience();
            } else if (pathname === '/celebration' || queryScene === 'CELEBRATION') {
                setScene(SceneId.CELEBRATION);
                startExperience();
            } else if (pathname === '/space' || queryScene === 'SPACE') {
                setScene(SceneId.SPACE);
            }

            isInitializedRef.current = true;
        };

        syncStateFromUrl();

        const handlePopState = () => {
            syncStateFromUrl();
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [checkExistingAuth, setScene, enterPlanetSurface, exitPlanetSurface, startExperience]);

    // 2. Dynamic Address Bar URL Sync (without page refresh)
    useEffect(() => {
        if (typeof window === 'undefined' || !isInitializedRef.current) return;

        let targetPath = '/solar-system';

        if (phase === 'hidden_universe' || isDay10Revealing) {
            targetPath = '/day10/singularity';
        } else if (currentScene === SceneId.SOLAR_SYSTEM) {
            if (activePuzzlePlanetId) {
                targetPath = `/planet/${activePuzzlePlanetId}/gift`;
            } else if (planetViewMode === 'surface' && selectedPlanetId) {
                targetPath = `/planet/${selectedPlanetId}`;
            } else {
                targetPath = '/solar-system';
            }
        } else if (currentScene === SceneId.CELEBRATION) {
            targetPath = '/celebration';
        } else if (currentScene === SceneId.SPACE) {
            targetPath = '/space';
        }

        const currentPath = window.location.pathname;

        if (currentPath !== targetPath) {
            window.history.pushState(
                { scene: currentScene, planet: selectedPlanetId, mode: planetViewMode, puzzle: activePuzzlePlanetId, phase },
                '',
                targetPath
            );
        }
    }, [currentScene, planetViewMode, selectedPlanetId, activePuzzlePlanetId, phase, isDay10Revealing]);
}
