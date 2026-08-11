import { create } from 'zustand';
import { ExperienceState } from '@/types/experience';
import { SceneId } from '@/types/scene';
import { INITIAL_SCENE, SCENE_ORDER } from '@/constants/scenes';
import { DEFAULT_VOLUME } from '@/constants/audio';

const TOKEN_KEY = 'singularity_auth_token';

function getCookieToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + TOKEN_KEY + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function saveTokenLocally(token: string) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {}
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearTokenLocally() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {}
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
    currentScene: INITIAL_SCENE,
    loading: {
        progress: 0,
        isLoaded: false,
        currentTask: 'Initializing experience...',
    },
    isStarted: false,
    isMuted: false,
    volume: DEFAULT_VOLUME,
    activeInteractiveId: null,
    isWarping: false,
    warpProgress: 0,
    hasEnteredFromBlackHole: false,

    // Password & Security State (with 30-day Auth Token)
    isAuthenticated: false,
    authToken: null,
    isPasswordModalOpen: false,
    isPasswordError: false,
    isPasswordSuccess: false,

    // Solar System Planet Focus State
    selectedPlanetId: null,
    planetViewMode: 'orbit',

    // Planet Vault Puzzles & Supernova Blast State
    solvedPlanetIds: [],
    activePuzzlePlanetId: null,
    isSupernovaBlasting: false,
    unlockedVaultGift: null,

    setScene: (scene: SceneId) => set({ currentScene: scene }),

    nextScene: () => {
        const { currentScene } = get();
        const currentIndex = SCENE_ORDER.indexOf(currentScene);
        if (currentIndex < SCENE_ORDER.length - 1) {
            set({ currentScene: SCENE_ORDER[currentIndex + 1] });
        }
    },

    prevScene: () => {
        const { currentScene } = get();
        const currentIndex = SCENE_ORDER.indexOf(currentScene);
        if (currentIndex > 0) {
            set({ currentScene: SCENE_ORDER[currentIndex - 1] });
        }
    },

    setLoadingProgress: (progress: number, currentTask?: string) =>
        set((state) => ({
            loading: {
                ...state.loading,
                progress: Math.min(100, Math.max(0, progress)),
                ...(currentTask ? { currentTask } : {}),
            },
        })),

    setLoaded: (isLoaded: boolean) =>
        set((state) => ({
            loading: {
                ...state.loading,
                isLoaded,
                progress: isLoaded ? 100 : state.loading.progress,
            },
        })),

    startExperience: () => set({ isStarted: true }),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setVolume: (volume: number) => set({ volume: Math.min(1, Math.max(0, volume)) }),

    setActiveInteractiveId: (id: string | null) => set({ activeInteractiveId: id }),

    triggerWarp: () => set({ isWarping: true, warpProgress: 0, hasEnteredFromBlackHole: true }),

    setWarpProgress: (progress: number) => set({ warpProgress: Math.min(1, Math.max(0, progress)) }),

    resetWarp: () => set({ isWarping: false, warpProgress: 0 }),

    setHasEnteredFromBlackHole: (val: boolean) => set({ hasEnteredFromBlackHole: val }),

    setPasswordModalOpen: (open: boolean) =>
        set({ isPasswordModalOpen: open, isPasswordError: false, isPasswordSuccess: false }),

    setPasswordError: (error: boolean) => set({ isPasswordError: error }),

    setPasswordSuccess: (success: boolean) => set({ isPasswordSuccess: success }),

    verifyPassword: async (inputPassword: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: inputPassword }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (data.token) {
                    saveTokenLocally(data.token);
                }
                set({
                    isAuthenticated: true,
                    authToken: data.token || null,
                    isPasswordError: false,
                    isPasswordSuccess: true,
                });
                setTimeout(() => {
                    set({ isPasswordModalOpen: false });
                    get().triggerWarp();
                }, 1200);
                return true;
            } else {
                set({ isPasswordError: true, isPasswordSuccess: false });
                setTimeout(() => set({ isPasswordError: false }), 2000);
                return false;
            }
        } catch {
            const fallbackPassword = process.env.NEXT_PUBLIC_BIRTHDAY_PASSWORD || 'birthday2026';
            const isCorrect = inputPassword.trim() === fallbackPassword.trim();

            if (isCorrect) {
                const fakeToken = `singularity_fallback_${Date.now()}`;
                saveTokenLocally(fakeToken);
                set({
                    isAuthenticated: true,
                    authToken: fakeToken,
                    isPasswordError: false,
                    isPasswordSuccess: true,
                });
                setTimeout(() => {
                    set({ isPasswordModalOpen: false });
                    get().triggerWarp();
                }, 1200);
                return true;
            } else {
                set({ isPasswordError: true, isPasswordSuccess: false });
                setTimeout(() => set({ isPasswordError: false }), 2000);
                return false;
            }
        }
    },

    checkExistingAuth: async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false;

        // Check 1. URL parameter (?token=...)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        // Check 2. localStorage
        let localToken: string | null = null;
        try {
            localToken = localStorage.getItem(TOKEN_KEY);
        } catch {}

        // Check 3. Document cookie
        const cookieToken = getCookieToken();

        const token = urlToken || localToken || cookieToken;

        if (!token) return false;

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (res.ok && data.success && data.valid) {
                saveTokenLocally(token);
                set({
                    isAuthenticated: true,
                    authToken: token,
                    isPasswordSuccess: true,
                    isPasswordModalOpen: false,
                });

                // Clean up ?token= from URL dynamically without page refresh
                if (urlToken && window.history.replaceState) {
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, '', cleanUrl);
                }
                return true;
            } else {
                clearTokenLocally();
                set({ isAuthenticated: false, authToken: null });
                return false;
            }
        } catch {
            if (token) {
                set({
                    isAuthenticated: true,
                    authToken: token,
                    isPasswordSuccess: true,
                    isPasswordModalOpen: false,
                });
                return true;
            }
            return false;
        }
    },

    logout: () => {
        clearTokenLocally();
        set({
            isAuthenticated: false,
            authToken: null,
            isPasswordSuccess: false,
        });
    },

    setSelectedPlanetId: (id: string | null) => {
        if (id) {
            set({ selectedPlanetId: id, planetViewMode: 'zooming' });
        } else {
            set({ selectedPlanetId: null, planetViewMode: 'orbit' });
        }
    },

    enterPlanetSurface: (id: string) => {
        set({ selectedPlanetId: id, planetViewMode: 'surface' });
    },

    exitPlanetSurface: () => {
        set({ selectedPlanetId: null, planetViewMode: 'orbit' });
    },

    setPlanetViewMode: (mode: 'orbit' | 'zooming' | 'surface') => {
        set({ planetViewMode: mode });
    },

    // Puzzle & Supernova Actions
    openPlanetPuzzle: (planetId: string) => set({ activePuzzlePlanetId: planetId }),

    closePlanetPuzzle: () => set({ activePuzzlePlanetId: null }),

    solvePlanetPuzzle: (planetId: string) => {
        const { solvedPlanetIds } = get();
        if (!solvedPlanetIds.includes(planetId)) {
            set({ solvedPlanetIds: [...solvedPlanetIds, planetId] });
        }
    },

    triggerSupernovaBlast: (planetId: string) => {
        set({ isSupernovaBlasting: true });
        setTimeout(() => {
            set({ isSupernovaBlasting: false });
            const dayNumberMap: Record<string, number> = {
                aetheria: 1,
                celestia: 2,
                verdantina: 3,
                solaria: 4,
                'aura-nova': 5,
                zephyria: 6,
                astralia: 7,
                'chronos-prime': 8,
                eternia: 9,
            };
            const dayNum = dayNumberMap[planetId] || 1;
            set({ unlockedVaultGift: { planetId, dayNumber: dayNum } });
        }, 2500);
    },

    closeVaultGift: () => set({ unlockedVaultGift: null }),
}));
