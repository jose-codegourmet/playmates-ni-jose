"use server";

import {
  ASSET_EXISTS,
  applyUploadSimulation,
  isMockDomainError,
  type Provider,
} from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

export type EnqueueSessionUploadsResult =
  | { success: true; queued: number; skippedExisting: number }
  | { success: false; error: string };

export async function enqueueSessionUploads(
  sessionId: string,
  providers: Provider[],
): Promise<EnqueueSessionUploadsResult> {
  // Replace this action body with resumable upload later — see ROADMAP/11.
  applyUploadSimulation();

  if (providers.length === 0) {
    return { success: false, error: "Choose at least one provider" };
  }

  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const recordings = await repos.recordings.listBySession(sessionId);
    let queued = 0;
    let skippedExisting = 0;

    for (const recording of recordings) {
      for (const provider of providers) {
        try {
          await repos.uploads.enqueue(recording.id, provider);
          queued += 1;
        } catch (error) {
          if (isMockDomainError(error) && error.code === ASSET_EXISTS) {
            skippedExisting += 1;
            continue;
          }
          throw error;
        }
      }
    }

    revalidatePath("/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath(`/sessions/${sessionId}/upload`);
    revalidatePath("/dashboard");
    return { success: true, queued, skippedExisting };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not queue uploads." };
  }
}
