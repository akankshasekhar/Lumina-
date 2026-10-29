import type { SoundscapeType } from '../types';

/**
 * Web Audio API procedural soundscape generator
 * Synthesizes peaceful background noise (Rain, Binaural Alpha 10Hz, Forest Wind, Room Tone)
 * without external audio downloads or network requests.
 */
class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'none';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume * 0.4, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentType(): SoundscapeType {
    return this.currentType;
  }

  public stop() {
    if (!this.ctx) return;
    try {
      this.activeNodes.forEach(node => {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {
            // Already stopped
          }
        } else if ('disconnect' in node) {
          node.disconnect();
        }
      });
    } catch {
      // Ignored
    }
    this.activeNodes = [];
    this.currentType = 'none';
  }

  public play(type: SoundscapeType) {
    this.stop();
    if (type === 'none') return;

    this.initContext();
    if (!this.ctx) return;

    this.currentType = type;
    const ctx = this.ctx;

    // Master gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
    master.connect(ctx.destination);
    this.gainNode = master;
    this.activeNodes.push(master);

    if (type === 'binaural') {
      this.createBinauralBeats(ctx, master);
    } else if (type === 'rain') {
      this.createRainSound(ctx, master);
    } else if (type === 'wind') {
      this.createWindSound(ctx, master);
    } else if (type === 'library') {
      this.createLibraryHum(ctx, master);
    }
  }

  private createBinauralBeats(ctx: AudioContext, destination: GainNode) {
    // 200 Hz carrier left, 210 Hz carrier right -> 10 Hz Alpha wave entrainment for calm focus
    const merger = ctx.createChannelMerger(2);
    merger.connect(destination);

    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, ctx.currentTime);

    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(210, ctx.currentTime);

    const gainL = ctx.createGain();
    gainL.gain.setValueAtTime(0.3, ctx.currentTime);
    const gainR = ctx.createGain();
    gainR.gain.setValueAtTime(0.3, ctx.currentTime);

    oscLeft.connect(gainL);
    gainL.connect(merger, 0, 0);

    oscRight.connect(gainR);
    gainR.connect(merger, 0, 1);

    // Warm pink noise underneath
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.05;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(destination);

    oscLeft.start();
    oscRight.start();
    whiteNoise.start();

    this.activeNodes.push(oscLeft, oscRight, whiteNoise, noiseFilter, gainL, gainR, merger);
  }

  private createRainSound(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter rain to sound like warm raindrops against glass
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1400, ctx.currentTime);

    noise.connect(filter);
    filter.connect(lowpass);
    lowpass.connect(destination);

    noise.start();
    this.activeNodes.push(noise, filter, lowpass);
  }

  private createWindSound(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    // Subtle gentle modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  private createLibraryHum(ctx: AudioContext, destination: GainNode) {
    // Deep warm room resonance (brownish low hum, soothing quiet room feeling)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    this.activeNodes.push(noise, filter);
  }
}

export const soundscapes = new SoundscapeEngine();
