/**
 * Procedural Web Audio Synthesizer for instant, zero-latency SFX
 * (Hover shimmer, transition swoosh, organic human heartbeat pulse, communicator chime, typewriter clicks)
 */

class SynthSFX {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => { });
        }
        return this.ctx;
    }

    /**
     * Unlocks AudioContext on user gesture to bypass browser autoplay restrictions
     */
    public unlockAudioContext() {
        const ctx = this.getContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().then(() => {
                console.log('AudioContext successfully unlocked by user gesture.');
            });
        }
    }

    /**
     * Hover SFX: Soft celestial shimmer tone
     */
    public playHover(volume = 0.15) {
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch {
            // Ignore audio errors gracefully
        }
    }

    /**
     * RPG Typewriter Mechanical Click SFX
     */
    public playTypewriterClick(volume = 0.05) {
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            // Slight pitch variance for mechanical acoustic feel
            const pitch = 850 + Math.random() * 250;
            osc.frequency.setValueAtTime(pitch, now);

            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.025);
        } catch {
            // Ignore audio errors gracefully
        }
    }

    /**
     * Sci-Fi Communicator Chime SFX (Game dialogue entry)
     */
    public playCommunicatorChime(volume = 0.3) {
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5 note
            osc.frequency.setValueAtTime(880, now + 0.1); // A5 note

            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch {
            // Ignore audio errors gracefully
        }
    }

    /**
     * Transition SFX: Cosmic warp swoosh & chime
     */
    public playTransition(volume = 0.25) {
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.35);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch {
            // Ignore audio errors gracefully
        }
    }

    /**
     * Realistic Organic Human Heartbeat SFX: Deep warm duo-thud ("lub-dub")
     */
    public playHeartbeat(volume = 0.4) {
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;

            // --- Pulse 1 ("Lub"): Warm Low-Bass Thud ---
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            const filter1 = ctx.createBiquadFilter();

            filter1.type = 'lowpass';
            filter1.frequency.setValueAtTime(110, now);

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(55, now);
            osc1.frequency.exponentialRampToValueAtTime(25, now + 0.14);

            gain1.gain.setValueAtTime(volume * 0.9, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(ctx.destination);

            osc1.start(now);
            osc1.stop(now + 0.14);

            // --- Pulse 2 ("Dub", 140ms later): Soft Secondary Thud ---
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            const filter2 = ctx.createBiquadFilter();

            filter2.type = 'lowpass';
            filter2.frequency.setValueAtTime(90, now + 0.14);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(45, now + 0.14);
            osc2.frequency.exponentialRampToValueAtTime(20, now + 0.26);

            gain2.gain.setValueAtTime(volume * 0.65, now + 0.14);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

            osc2.connect(filter2);
            filter2.connect(gain2);
            gain2.connect(ctx.destination);

            osc2.start(now + 0.14);
            osc2.stop(now + 0.26);
        } catch {
            // Ignore audio errors gracefully
        }
    }
}

export const synthSFX = new SynthSFX();
