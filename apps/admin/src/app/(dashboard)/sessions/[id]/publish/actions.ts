"use server";

import { isMockDomainError, type Visibility } from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

export type PublishActionResult = { success: true } | { success: false; error: string };

export type PublishSessionOptions = {
  /**
   * When true, also publish every game in the session.
   * Default false: `publishSession` never auto-publishes games without the checkbox.
   */
  alsoPublishGames?: boolean;
};

/**
 * Admin `revalidatePath` only refreshes this Next process.
 *
 * `apps/web` is a different Node process and does **not** share the in-memory
 * mock singleton. Cross-app visibility depends on `packages/mocks/.data/store.json`
 * (PNJ-074). After publish/unpublish, refresh the public site (port 9000) so it
 * re-reads the file.
 */
function revalidatePublish(sessionId: string) {
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/publish`);
  revalidatePath("/dashboard");
}

async function requireSessionGame(
  sessionId: string,
  gameId: string,
): Promise<PublishActionResult | null> {
  const repos = getPlaymatesRepos();
  const session = await repos.sessions.getById(sessionId);
  if (!session) {
    return { success: false, error: "Session not found" };
  }

  const games = await repos.games.listBySession(sessionId);
  if (!games.some((game) => game.id === gameId)) {
    return { success: false, error: "Game not found in this session" };
  }

  return null;
}

export async function publishSessionGame(
  sessionId: string,
  gameId: string,
): Promise<PublishActionResult> {
  try {
    const missing = await requireSessionGame(sessionId, gameId);
    if (missing) return missing;

    await getPlaymatesRepos().publish.publishGame(gameId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not publish game." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function unpublishSessionGame(
  sessionId: string,
  gameId: string,
): Promise<PublishActionResult> {
  try {
    const missing = await requireSessionGame(sessionId, gameId);
    if (missing) return missing;

    await getPlaymatesRepos().publish.unpublishGame(gameId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not unpublish game." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function publishAllSessionGames(sessionId: string): Promise<PublishActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const games = await repos.games.listBySession(sessionId);
    for (const game of games) {
      await repos.publish.publishGame(game.id);
    }
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not publish games." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function publishWorkspaceSession(
  sessionId: string,
  options: PublishSessionOptions = {},
): Promise<PublishActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    await repos.publish.publishSession(sessionId);

    if (options.alsoPublishGames) {
      const games = await repos.games.listBySession(sessionId);
      for (const game of games) {
        await repos.publish.publishGame(game.id);
      }
    }
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not publish session." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function unpublishWorkspaceSession(sessionId: string): Promise<PublishActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    await repos.publish.unpublishSession(sessionId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not unpublish session." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function setSessionPublishVisibility(
  sessionId: string,
  visibility: Visibility,
): Promise<PublishActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    await repos.sessions.update(sessionId, { visibility });
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update session visibility." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}

export async function setGamePublishVisibility(
  sessionId: string,
  gameId: string,
  visibility: Visibility,
): Promise<PublishActionResult> {
  try {
    const missing = await requireSessionGame(sessionId, gameId);
    if (missing) return missing;

    await getPlaymatesRepos().games.update(gameId, { visibility });
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update game visibility." };
  }

  revalidatePublish(sessionId);
  return { success: true };
}
