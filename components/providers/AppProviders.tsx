'use client';

import React, { useEffect } from 'react';
import { useExperienceStore } from '@/store/useExperienceStore';

interface AppProvidersProps {
    children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
    const setLoaded = useExperienceStore((state) => state.setLoaded);
    const setLoadingProgress = useExperienceStore((state) => state.setLoadingProgress);

    useEffect(() => {
        // Starter progress simulation for initial asset loading
        setLoadingProgress(25, 'Loading core engines...');
        const timer1 = setTimeout(() => setLoadingProgress(60, 'Preloading 3D scenes...'), 300);
        const timer2 = setTimeout(() => setLoadingProgress(90, 'Configuring audio ambient...'), 600);
        const timer3 = setTimeout(() => {
            setLoadingProgress(100, 'Ready');
            setLoaded(true);
        }, 900);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [setLoaded, setLoadingProgress]);

    return <>{children}</>;
}
