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
    hydrateReveal: () => void;
    setHeartBeatRate: (rate: number) => void;
    setHeartOpenAmount: (amount: number) => void;
    setSolarSystemGlow: (glow: number) => void;
    setPlanetsAligned: (aligned: boolean) => void;
    setWhiteFlashOpacity: (opacity: number) => void;
    showHeartWarningToast: (msg: string) => void;
}

const REVEAL_PHASE_KEY = 'singularity_day10_revealed';

function getSavedRevealPhase(): { phase: RevealPhase; isRevealed: boolean } {
    if (typeof window === 'undefined') return { phase: 'idle', isRevealed: false };
    try {
        const saved = localStorage.getItem(REVEAL_PHASE_KEY);
        if (saved === 'hidden_universe') {
            return { phase: 'hidden_universe', isRevealed: true };
        }
    } catch {}
    return { phase: 'idle', isRevealed: false };
}

function saveRevealPhaseLocally(phase: RevealPhase) {
    if (typeof window === 'undefined') return;
    try {
        if (phase === 'hidden_universe') {
            localStorage.setItem(REVEAL_PHASE_KEY, 'hidden_universe');
        } else if (phase === 'idle') {
            localStorage.removeItem(REVEAL_PHASE_KEY);
        }
    } catch {}
}

const initialReveal = getSavedRevealPhase();

export const useRevealStore = create<RevealState>((set) => ({
    isDay10Revealing: initialReveal.isRevealed,
    phase: initialReveal.phase,
    heartBeatRate: 1.0,
    heartOpenAmount: initialReveal.isRevealed ? 1.0 : 0.0,
    solarSystemGlow: initialReveal.isRevealed ? 1.0 : 0.0,
    planetsAligned: initialReveal.isRevealed,
    whiteFlashOpacity: 0.0,
    heartWarningToast: null,

    triggerDay10Reveal: () => set({ isDay10Revealing: true, phase: 'accelerating_heartbeat' }),

    resetReveal: () => {
        saveRevealPhaseLocally('idle');
        set({
            isDay10Revealing: false,
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
        saveRevealPhaseLocally(phase);
        set({ phase });
    },

    hydrateReveal: () => {
        const saved = getSavedRevealPhase();
        if (saved.isRevealed) {
            set({
                isDay10Revealing: true,
                phase: saved.phase,
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
