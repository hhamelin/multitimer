class SoundEngine {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playAlarmSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const tones = [783.99, 1046.50, 1318.51];
      
      tones.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.15);

        gain.gain.setValueAtTime(0.001, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.3, now + index * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.15 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.45);
      });
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
