export interface SoundTrack {
    id: string;
    src: string;
    loop?: boolean;
    volume?: number;
}

export interface AudioState {
    isMuted: boolean;
    volume: number;
    currentTrackId: string | null;
}
