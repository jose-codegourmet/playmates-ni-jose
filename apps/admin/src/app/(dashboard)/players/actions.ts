"use server";

import { isMockDomainError, type Player } from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

import {
  type PlayerFormValues,
  playerFormSchema,
} from "./players-dialog/player-form/PlayerForm.schema";

export type PlayerActionResult =
  | { success: true; message: string; player: Player }
  | { success: false; error: string };

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? undefined : trimmed;
}

function nullableText(value: string | undefined): string | null {
  return optionalText(value) ?? null;
}

function revalidatePlayers() {
  revalidatePath("/players");
}

export async function createPlayer(data: PlayerFormValues): Promise<PlayerActionResult> {
  const parsed = playerFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const player = await getPlaymatesRepos().players.create({
      displayName: parsed.data.displayName.trim(),
      nickname: optionalText(parsed.data.nickname),
      facebookName: optionalText(parsed.data.facebookName),
      facebookUrl: optionalText(parsed.data.facebookUrl),
      notes: optionalText(parsed.data.notes),
    });
    revalidatePlayers();
    return { success: true, message: "Player created.", player };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not create player." };
  }
}

export async function updatePlayer(
  id: string,
  data: PlayerFormValues,
): Promise<PlayerActionResult> {
  const parsed = playerFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const player = await getPlaymatesRepos().players.update(id, {
      displayName: parsed.data.displayName.trim(),
      nickname: nullableText(parsed.data.nickname),
      facebookName: nullableText(parsed.data.facebookName),
      facebookUrl: nullableText(parsed.data.facebookUrl),
      notes: nullableText(parsed.data.notes),
    });
    revalidatePlayers();
    return { success: true, message: "Player updated.", player };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update player." };
  }
}

export async function archivePlayer(id: string): Promise<PlayerActionResult> {
  try {
    const player = await getPlaymatesRepos().players.archive(id);
    revalidatePlayers();
    return { success: true, message: "Player archived.", player };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not archive player." };
  }
}
