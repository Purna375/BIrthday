'use client';

import React from 'react';
import AstraliaCarouselGift from './AstraliaCarouselGift';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function CouponsGift() {
    const closePlanetPuzzle = useExperienceStore((state) => state.closePlanetPuzzle);
    const closeVaultGift = useExperienceStore((state) => state.closeVaultGift);

    const handleClose = () => {
        closePlanetPuzzle();
        closeVaultGift();
    };

    return (
        <AstraliaCarouselGift onClose={handleClose} />
    );
}
