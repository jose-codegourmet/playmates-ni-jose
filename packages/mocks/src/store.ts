/**
 * Process-wide in-memory Playmates store (PNJ-015).
 * Seed arrays live on `globalThis.__playmatesMock` so Next.js HMR keeps one graph.
 */

import { DEFAULT_FACEBOOK_HASHTAGS } from "./naming";
import { assertSeedInvariants, createSeedState, type MockState } from "./seed";

type PlaymatesGlobal = typeof globalThis & {
  __playmatesMock?: MockState;
  __playmatesMockAsserted?: boolean;
};

function g(): PlaymatesGlobal {
  return globalThis as PlaymatesGlobal;
}

function ensureState(): MockState {
  const globalRef = g();
  if (!globalRef.__playmatesMock) {
    globalRef.__playmatesMock = createSeedState();
    assertSeedInvariants(globalRef.__playmatesMock);
    globalRef.__playmatesMockAsserted = true;
  } else if (!globalRef.__playmatesMockAsserted) {
    assertSeedInvariants(globalRef.__playmatesMock);
    globalRef.__playmatesMockAsserted = true;
  }
  return globalRef.__playmatesMock;
}

function ensureSettings(state: MockState): MockState {
  if (!state.settings) {
    state.settings = {
      facebookGroupUrl: "",
      defaultHashtags: DEFAULT_FACEBOOK_HASHTAGS,
    };
  }
  return state;
}

/** Current singleton. Mutate in place; do not replace the object except via `resetState`. */
export function getState(): MockState {
  return ensureSettings(ensureState());
}

/** Replace the singleton with a fresh seed (21 Sep-9 recordings). */
export function resetState(): void {
  const globalRef = g();
  globalRef.__playmatesMock = createSeedState();
  assertSeedInvariants(globalRef.__playmatesMock);
  globalRef.__playmatesMockAsserted = true;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function newId(): string {
  return crypto.randomUUID();
}

/**
 * Next unique slug. If `2026-09-09` exists, returns `2026-09-09-2`.
 */
export function uniqueSlug(base: string, taken: Iterable<string | null | undefined>): string {
  const existing = new Set(
    [...taken].filter((value): value is string => typeof value === "string" && value.length > 0),
  );
  if (!existing.has(base)) return base;
  let n = 2;
  let candidate = `${base}-${n}`;
  while (existing.has(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export function requireEntity<T>(entity: T | undefined | null, label: string, id: string): T {
  if (!entity) {
    throw new Error(`${label} not found: ${id}`);
  }
  return entity;
}
