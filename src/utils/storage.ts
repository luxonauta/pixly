import type { Pattern, TransportState } from "@/types";

const KEY = "chip8.pattern.v1";
const KEY_TS = "chip8.transport.v1";

const canUseLS = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const savePattern = (p: Pattern) => {
  try {
    if (canUseLS()) window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
};

export const loadPattern = (): Pattern | null => {
  try {
    if (!canUseLS()) return null;
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Pattern) : null;
  } catch {
    return null;
  }
};

export const saveTransport = (t: TransportState) => {
  try {
    if (canUseLS()) window.localStorage.setItem(KEY_TS, JSON.stringify(t));
  } catch {}
};

export const loadTransport = (): TransportState | null => {
  try {
    if (!canUseLS()) return null;
    const raw = window.localStorage.getItem(KEY_TS);
    return raw ? (JSON.parse(raw) as TransportState) : null;
  } catch {
    return null;
  }
};
