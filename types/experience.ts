import { SceneId } from './scene';

export interface LoadingState {
    progress: number; // 0 to 100
    isLoaded: boolean;
    currentTask?: string;
}

export interface ExperienceState {
    currentScene: SceneId;
    loading: LoadingState;
    isStarted: boolean;
    isMuted: boolean;
    volume: number;
    activeInteractiveId: string | null;
    isWarping: boolean;
    warpProgress: number; // 0 to 1

    // Password & Security State
    isAuthenticated: boolean;
    authToken: string | null;
    isPasswordModalOpen: boolean;
    isPasswordError: boolean;
    isPasswordSuccess: boolean;

    // Solar System Selected Planet State
    selectedPlanetId: string | null;
    planetViewMode: 'orbit' | 'zooming' | 'surface';

    // Planet Vault Puzzles & Supernova Blast State
    solvedPlanetIds: string[];
    activePuzzlePlanetId: string | null;
    isSupernovaBlasting: boolean;
    unlockedVaultGift: { planetId: string; dayNumber: number } | null;

    hasEnteredFromBlackHole: boolean;

    // Actions
    setScene: (scene: SceneId) => void;
    nextScene: () => void;
    prevScene: () => void;
    setLoadingProgress: (progress: number, task?: string) => void;
    setLoaded: (isLoaded: boolean) => void;
    startExperience: () => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    setActiveInteractiveId: (id: string | null) => void;
    triggerWarp: () => void;
    setWarpProgress: (progress: number) => void;
    resetWarp: () => void;
    setHasEnteredFromBlackHole: (val: boolean) => void;
    setPasswordModalOpen: (open: boolean) => void;
    setPasswordError: (error: boolean) => void;
    setPasswordSuccess: (success: boolean) => void;
    verifyPassword: (inputPassword: string) => Promise<boolean>;
    checkExistingAuth: () => Promise<boolean>;
    logout: () => void;
    setSelectedPlanetId: (id: string | null) => void;
    enterPlanetSurface: (id: string) => void;
    exitPlanetSurface: () => void;
    setPlanetViewMode: (mode: 'orbit' | 'zooming' | 'surface') => void;

    // Puzzle & Vault Actions
    openPlanetPuzzle: (planetId: string) => void;
    closePlanetPuzzle: () => void;
    solvePlanetPuzzle: (planetId: string) => void;
    triggerSupernovaBlast: (planetId: string) => void;
    closeVaultGift: () => void;
}
