"use server";

import {
  isMockDomainError,
  type PostDraft,
  type Visibility,
} from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

export type PublishActionResult = { success: true } | { success: false; error: string };

export type FacebookDraftPayload = {
  id: string;
  gameId: string;
  title: string | null;
  body: string;
  version: number;
  postedAt?: string;
  postedUrl?: string;
};

export type FacebookDraftActionResult =
  | { success: true; draft: FacebookDraftPayload }
  | { success: false; error: string };

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

function toDraftPayload(draft: PostDraft): FacebookDraftPayload {
  return {
    id: draft.id,
    gameId: draft.gameId,
    title: draft.title,
    body: draft.body,
    version: draft.version,
    postedAt: draft.postedAt,
    postedUrl: draft.postedUrl,
  };
}

async function revalidateDraftGame(gameId: string): Promise<string | null> {
  const game = await getPlaymatesRepos().games.getById(gameId);
  if (!game) return null;
  revalidatePublish(game.sessionId);
  return game.sessionId;
}

/** Generate (or regenerate) a Facebook Group draft from matchup + asset URLs + settings hashtags. */
export async function generateDraft(gameId: string): Promise<FacebookDraftActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const game = await repos.games.getById(gameId);
    if (!game) {
      return { success: false, error: "Game not found" };
    }

    const draft = await repos.posts.generate(gameId);
    revalidatePublish(game.sessionId);
    return { success: true, draft: toDraftPayload(draft) };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not generate Facebook draft." };
  }
}

/** Persist edited caption and increment draft version. */
export async function updateDraft(
  draftId: string,
  body: string,
): Promise<FacebookDraftActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const draft = await repos.posts.update(draftId, body);
    await revalidateDraftGame(draft.gameId);
    return { success: true, draft: toDraftPayload(draft) };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not save Facebook draft." };
  }
}

/** Manual “posted to Facebook Group” flag. The app never posts to Facebook. */
export async function markDraftPosted(
  draftId: string,
  url?: string,
): Promise<FacebookDraftActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const draft = await repos.posts.markPosted(draftId, url);
    await revalidateDraftGame(draft.gameId);
    return { success: true, draft: toDraftPayload(draft) };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not mark Facebook draft posted." };
  }
}

export async function unmarkDraftPosted(draftId: string): Promise<FacebookDraftActionResult> {
  try {
    const repos = getPlaymatesRepos();
    const draft = await repos.posts.unmarkPosted(draftId);
    await revalidateDraftGame(draft.gameId);
    return { success: true, draft: toDraftPayload(draft) };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not unmark Facebook draft." };
  }
}
