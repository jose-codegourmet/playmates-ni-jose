import { createGameRepository } from "./memory/games";
import { createPlayerRepository } from "./memory/players";
import { createPostDraftRepository } from "./memory/posts";
import { createPublishRepository } from "./memory/publish";
import { createRecordingRepository } from "./memory/recordings";
import { createSessionRepository } from "./memory/sessions";
import { createUploadRepository } from "./memory/uploads";
import { createVenueRepository } from "./memory/venues";
import type { PlaymatesRepos } from "./repositories/types";
import { getState } from "./store";

let cached: PlaymatesRepos | undefined;

/** In-memory Playmates repositories bound to the process singleton. */
export function getPlaymatesRepos(): PlaymatesRepos {
  getState();
  if (!cached) {
    cached = {
      players: createPlayerRepository(),
      venues: createVenueRepository(),
      sessions: createSessionRepository(),
      games: createGameRepository(),
      recordings: createRecordingRepository(),
      uploads: createUploadRepository(),
      publish: createPublishRepository(),
      posts: createPostDraftRepository(),
    };
  }
  return cached;
}
