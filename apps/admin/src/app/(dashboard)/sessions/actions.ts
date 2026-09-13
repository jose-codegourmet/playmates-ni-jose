"use server";

import { type ImportFileMeta, isMockDomainError } from "@fe-template/mocks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type SessionDetailsFormValues,
  sessionDetailsFormSchema,
} from "@/app/(dashboard)/sessions/[id]/details/details-form/SessionDetailsForm.schema";
import { getPlaymatesRepos } from "@/lib/playmates";
import {
  type SessionFormValues,
  sessionFormSchema,
} from "@/modules/playmates/session-form/SessionForm.schema";

export type CreateSessionResult = { success: false; error: string };
export type UpdateSessionResult = { success: true } | { success: false; error: string };

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? undefined : trimmed;
}

async function assertCourtBelongsToVenue(
  venueId: string | undefined,
  courtId: string | undefined,
): Promise<CreateSessionResult | null> {
  if (!courtId) return null;
  if (!venueId) {
    return { success: false, error: "Court must belong to the session venue" };
  }

  const courts = await getPlaymatesRepos().venues.listCourts(venueId);
  if (!courts.some((court) => court.id === courtId)) {
    return { success: false, error: "Court must belong to the session venue" };
  }

  return null;
}

export async function createSession(data: SessionFormValues): Promise<CreateSessionResult> {
  const parsed = sessionFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const venueId = optionalText(parsed.data.venueId);
  const courtId = optionalText(parsed.data.courtId);
  const title = optionalText(parsed.data.title);
  const notes = optionalText(parsed.data.notes);
  const playerIds = parsed.data.playerIds;

  const courtError = await assertCourtBelongsToVenue(venueId, courtId);
  if (courtError) return courtError;

  let sessionId: string;

  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.create({
      sessionDate: parsed.data.sessionDate,
      title,
      venueId,
      courtId,
      notes,
    });
    sessionId = session.id;

    if (playerIds.length > 0) {
      const allowed = new Set((await repos.players.list()).map((player) => player.id));
      await repos.sessions.setRoster(
        session.id,
        playerIds.filter((id) => allowed.has(id)),
      );
    }
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not create session." };
  }

  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/dashboard");
  redirect(`/sessions/${sessionId}`);
}

export async function updateSession(
  sessionId: string,
  data: SessionDetailsFormValues,
): Promise<UpdateSessionResult> {
  const parsed = sessionDetailsFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const venueId = optionalText(parsed.data.venueId) ?? null;
  const courtId = optionalText(parsed.data.courtId) ?? null;
  const title = optionalText(parsed.data.title) ?? null;
  const notes = optionalText(parsed.data.notes) ?? null;

  const courtError = await assertCourtBelongsToVenue(venueId ?? undefined, courtId ?? undefined);
  if (courtError) return courtError;

  try {
    const repos = getPlaymatesRepos();
    const existing = await repos.sessions.getById(sessionId);
    if (!existing) {
      return { success: false, error: "Session not found" };
    }

    await repos.sessions.update(sessionId, {
      sessionDate: parsed.data.sessionDate,
      title,
      venueId,
      courtId,
      notes,
      visibility: parsed.data.visibility,
      status: parsed.data.status,
    });
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update session." };
  }

  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/details`);
  revalidatePath("/dashboard");
  return { success: true };
}

export type SetSessionRosterResult = { success: true } | { success: false; error: string };

export async function setSessionRoster(
  sessionId: string,
  playerIds: string[],
): Promise<SetSessionRosterResult> {
  try {
    const repos = getPlaymatesRepos();
    const existing = await repos.sessions.getById(sessionId);
    if (!existing) {
      return { success: false, error: "Session not found" };
    }

    const allowed = new Set((await repos.players.list()).map((player) => player.id));
    const archivedOnRoster = new Set(existing.players.filter((p) => p.isArchived).map((p) => p.id));
    const nextIds = playerIds.filter((id) => allowed.has(id) || archivedOnRoster.has(id));

    await repos.sessions.setRoster(sessionId, nextIds);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update roster." };
  }

  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/players`);
  revalidatePath("/dashboard");
  revalidatePath("/players");
  return { success: true };
}

export type ImportSessionRecordingsResult =
  | { success: true; recordings: ImportSessionRecordingDto[] }
  | { success: false; error: string };

export type ImportSessionRecordingDto = {
  id: string;
  sessionId: string;
  originalFilename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  localLastModifiedAt: string | null;
  gameId: string | null;
  cameraSide: "A" | "B" | "UNASSIGNED";
};

export async function importSessionRecordings(
  sessionId: string,
  files: ImportFileMeta[],
): Promise<ImportSessionRecordingsResult> {
  if (files.length === 0) {
    return { success: false, error: "No files to import" };
  }

  try {
    const repos = getPlaymatesRepos();
    const existing = await repos.sessions.getById(sessionId);
    if (!existing) {
      return { success: false, error: "Session not found" };
    }

    const created = await repos.recordings.createMany(sessionId, files);
    const recordings = created.map((row) => ({
      id: row.id,
      sessionId: row.sessionId,
      originalFilename: row.originalFilename,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      localLastModifiedAt: row.localLastModifiedAt,
      gameId: row.gameId,
      cameraSide: row.cameraSide,
    }));

    revalidatePath("/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath(`/sessions/${sessionId}/import`);
    revalidatePath("/dashboard");
    return { success: true, recordings };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not import recordings." };
  }
}

async function bumpDraftSessionToOrganizing(sessionId: string): Promise<void> {
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(sessionId);
  if (detail?.session.status === "draft") {
    await repos.sessions.update(sessionId, { status: "organizing" });
  }
}

function revalidateOrganize(sessionId: string): void {
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/organize`);
  revalidatePath("/dashboard");
}

export type AssignRecordingResult = { success: true } | { success: false; error: string };

export async function assignRecording(
  sessionId: string,
  recordingId: string,
  patch: { gameId: string | null; cameraSide: "A" | "B" | "UNASSIGNED" },
): Promise<AssignRecordingResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const recordings = await repos.recordings.listBySession(sessionId);
    if (!recordings.some((row) => row.id === recordingId)) {
      return { success: false, error: "Recording not found in this session" };
    }

    if (patch.gameId) {
      const games = await repos.games.listBySession(sessionId);
      if (!games.some((game) => game.id === patch.gameId)) {
        return { success: false, error: "Game not found in this session" };
      }
    }

    const current = recordings.find((row) => row.id === recordingId);
    await repos.recordings.assign(recordingId, {
      gameId: patch.gameId,
      cameraSide: patch.cameraSide,
    });

    if (current?.gameId && (current.cameraSide === "A" || current.cameraSide === "B")) {
      await repos.recordings.normalizeParts(current.gameId, current.cameraSide);
    }
    if (patch.gameId && (patch.cameraSide === "A" || patch.cameraSide === "B")) {
      await repos.recordings.normalizeParts(patch.gameId, patch.cameraSide);
    }

    await bumpDraftSessionToOrganizing(sessionId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not assign recording." };
  }

  revalidateOrganize(sessionId);
  return { success: true };
}

export type ReorderLaneRecordingsResult = { success: true } | { success: false; error: string };

export async function reorderLaneRecordings(
  sessionId: string,
  gameId: string | null,
  cameraSide: "A" | "B" | "UNASSIGNED",
  recordingIds: string[],
): Promise<ReorderLaneRecordingsResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const recordings = await repos.recordings.listBySession(sessionId);
    const allowed = new Set(recordings.map((row) => row.id));
    if (recordingIds.some((id) => !allowed.has(id))) {
      return { success: false, error: "Recording not found in this session" };
    }

    if (gameId) {
      const games = await repos.games.listBySession(sessionId);
      if (!games.some((game) => game.id === gameId)) {
        return { success: false, error: "Game not found in this session" };
      }
    }

    await repos.recordings.reorderInLane(gameId, cameraSide, recordingIds);
    if (gameId && (cameraSide === "A" || cameraSide === "B")) {
      await repos.recordings.normalizeParts(gameId, cameraSide);
    }

    await bumpDraftSessionToOrganizing(sessionId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not reorder recordings." };
  }

  revalidateOrganize(sessionId);
  return { success: true };
}

export type CreateSessionGameResult = { success: true } | { success: false; error: string };

export async function createSessionGame(sessionId: string): Promise<CreateSessionGameResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    await repos.games.create(sessionId);
    await bumpDraftSessionToOrganizing(sessionId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not create game." };
  }

  revalidateOrganize(sessionId);
  return { success: true };
}

export type DeleteSessionGameResult = { success: true } | { success: false; error: string };

export async function deleteSessionGame(
  sessionId: string,
  gameId: string,
): Promise<DeleteSessionGameResult> {
  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const games = await repos.games.listBySession(sessionId);
    if (!games.some((game) => game.id === gameId)) {
      return { success: false, error: "Game not found in this session" };
    }

    await repos.games.delete(gameId);
    await bumpDraftSessionToOrganizing(sessionId);
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not remove game." };
  }

  revalidateOrganize(sessionId);
  return { success: true };
}
