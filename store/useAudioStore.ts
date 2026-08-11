import { create } from 'zustand';
import { synthSFX } from '@/lib/synthSFX';

interface AudioState {
    isMuted: boolean;
    volume: number; // 0.0 to 1.0
    isAutoplayBlocked: boolean;
    activeTrack: string | null;

    // Actions
    setMuted: (muted: boolean) => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    setAutoplayBlocked: (blocked: boolean) => void;
    unlockAudio: () => void;

    // Playback triggers
    playHover: () => void;
    playTransition: () => void;
    playHeartbeat: () => void;
    playCommunicatorChime: () => void;
    playTypewriterClick: () => void;
    playSuccessSFX: () => void;
    playClick: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    isMuted: false,
    volume: 0.7,
    isAutoplayBlocked: false,
    activeTrack: null,

    setMuted: (muted) => set({ isMuted: muted }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

    setAutoplayBlocked: (blocked) => set({ isAutoplayBlocked: blocked }),

    unlockAudio: () => {
        synthSFX.unlockAudioContext();
        set({ isAutoplayBlocked: false });
    },

    playHover: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playHover(volume * 0.2);
    },

    playTransition: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playTransition(volume * 0.35);
    },

    playHeartbeat: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playHeartbeat(volume * 0.4);
    },

    playCommunicatorChime: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playCommunicatorChime(volume * 0.45);
    },

    playTypewriterClick: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playTypewriterClick(volume * 0.25);
    },

    playSuccessSFX: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playCommunicatorChime(volume * 0.6);
    },

    playClick: () => {
        const { isMuted, volume } = get();
        if (isMuted || volume === 0) return;
        synthSFX.playTypewriterClick(volume * 0.3);
    },
}));
