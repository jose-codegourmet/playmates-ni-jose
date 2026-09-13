import { formatRecordingDisplayName } from "../naming";
import type { RecordingRepository } from "../repositories/types";
import { getState, newId, nowIso, persistState, requireEntity } from "../store";
import type { CameraSide, Recording } from "../types";

function isAssignedSide(cameraSide: CameraSide): cameraSide is "A" | "B" {
  return cameraSide === "A" || cameraSide === "B";
}

function recordingsInLane(gameId: string | null, cameraSide: CameraSide): Recording[] {
  const state = getState();
  if (!gameId || cameraSide === "UNASSIGNED") {
    return state.recordings.filter((row) => row.gameId == null || row.cameraSide === "UNASSIGNED");
  }
  return state.recordings.filter((row) => row.gameId === gameId && row.cameraSide === cameraSide);
}

function normalizePartsSync(gameId: string, cameraSide: CameraSide): void {
  if (!isAssignedSide(cameraSide)) return;
  const state = getState();
  const game = state.games.find((row) => row.id === gameId);
  const group = recordingsInLane(gameId, cameraSide).sort(
    (a, b) => a.sortOrder - b.sortOrder || a.partNumber - b.partNumber,
  );
  const now = nowIso();
  const partCount = group.length;
  const gameNumber = game?.gameNumber ?? 1;
  group.forEach((recording, index) => {
    const partNumber = index + 1;
    recording.partNumber = partNumber;
    recording.sortOrder = index;
    recording.displayName = formatRecordingDisplayName({
      gameNumber,
      side: cameraSide,
      partNumber,
      partCount,
    });
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
      persistState();
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
      if (patch.gameId && isAssignedSide(patch.cameraSide)) {
        if (recording.status === "imported") {
          recording.status = "organized";
        }
        const siblings = recordingsInLane(patch.gameId, patch.cameraSide).filter(
          (row) => row.id !== recording.id,
        );
        recording.sortOrder = siblings.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
      } else {
        if (recording.status === "organized") {
          recording.status = "imported";
        }
        recording.displayName = null;
        recording.partNumber = 1;
        const siblings = recordingsInLane(null, "UNASSIGNED").filter(
          (row) => row.id !== recording.id,
        );
        recording.sortOrder = siblings.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
      }
      recording.updatedAt = nowIso();

      if (oldGameId && isAssignedSide(oldSide)) {
        normalizePartsSync(oldGameId, oldSide);
      }
      if (
        recording.gameId &&
        isAssignedSide(recording.cameraSide) &&
        (recording.gameId !== oldGameId || recording.cameraSide !== oldSide)
      ) {
        normalizePartsSync(recording.gameId, recording.cameraSide);
      }
      persistState();
      return recording;
    },

    async normalizeParts(gameId, cameraSide) {
      normalizePartsSync(gameId, cameraSide);
      persistState();
    },

    async reorderInLane(gameId, cameraSide, recordingIds) {
      const state = getState();
      const now = nowIso();
      recordingIds.forEach((id, index) => {
        const recording = state.recordings.find((row) => row.id === id);
        if (!recording) {
          return;
        }
        recording.sortOrder = index;
        recording.updatedAt = now;
      });
      if (gameId && isAssignedSide(cameraSide)) {
        normalizePartsSync(gameId, cameraSide);
      }
      persistState();
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
      persistState();
      return recording;
    },
  };
}
