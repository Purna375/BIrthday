import { create } from 'zustand';

export type RevealPhase =
    | 'idle'
    | 'accelerating_heartbeat'
    | 'aligning_planets'
    | 'opening_heart'
    | 'camera_diving'
    | 'white_flash'
    | 'hidden_universe';

interface RevealState {
    isDay10Revealing: boolean;
    phase: RevealPhase;
    heartBeatRate: number; // multiplier
    heartOpenAmount: number; // 0.0 to 1.0
    solarSystemGlow: number; // 0.0 to 1.0
    planetsAligned: boolean;
    whiteFlashOpacity: number; // 0.0 to 1.0
    heartWarningToast: string | null;

    // Actions
    triggerDay10Reveal: () => void;
    resetReveal: () => void;
    setPhase: (phase: RevealPhase) => void;
    setHeartBeatRate: (rate: number) => void;
    setHeartOpenAmount: (amount: number) => void;
    setSolarSystemGlow: (glow: number) => void;
    setPlanetsAligned: (aligned: boolean) => void;
    setWhiteFlashOpacity: (opacity: number) => void;
    showHeartWarningToast: (msg: string) => void;
}

export const useRevealStore = create<RevealState>((set) => ({
    isDay10Revealing: false,
    phase: 'idle',
    heartBeatRate: 1.0,
    heartOpenAmount: 0.0, // Default closed so it's a unified heart sun
    solarSystemGlow: 0.0,
    planetsAligned: false,
    whiteFlashOpacity: 0.0,
    heartWarningToast: null,

    triggerDay10Reveal: () => set({ isDay10Revealing: true, phase: 'accelerating_heartbeat' }),

    resetReveal: () =>
        set({
            isDay10Revealing: false,
            phase: 'idle',
            heartBeatRate: 1.0,
            heartOpenAmount: 0.0,
            solarSystemGlow: 0.0,
            planetsAligned: false,
            whiteFlashOpacity: 0.0,
            heartWarningToast: null,
        }),

    setPhase: (phase) => set({ phase }),
    setHeartBeatRate: (heartBeatRate) => set({ heartBeatRate }),
    setHeartOpenAmount: (heartOpenAmount) => set({ heartOpenAmount }),
    setSolarSystemGlow: (solarSystemGlow) => set({ solarSystemGlow }),
    setPlanetsAligned: (planetsAligned) => set({ planetsAligned }),
    setWhiteFlashOpacity: (whiteFlashOpacity) => set({ whiteFlashOpacity }),
    showHeartWarningToast: (msg: string) => {
        set({ heartWarningToast: msg });
        setTimeout(() => {
            set({ heartWarningToast: null });
        }, 4000);
    },
}));
