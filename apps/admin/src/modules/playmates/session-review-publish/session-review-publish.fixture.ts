import { FACEBOOK_GENERATE_PLACEHOLDER } from "./map-publish";
import type {
  SessionReviewPublishGame,
  SessionReviewPublishProps,
} from "./SessionReviewPublish.types";

function game(n: number, extras: Partial<SessionReviewPublishGame> = {}): SessionReviewPublishGame {
  return {
    id: `game-${n}`,
    gameNumber: n,
    matchup: n === 1 ? "José & Carlo vs Mika & Marco" : `Pair ${n}A vs Pair ${n}B`,
    youtubeStatus: n === 1 ? null : "completed",
    driveStatus: "completed",
    visibility: "public",
    facebookTitle: `Sep 9, 2026 | Game ${n}`,
    facebookBody: `Game ${n}\nJosé & Carlo vs Mika & Marco\n#PlaymatesNiJose #Badminton`,
    ...extras,
  };
}

export const sep9ReviewFixture: SessionReviewPublishProps = {
  sessionId: "session-sep-9",
  sessionStatus: "published",
  sessionVisibility: "public",
  games: Array.from({ length: 10 }, (_, index) => game(index + 1)),
};

export const emptyReviewFixture: SessionReviewPublishProps = {
  sessionId: "session-empty",
  sessionStatus: "draft",
  sessionVisibility: "private",
  games: [],
};

export const missingDraftFixture: SessionReviewPublishProps = {
  sessionId: "session-drafts",
  sessionStatus: "ready",
  sessionVisibility: "private",
  games: [
    game(1, {
      facebookTitle: "Game 1 Facebook draft",
      facebookBody: FACEBOOK_GENERATE_PLACEHOLDER,
      visibility: "private",
      driveStatus: null,
    }),
  ],
};
