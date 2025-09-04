"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Pattern, StepValue, TransportState } from "@/types";
import { createEngine } from "@/utils/audio/engine";
import {
  generateDefaultPattern,
  labelForMidi,
  rootOptions
} from "@/utils/music";
import {
  loadPattern,
  loadTransport,
  savePattern,
  saveTransport
} from "@/utils/storage";

import { SequencerGrid } from "./sequencer-grid";
import { Transport } from "./transport";

export default function Composer() {
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [pattern, setPattern] = useState<Pattern>(
    () => loadPattern() ?? generateDefaultPattern()
  );
  const [bpm, setBpm] = useState<number>(() => loadTransport()?.bpm ?? 120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingStep, setPlayingStep] = useState(0);

  const handleToggle = useCallback(() => {
    const e = engineRef.current;

    if (!e) return;

    if (isPlaying) {
      e.stop();
      setIsPlaying(false);
    } else {
      e.init();
      e.setTempo(bpm);
      e.setPattern(pattern);
      e.play();
      setIsPlaying(true);
    }
  }, [bpm, pattern, isPlaying]);

  const toggleRef = useRef(handleToggle);

  useEffect(() => {
    toggleRef.current = handleToggle;
  }, [handleToggle]);

  useEffect(() => {
    const engine = createEngine();
    engineRef.current = engine;
    engine.setOnStep((s) => setPlayingStep(s));

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleRef.current();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      engine.stop();
    };
  }, []);

  useEffect(() => {
    const e = engineRef.current;

    if (!e) return;

    e.setTempo(bpm);
    saveTransport({ bpm, isPlaying, step: playingStep } as TransportState);
  }, [bpm, isPlaying, playingStep]);

  useEffect(() => {
    const e = engineRef.current;

    if (!e) return;

    e.setPattern(pattern);
    savePattern(pattern);
  }, [pattern]);

  const setStep = useCallback(
    (trackId: string, stepIdx: number, value: StepValue) => {
      setPattern((prev) => {
        const tracks = prev.tracks.map((t) =>
          t.id === trackId
            ? {
                ...t,
                steps: t.steps.map((v, i) => (i === stepIdx ? value : v))
              }
            : t
        );
        return { ...prev, tracks };
      });
    },
    []
  );

  const canExport = useMemo(() => {
    if (typeof window === "undefined") return false;

    const w = window as unknown as {
      AudioContext?: unknown;
      webkitAudioContext?: unknown;
    };
    const hasAudio = !!(w.AudioContext || w.webkitAudioContext);

    return hasAudio && !!engineRef.current && !!pattern?.tracks?.length;
  }, [pattern]);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify({ bpm, pattern }, null, 2)], {
      type: "application/json"
    });
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "chyp8-composition.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [bpm, pattern]);

  const handleImportJSON = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);

    if (typeof data?.bpm === "number") setBpm(data.bpm);
    if (data?.pattern?.tracks) setPattern(data.pattern as Pattern);
  }, []);

  const handleRenderWav = useCallback(async () => {
    let e = engineRef.current;

    if (!e) {
      e = createEngine();
      engineRef.current = e;
    }

    e.setTempo(bpm);
    e.setPattern(pattern);

    const blob = await e.renderWav(bpm, 2);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "chyp8-render.wav";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }, [bpm, pattern]);

  return (
    <section id="composer" className="container">
      <div className="header">
        <h2>Chyp8 Composer</h2>
        <p>Simple 8-bit step sequencer.</p>
      </div>
      <div className="toolbar">
        <button
          type="button"
          onClick={() => setPattern(generateDefaultPattern())}
        >
          New
        </button>
        <button type="button" onClick={handleExportJSON}>
          Export JSON
        </button>
        <label className="button">
          Import JSON
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportJSON(f);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
        </label>
        <button type="button" onClick={handleRenderWav} disabled={!canExport}>
          Render WAV
        </button>
      </div>
      <div className="settings">
        <div>
          <label htmlFor="root-select">Root</label>
          <select
            id="root-select"
            value={pattern.rootMidi}
            onChange={(e) =>
              setPattern((p) => ({ ...p, rootMidi: Number(e.target.value) }))
            }
          >
            {rootOptions.map((o) => (
              <option key={o.midi} value={o.midi}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <small>Scale: Major Pentatonic</small>
          <small>Root Note: {labelForMidi(pattern.rootMidi)}</small>
        </div>
      </div>
      <Transport
        bpm={bpm}
        isPlaying={isPlaying}
        onToggle={handleToggle}
        onBpm={setBpm}
      />
      <SequencerGrid
        pattern={pattern}
        playingStep={isPlaying ? playingStep : -1}
        onChangeStep={setStep}
      />
    </section>
  );
}
