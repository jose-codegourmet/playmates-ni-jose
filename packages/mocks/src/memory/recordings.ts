import type { RecordingRepository } from "../repositories/types";
import { getState, newId, nowIso, requireEntity } from "../store";
import type { CameraSide, Recording } from "../types";

function normalizePartsSync(gameId: string, cameraSide: CameraSide): void {
  if (cameraSide === "UNASSIGNED") return;
  const state = getState();
  const group = state.recordings
    .filter((row) => row.gameId === gameId && row.cameraSide === cameraSide)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.partNumber - b.partNumber);
  const now = nowIso();
  group.forEach((recording, index) => {
    recording.partNumber = index + 1;
    recording.updatedAt = now;
  });
}

export function createRecordingRepository(): RecordingRepository {
  return {
    async listBySession(sessionId) {
      return getState()
        .recordings.filter((recording) => recording.sessionId === sessionId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },

    async createMany(sessionId, files) {
      const state = getState();
      requireEntity(
        state.sessions.find((row) => row.id === sessionId),
        "Session",
        sessionId,
      );
      let sortOrder = state.recordings
        .filter((row) => row.sessionId === sessionId)
        .reduce((max, row) => Math.max(max, row.sortOrder), -1);
      const now = nowIso();
      const created: Recording[] = files.map((file) => {
        sortOrder += 1;
        const recording: Recording = {
          id: newId(),
          sessionId,
          gameId: null,
          originalFilename: file.originalFilename,
          displayName: null,
          cameraSide: "UNASSIGNED",
          partNumber: 1,
          sortOrder,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          durationSeconds: null,
          capturedAt: null,
          localLastModifiedAt: file.localLastModifiedAt,
          checksum: null,
          notes: null,
          status: "imported",
          createdAt: now,
          updatedAt: now,
        };
        state.recordings.push(recording);
        return recording;
      });
      return created;
    },

    async assign(recordingId, patch) {
      const state = getState();
      const recording = requireEntity(
        state.recordings.find((row) => row.id === recordingId),
        "Recording",
        recordingId,
      );
      const oldGameId = recording.gameId;
      const oldSide = recording.cameraSide;
      recording.gameId = patch.gameId;
      recording.cameraSide = patch.cameraSide;
      if (patch.partNumber !== undefined) {
        recording.partNumber = patch.partNumber;
      }
      if (patch.gameId && patch.cameraSide !== "UNASSIGNED") {
        recording.status = recording.status === "imported" ? "organized" : recording.status;
      }
      recording.updatedAt = nowIso();

      if (oldGameId && oldSide !== "UNASSIGNED") {
        normalizePartsSync(oldGameId, oldSide);
      }
      if (
        recording.gameId &&
        recording.cameraSide !== "UNASSIGNED" &&
        (recording.gameId !== oldGameId || recording.cameraSide !== oldSide)
      ) {
        normalizePartsSync(recording.gameId, recording.cameraSide);
      }
      return recording;
    },

    async normalizeParts(gameId, cameraSide) {
      normalizePartsSync(gameId, cameraSide);
    },

    async update(id, patch) {
      const state = getState();
      const recording = requireEntity(
        state.recordings.find((row) => row.id === id),
        "Recording",
        id,
      );
      Object.assign(recording, patch, {
        id: recording.id,
        sessionId: recording.sessionId,
        createdAt: recording.createdAt,
        updatedAt: nowIso(),
      });
      return recording;
    },
  };
}
