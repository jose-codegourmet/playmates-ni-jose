import { slugify } from "../naming";
import type { VenueRepository } from "../repositories/types";
import { getState, newId, nowIso, requireEntity, uniqueSlug } from "../store";
import type { Court, Venue } from "../types";

export function createVenueRepository(): VenueRepository {
  return {
    async list() {
      return getState().venues.filter((venue) => !venue.isArchived);
    },

    async getById(id) {
      return getState().venues.find((venue) => venue.id === id) ?? null;
    },

    async getBySlug(slug) {
      return getState().venues.find((venue) => venue.slug === slug) ?? null;
    },

    async create(input) {
      const state = getState();
      const now = nowIso();
      const base = slugify(input.name) || "venue";
      const venue: Venue = {
        id: newId(),
        name: input.name,
        slug: uniqueSlug(
          base,
          state.venues.map((row) => row.slug),
        ),
        address: input.address ?? null,
        notes: input.notes ?? null,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      };
      state.venues.push(venue);
      return venue;
    },

    async update(id, patch) {
      const state = getState();
      const venue = requireEntity(
        state.venues.find((row) => row.id === id),
        "Venue",
        id,
      );
      Object.assign(venue, patch, {
        id: venue.id,
        createdAt: venue.createdAt,
        updatedAt: nowIso(),
      });
      return venue;
    },

    async archive(id) {
      const state = getState();
      const venue = requireEntity(
        state.venues.find((row) => row.id === id),
        "Venue",
        id,
      );
      venue.isArchived = true;
      venue.updatedAt = nowIso();
      return venue;
    },

    async listCourts(venueId) {
      return getState()
        .courts.filter((court) => court.venueId === venueId && !court.isArchived)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },

    async addCourt(venueId, input) {
      const state = getState();
      requireEntity(
        state.venues.find((row) => row.id === venueId),
        "Venue",
        venueId,
      );
      const maxSort = state.courts
        .filter((court) => court.venueId === venueId)
        .reduce((max, court) => Math.max(max, court.sortOrder), 0);
      const court: Court = {
        id: newId(),
        venueId,
        name: input.name,
        sortOrder: maxSort + 1,
        isArchived: false,
      };
      state.courts.push(court);
      return court;
    },
  };
}
