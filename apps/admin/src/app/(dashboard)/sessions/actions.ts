"use server";

import { isMockDomainError } from "@fe-template/mocks";
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
