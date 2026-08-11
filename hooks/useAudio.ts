import { useEffect } from 'react';
import { useExperienceStore } from '@/store/useExperienceStore';
import { audioManager } from '@/lib/audio-manager';

export function useAudio() {
    const isMuted = useExperienceStore((state) => state.isMuted);
    const volume = useExperienceStore((state) => state.volume);
    const toggleMute = useExperienceStore((state) => state.toggleMute);
    const setVolume = useExperienceStore((state) => state.setVolume);

    useEffect(() => {
        audioManager.setMute(isMuted);
    }, [isMuted]);

    useEffect(() => {
        audioManager.setVolume(volume);
    }, [volume]);

    const playSound = (id: string) => {
        audioManager.play(id);
    };

    const stopSound = (id: string) => {
        audioManager.stop(id);
    };

    return {
        isMuted,
        volume,
        toggleMute,
        setVolume,
        playSound,
        stopSound,
    };
}
