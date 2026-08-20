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
    isDay10Unlocked: boolean;
    phase: RevealPhase;
    heartBeatRate: number; // multiplier
    heartOpenAmount: number; // 0.0 to 1.0
    solarSystemGlow: number; // 0.0 to 1.0
    planetsAligned: boolean;
    whiteFlashOpacity: number; // 0.0 to 1.0
    heartWarningToast: string | null;

    // Actions
    triggerDay10Reveal: () => void;
    openDay10Hub: () => void;
    closeDay10Hub: () => void;
    resetReveal: () => void;
    setPhase: (phase: RevealPhase) => void;
    hydrateReveal: () => void;
    setHeartBeatRate: (rate: number) => void;
    setHeartOpenAmount: (amount: number) => void;
    setSolarSystemGlow: (glow: number) => void;
    setPlanetsAligned: (aligned: boolean) => void;
    setWhiteFlashOpacity: (opacity: number) => void;
    showHeartWarningToast: (msg: string) => void;
}

const REVEAL_PHASE_KEY = 'singularity_day10_revealed';

function checkSavedDay10Unlocked(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const saved = localStorage.getItem(REVEAL_PHASE_KEY);
        return saved === 'hidden_universe' || saved === 'unlocked' || saved === 'true';
    } catch {}
    return false;
}

function saveRevealPhaseLocally(unlocked: boolean) {
    if (typeof window === 'undefined') return;
    try {
        if (unlocked) {
            localStorage.setItem(REVEAL_PHASE_KEY, 'unlocked');
        } else {
            localStorage.removeItem(REVEAL_PHASE_KEY);
        }
    } catch {}
}

const initialUnlocked = checkSavedDay10Unlocked();

export const useRevealStore = create<RevealState>((set) => ({
    isDay10Revealing: false,
    isDay10Unlocked: initialUnlocked,
    phase: 'idle',
    heartBeatRate: 1.0,
    heartOpenAmount: initialUnlocked ? 1.0 : 0.0,
    solarSystemGlow: initialUnlocked ? 1.0 : 0.0,
    planetsAligned: initialUnlocked,
    whiteFlashOpacity: 0.0,
    heartWarningToast: null,

    triggerDay10Reveal: () => {
        saveRevealPhaseLocally(true);
        set({ isDay10Revealing: true, isDay10Unlocked: true, phase: 'accelerating_heartbeat' });
    },

    openDay10Hub: () => {
        saveRevealPhaseLocally(true);
        set({
            phase: 'hidden_universe',
            isDay10Revealing: false,
            isDay10Unlocked: true,
            heartOpenAmount: 1.0,
            solarSystemGlow: 1.0,
            planetsAligned: true,
        });
    },

    closeDay10Hub: () => {
        set({ phase: 'idle', isDay10Revealing: false });
    },

    resetReveal: () => {
        saveRevealPhaseLocally(false);
        set({
            isDay10Revealing: false,
            isDay10Unlocked: false,
            phase: 'idle',
            heartBeatRate: 1.0,
            heartOpenAmount: 0.0,
            solarSystemGlow: 0.0,
            planetsAligned: false,
            whiteFlashOpacity: 0.0,
            heartWarningToast: null,
        });
    },

    setPhase: (phase) => {
        if (phase === 'hidden_universe') {
            saveRevealPhaseLocally(true);
            set({ phase, isDay10Unlocked: true });
        } else {
            set({ phase });
        }
    },

    hydrateReveal: () => {
        const isUnlocked = checkSavedDay10Unlocked();
        if (isUnlocked) {
            set({
                isDay10Unlocked: true,
                heartOpenAmount: 1.0,
                solarSystemGlow: 1.0,
                planetsAligned: true,
            });
        }
    },
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
