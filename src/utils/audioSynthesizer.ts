// Browser-based audio synthesizer using Web Audio API
// No external MP3 downloads required! Works 100% offline.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentAmbientNode: { stop: () => void } | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pleasant positive chime when completing a task
  playSuccessChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Arpeggio notes: C5, E5, G5, C6 (523Hz, 659Hz, 783Hz, 1046Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((freq, index) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        noteGain.gain.setValueAtTime(0, now + index * 0.08);
        noteGain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.6);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.65);
      });
    } catch {
      // Audio might be blocked before first user gesture
    }
  }

  // Tibetan Singing Bowl / Gong for starting focus session
  playTibetanBowl() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const baseFreq = 220; // A3

      [1, 2.76, 5.4, 8.9].forEach((harmonic, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * harmonic, now);

        const initialVol = 0.2 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch {
      // Audio context error handler
    }
  }

  // Start continuous ambient focus audio
  startAmbient(type: 'brown_noise' | 'rain' | 'cafe' | 'forest') {
    this.stopAmbient();
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      if (type === 'brown_noise') {
        this.currentAmbientNode = this.createBrownNoise();
      } else if (type === 'rain') {
        this.currentAmbientNode = this.createRainSound();
      } else if (type === 'cafe') {
        this.currentAmbientNode = this.createCafeAmbiance();
      } else if (type === 'forest') {
        this.currentAmbientNode = this.createForestSound();
      }
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  }

  stopAmbient() {
    if (this.currentAmbientNode) {
      this.currentAmbientNode.stop();
      this.currentAmbientNode = null;
    }
  }

  private createBrownNoise() {
    if (!this.ctx || !this.masterGain) return { stop: () => {} };
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.5; // Gain boost
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    return {
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {}
      }
    };
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return { stop: () => {} };
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    return {
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {}
      }
    };
  }

  private createCafeAmbiance() {
    if (!this.ctx || !this.masterGain) return { stop: () => {} };
    // Warm low drone simulating coffee shop hum
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(130, this.ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(164.8, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();

    return {
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          osc1.disconnect();
          osc2.disconnect();
        } catch {}
      }
    };
  }

  private createForestSound() {
    if (!this.ctx || !this.masterGain) return { stop: () => {} };
    // Gentle pink/green noise with light breeze sweep
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.1614264;
      b2 = 0.57000 * b2 + white * 0.4411326;
      data[i] = (b0 + b1 + b2) * 0.1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    return {
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {}
      }
    };
  }
}

export const soundFx = new SoundSynthesizer();
