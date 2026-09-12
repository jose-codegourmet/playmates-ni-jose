"use server";

import { type Court, isMockDomainError, type Venue } from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

import {
  type AddCourtFormValues,
  addCourtFormSchema,
} from "./[id]/add-court-form/AddCourtForm.schema";
import { type VenueFormValues, venueFormSchema } from "./venues-dialog/venue-form/VenueForm.schema";

export type VenueActionResult =
  | { success: true; message: string; warning?: string; venue: Venue }
  | { success: false; error: string };

export type CourtActionResult =
  | { success: true; message: string; warning?: string; court: Court }
  | { success: false; error: string };

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? undefined : trimmed;
}

function nullableText(value: string | undefined): string | null {
  return optionalText(value) ?? null;
}

function namesMatch(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function revalidateVenues(venueId?: string) {
  revalidatePath("/venues");
  if (venueId) revalidatePath(`/venues/${venueId}`);
}

async function venueNameWarning(name: string, excludeId?: string): Promise<string | undefined> {
  const venues = await getPlaymatesRepos().venues.list({ includeArchived: true });
  const duplicate = venues.find((venue) => venue.id !== excludeId && namesMatch(venue.name, name));
  if (!duplicate) return undefined;
  return `Another venue is already named “${duplicate.name}” (case-insensitive). Saved anyway — names are not required to be globally unique.`;
}

async function courtNameWarning(
  name: string,
  venueId: string,
  excludeId?: string,
): Promise<string | undefined> {
  const venues = await getPlaymatesRepos().venues.list({ includeArchived: true });
  const courtsByVenue = await Promise.all(
    venues.map(async (venue) => ({
      venue,
      courts: await getPlaymatesRepos().venues.listCourts(venue.id, { includeArchived: true }),
    })),
  );

  const sameVenue = courtsByVenue
    .find((entry) => entry.venue.id === venueId)
    ?.courts.find((court) => court.id !== excludeId && namesMatch(court.name, name));
  if (sameVenue) {
    return `This venue already has a court named “${sameVenue.name}” (case-insensitive). Saved anyway — names are not required to be unique.`;
  }

  const otherVenue = courtsByVenue.find((entry) =>
    entry.courts.some((court) => court.id !== excludeId && namesMatch(court.name, name)),
  );
  if (!otherVenue) return undefined;
  return `“${name.trim()}” is already used at ${otherVenue.venue.name}. Saved anyway — court names are not required to be globally unique. Session actions (PNJ-058) will still require a court to belong to the chosen venue.`;
}

export async function createVenue(data: VenueFormValues): Promise<VenueActionResult> {
  const parsed = venueFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const name = parsed.data.name.trim();
    const warning = await venueNameWarning(name);
    const venue = await getPlaymatesRepos().venues.create({
      name,
      address: optionalText(parsed.data.address),
      notes: optionalText(parsed.data.notes),
    });
    revalidateVenues(venue.id);
    return { success: true, message: "Venue created.", warning, venue };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not create venue." };
  }
}

export async function updateVenue(id: string, data: VenueFormValues): Promise<VenueActionResult> {
  const parsed = venueFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const name = parsed.data.name.trim();
    const warning = await venueNameWarning(name, id);
    const venue = await getPlaymatesRepos().venues.update(id, {
      name,
      address: nullableText(parsed.data.address),
      notes: nullableText(parsed.data.notes),
    });
    revalidateVenues(id);
    return { success: true, message: "Venue updated.", warning, venue };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update venue." };
  }
}

export async function archiveVenue(id: string): Promise<VenueActionResult> {
  try {
    const venue = await getPlaymatesRepos().venues.archive(id);
    revalidateVenues(id);
    return { success: true, message: "Venue archived.", venue };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not archive venue." };
  }
}

export async function addCourt(
  venueId: string,
  data: AddCourtFormValues,
): Promise<CourtActionResult> {
  const parsed = addCourtFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const name = parsed.data.name.trim();
    const warning = await courtNameWarning(name, venueId);
    const court = await getPlaymatesRepos().venues.addCourt(venueId, { name });
    revalidateVenues(venueId);
    return { success: true, message: "Court added.", warning, court };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not add court." };
  }
}

export async function archiveCourt(courtId: string): Promise<CourtActionResult> {
  try {
    const court = await getPlaymatesRepos().venues.archiveCourt(courtId);
    revalidateVenues(court.venueId);
    return { success: true, message: "Court archived.", court };
  } catch (error) {
    if (isMockDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not archive court." };
  }
}
