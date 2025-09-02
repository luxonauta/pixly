import type { Pattern, StepValue, Track, TransportState } from "@/types";
import { midiToFreq, resolveMidiFor } from "@/utils/music";

type OnStep = (s: number) => void;

type WithWebkitAudio = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private isPlaying = false;
  private currentStep = 0;
  private nextNoteTime = 0;
  private scheduleId: number | null = null;
  private lookahead = 0.025;
  private scheduleAhead = 0.12;
  private bpm = 120;
  private pattern: Pattern | null = null;
  private onStep: OnStep = () => {};

  init() {
    if (!this.ctx) {
      const w = window as WithWebkitAudio;
      const Ctx = w.AudioContext ?? w.webkitAudioContext;

      if (!Ctx) return;

      this.ctx = new Ctx();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.9;
      this.gain.connect(this.ctx.destination);
    }
  }

  setOnStep(fn: OnStep) {
    this.onStep = fn;
  }

  setTempo(bpm: number) {
    this.bpm = bpm;
  }

  setPattern(p: Pattern) {
    this.pattern = p;
  }

  getTransport(): TransportState {
    return { bpm: this.bpm, isPlaying: this.isPlaying, step: this.currentStep };
  }

  play() {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.pattern || this.isPlaying) return;

    void this.ctx.resume();
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime;
    this.schedule();
  }

  stop() {
    if (!this.isPlaying) return;

    this.isPlaying = false;

    if (this.scheduleId !== null) {
      clearInterval(this.scheduleId);
      this.scheduleId = null;
    }
  }

  private schedule() {
    const ctx = this.ctx;
    const pattern = this.pattern;

    if (!ctx || !pattern) return;
    if (this.scheduleId !== null) clearInterval(this.scheduleId);

    this.scheduleId = window.setInterval(() => {
      while (this.nextNoteTime < ctx.currentTime + this.scheduleAhead) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        const stepDur = 60 / this.bpm / 4;
        this.nextNoteTime += stepDur;
        this.currentStep = (this.currentStep + 1) % pattern.steps;
        this.onStep(this.currentStep);
      }
    }, this.lookahead * 1000);
  }

  private scheduleStep(stepIndex: number, time: number) {
    const ctx = this.ctx;
    const gain = this.gain;
    const pattern = this.pattern;

    if (!ctx || !gain || !pattern) return;

    const tracks = pattern.tracks;

    for (const t of tracks) {
      const v = t.steps[stepIndex] as StepValue;

      if (v === 0) continue;

      if (t.instrument === "noise") {
        this.triggerNoise(t, time);
      } else {
        const midi = resolveMidiFor(
          pattern.rootMidi,
          pattern.palette,
          t.octave,
          v
        );

        if (midi !== null) this.triggerOsc(t, midiToFreq(midi), time);
      }
    }
  }

  private triggerOsc(track: Track, freq: number, time: number) {
    const ctx = this.ctx;
    const gain = this.gain;

    if (!ctx || !gain) return;

    const osc = ctx.createOscillator();
    const vca = ctx.createGain();
    osc.type = track.instrument as OscillatorType;
    osc.frequency.setValueAtTime(freq, time);
    vca.gain.setValueAtTime(0, time);
    vca.gain.linearRampToValueAtTime(track.volume, time + 0.005);
    vca.gain.linearRampToValueAtTime(0.0001, time + 0.12);
    osc.connect(vca).connect(gain);
    const dur = 0.14;
    osc.start(time);
    osc.stop(time + dur);
  }

  private triggerNoise(track: Track, time: number) {
    const ctx = this.ctx;
    const gain = this.gain;

    if (!ctx || !gain) return;

    const dur = 0.12;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const vca = ctx.createGain();
    vca.gain.setValueAtTime(0, time);
    vca.gain.linearRampToValueAtTime(track.volume, time + 0.003);
    vca.gain.linearRampToValueAtTime(0.0001, time + dur);
    src.connect(vca).connect(gain);
    src.start(time);
  }

  async renderWav(bpm: number, bars: number): Promise<Blob | null> {
    const pattern = this.pattern;

    if (!pattern) return null;

    const sampleRate = 44100;
    const totalTime = bars * (60 / bpm) * 4;
    const length = Math.ceil(sampleRate * totalTime);
    const actx = new OfflineAudioContext(1, length, sampleRate);
    const master = actx.createGain();
    master.gain.value = 0.9;
    master.connect(actx.destination);
    const stepDur = 60 / bpm / 4;

    let time = 0;

    for (let s = 0; s < pattern.steps * bars; s++) {
      const idx = s % pattern.steps;

      for (const t of pattern.tracks) {
        const v = t.steps[idx] as StepValue;

        if (v === 0) continue;

        if (t.instrument === "noise") {
          const dur = 0.12;
          const bufferSize = Math.floor(sampleRate * dur);
          const buffer = actx.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);

          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const src = actx.createBufferSource();
          const vca = actx.createGain();
          vca.gain.setValueAtTime(0, time);
          vca.gain.linearRampToValueAtTime(t.volume, time + 0.003);
          vca.gain.linearRampToValueAtTime(0.0001, time + dur);
          src.buffer = buffer;
          src.connect(vca).connect(master);
          src.start(time);
        } else {
          const midi = resolveMidiFor(
            pattern.rootMidi,
            pattern.palette,
            t.octave,
            v
          );

          if (midi !== null) {
            const freq = midiToFreq(midi);
            const osc = actx.createOscillator();
            const vca = actx.createGain();
            osc.type = t.instrument as OscillatorType;
            osc.frequency.setValueAtTime(freq, time);
            vca.gain.setValueAtTime(0, time);
            vca.gain.linearRampToValueAtTime(t.volume, time + 0.005);
            vca.gain.linearRampToValueAtTime(0.0001, time + 0.12);
            osc.connect(vca).connect(master);
            osc.start(time);
            osc.stop(time + 0.14);
          }
        }
      }

      time += stepDur;
    }

    const rendered = await actx.startRendering();
    const { bufferToWav } = await import("@/utils/wav");

    return bufferToWav(rendered);
  }
}

export const createEngine = () => new AudioEngine();
