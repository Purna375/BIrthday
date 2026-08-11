import { SoundTrack } from '@/types/audio';

export const AUDIO_TRACKS: Record<string, SoundTrack> = {
    AMBIENT_SPACE: {
        id: 'ambient-space',
        src: '/audio/ambient-space.mp3',
        loop: true,
        volume: 0.5,
    },
    CELEBRATION_THEME: {
        id: 'celebration-theme',
        src: '/audio/celebration-theme.mp3',
        loop: true,
        volume: 0.6,
    },
    CLICK_SFX: {
        id: 'click-sfx',
        src: '/audio/click.mp3',
        loop: false,
        volume: 0.8,
    },
};

export const DEFAULT_VOLUME = 0.5;
