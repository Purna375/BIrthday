export interface LetterContent {
    id: string;
    title: string;
    body: string;
    date?: string;
    author?: string;
}

export interface PhotoContent {
    id: string;
    title: string;
    url: string;
    caption?: string;
}

export interface VideoContent {
    id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
}

export interface VoiceNoteContent {
    id: string;
    title: string;
    audioUrl: string;
    duration?: string;
}

export interface MiniGameContent {
    id: string;
    title: string;
    type: 'memory-cards' | 'quiz' | 'constellation-connect' | 'puzzle';
    config?: Record<string, any>;
}

export interface PlanetCustomTheme {
    primaryColor?: string;
    backgroundBlur?: string;
    particleColor?: string;
    customBackgroundUrl?: string;
}

export interface PlanetContentSchema {
    letters?: LetterContent[];
    photos?: PhotoContent[];
    videos?: VideoContent[];
    voiceNotes?: VoiceNoteContent[];
    miniGames?: MiniGameContent[];
}

export interface PlanetData {
    id: string;
    name: string;
    dayNumber: number;
    description: string;
    orbitRadius: number;
    orbitSpeed: number;
    size: number;
    color: string;
    atmosphereColor: string;
    rotationSpeed: number;
    hasRings?: boolean;
    ringColor?: string;
    backgroundAudio?: string;
    customTheme?: PlanetCustomTheme;
    content?: PlanetContentSchema;
}
