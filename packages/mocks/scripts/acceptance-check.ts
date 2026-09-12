/**
 * PNJ-015 acceptance: sequential creates persist; resetState restores 21 Sep-9 recordings.
 * Run: node --experimental-strip-types scripts/acceptance-check.ts
 */

import { getPlaymatesRepos } from "../src/get-repos";
import { SEED_IDS } from "../src/seed";
import { resetState } from "../src/store";

async function main(): Promise<void> {
  resetState();
  const repos = getPlaymatesRepos();
  const first = await repos.players.create({ displayName: "Test" });
  const second = await repos.players.create({ displayName: "Test" });
  const listed = await repos.players.list();
  const ids = new Set(listed.map((player) => player.id));
  if (!ids.has(first.id) || !ids.has(second.id)) {
    throw new Error("Acceptance failed: sequential players.create rows missing from list()");
  }
  if (first.id === second.id) {
    throw new Error("Acceptance failed: sequential creates returned the same id");
  }

  await repos.players.create({ displayName: "Extra" });
  resetState();
  const after = (await getPlaymatesRepos().recordings.listBySession(SEED_IDS.sessions.sep9)).length;
  if (after !== 21) {
    throw new Error(`Acceptance failed: resetState() Sep-9 recordings === 21 (got ${after})`);
  }
  const playersAfter = await getPlaymatesRepos().players.list();
  if (playersAfter.some((player) => player.displayName === "Test")) {
    throw new Error("Acceptance failed: resetState() should drop created Test players");
  }

  console.log("PNJ-015 acceptance passed");
}

void main();
