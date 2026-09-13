/**
 * Process-wide Playmates store (PNJ-015) with disk share for web + admin (PNJ-074).
 *
 * In-memory singleton still lives on `globalThis.__playmatesMock` so Next.js HMR
 * keeps one graph **per Node process**. `apps/web` and `apps/admin` do not share
 * that memory. Writes persist to `packages/mocks/.data/store.json`; `getState()`
 * reloads that file when present so both apps can demo the same graph.
 *
 * Never persist video bytes — recordings store metadata only (`sizeBytes`, names).
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { DEFAULT_FACEBOOK_HASHTAGS } from "./naming";
import { assertSeedInvariants, createSeedState, type MockState } from "./seed";

type PlaymatesGlobal = typeof globalThis & {
  __playmatesMock?: MockState;
  __playmatesMockAsserted?: boolean;
  __playmatesMockStoreMtimeMs?: number;
};

const BINARY_KEYS = new Set([
  "bytes",
  "file",
  "buffer",
  "arrayBuffer",
  "blob",
  "data",
  "sourceBytes",
  "fileBytes",
  "videoBytes",
]);

function g(): PlaymatesGlobal {
  return globalThis as PlaymatesGlobal;
}

function resolveStorePath(): string {
  let dir = process.cwd();
  for (let i = 0; i < 10; i += 1) {
    const packageJson = join(dir, "packages/mocks/package.json");
    if (existsSync(packageJson)) {
      return join(dir, "packages/mocks/.data/store.json");
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return join(process.cwd(), "packages/mocks/.data/store.json");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikeMockState(value: unknown): value is MockState {
  if (!isPlainObject(value)) return false;
  const arrays = [
    "profiles",
    "players",
    "venues",
    "courts",
    "sessions",
    "sessionPlayers",
    "games",
    "gameTeams",
    "gameTeamPlayers",
    "recordings",
    "providerAssets",
    "uploadJobs",
    "postDrafts",
    "oauthConnections",
  ] as const;
  return arrays.every((key) => Array.isArray(value[key]));
}

function stripVideoBytes(value: unknown): unknown {
  if (value == null) return value;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return undefined;
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return undefined;
  if (Array.isArray(value)) return value.map(stripVideoBytes);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (BINARY_KEYS.has(key)) continue;
      out[key] = stripVideoBytes(nested);
    }
    return out;
  }
  return value;
}

function hydrateFromDiskIfPresent(): MockState | null {
  if (typeof process === "undefined" || typeof process.cwd !== "function") {
    return null;
  }

  const storePath = resolveStorePath();
  if (!existsSync(storePath)) {
    return null;
  }

  const mtimeMs = statSync(storePath).mtimeMs;
  const globalRef = g();
  if (globalRef.__playmatesMock && globalRef.__playmatesMockStoreMtimeMs === mtimeMs) {
    return globalRef.__playmatesMock;
  }

  try {
    const parsed: unknown = JSON.parse(readFileSync(storePath, "utf8"));
    if (!looksLikeMockState(parsed)) {
      return null;
    }
    globalRef.__playmatesMock = parsed;
    globalRef.__playmatesMockAsserted = false;
    globalRef.__playmatesMockStoreMtimeMs = mtimeMs;
    return parsed;
  } catch {
    return null;
  }
}

function ensureState(): MockState {
  const fromDisk = hydrateFromDiskIfPresent();
  const globalRef = g();
  if (fromDisk) {
    // Disk may diverge from seed after publish/unpublish — do not re-assert seed.
    globalRef.__playmatesMockAsserted = true;
    return fromDisk;
  }

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

/**
 * Persist the in-memory graph to `packages/mocks/.data/store.json`.
 * Call after every mutation. Safe no-op when `fs` is unavailable.
 */
export function persistState(): void {
  if (typeof process === "undefined" || typeof process.cwd !== "function") {
    return;
  }

  const state = g().__playmatesMock;
  if (!state) return;

  const storePath = resolveStorePath();
  mkdirSync(dirname(storePath), { recursive: true });
  const serializable = stripVideoBytes(state);
  writeFileSync(storePath, `${JSON.stringify(serializable, null, 2)}\n`, "utf8");
  try {
    g().__playmatesMockStoreMtimeMs = statSync(storePath).mtimeMs;
  } catch {
    g().__playmatesMockStoreMtimeMs = Date.now();
  }
}

/** Current singleton. Mutate in place; do not replace the object except via `resetState`. */
export function getState(): MockState {
  return ensureSettings(ensureState());
}

/** Replace the singleton with a fresh seed (21 Sep-9 recordings) and persist it. */
export function resetState(): void {
  const globalRef = g();
  globalRef.__playmatesMock = createSeedState();
  assertSeedInvariants(globalRef.__playmatesMock);
  globalRef.__playmatesMockAsserted = true;
  persistState();
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
