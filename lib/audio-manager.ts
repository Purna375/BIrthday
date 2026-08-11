import { Howl } from 'howler';
import { AUDIO_TRACKS } from '@/constants/audio';

class AudioManager {
    private sounds: Map<string, Howl> = new Map();
    private isMuted: boolean = false;
    private volume: number = 0.5;

    public preloadSound(id: string, src: string, options: Partial<ConstructorParameters<typeof Howl>[0]> = {}) {
        if (typeof window === 'undefined') return;
        if (this.sounds.has(id)) return;

        const sound = new Howl({
            src: [src],
            volume: this.volume,
            mute: this.isMuted,
            onloaderror: () => {
                // Silent catch for pending audio asset files
            },
            ...options,
        });

        this.sounds.set(id, sound);
    }

    public play(id: string) {
        if (typeof window === 'undefined') return;
        const sound = this.sounds.get(id);
        if (sound && sound.state() === 'loaded') {
            sound.play();
        }
    }

    public stop(id: string) {
        if (typeof window === 'undefined') return;
        const sound = this.sounds.get(id);
        if (sound) {
            sound.stop();
        }
    }

    public setMute(muted: boolean) {
        this.isMuted = muted;
        this.sounds.forEach((sound) => sound.mute(muted));
    }

    public setVolume(volume: number) {
        this.volume = volume;
        this.sounds.forEach((sound) => sound.volume(volume));
    }

    public initDefaultTracks() {
        if (typeof window === 'undefined') return;
        Object.values(AUDIO_TRACKS).forEach((track) => {
            this.preloadSound(track.id, track.src, {
                loop: track.loop,
                volume: track.volume,
            });
        });
    }
}

export const audioManager = new AudioManager();
