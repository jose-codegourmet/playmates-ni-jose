import { MOCK_PROVIDER_ERROR, SEED_IDS } from "@fe-template/mocks";

import type { DashboardData } from "./get-dashboard-data";

export const seedLikeDashboard: DashboardData = {
  latestSessions: [
    {
      id: SEED_IDS.sessions.sep9,
      date: "2026-09-09",
      status: "published",
      visibility: "public",
    },
    {
      id: SEED_IDS.sessions.draftSep2,
      date: "2026-09-02",
      status: "draft",
      visibility: "private",
    },
    {
      id: SEED_IDS.sessions.aug26,
      date: "2026-08-26",
      status: "published",
      visibility: "public",
    },
  ],
  unfinishedUploads: [
    {
      id: "job-queued-1",
      recordingLabel: "Draft force-fail YouTube",
      provider: "youtube",
      status: "queued",
      sessionId: SEED_IDS.sessions.draftSep2,
    },
  ],
  failedJobs: [
    {
      id: "job-failed-1",
      recordingLabel: "Draft force-fail YouTube",
      provider: "youtube",
      errorCode: MOCK_PROVIDER_ERROR,
      sessionId: SEED_IDS.sessions.draftSep2,
    },
  ],
  awaitingFacebook: [
    {
      gameId: "game-sep9-1",
      gameNumber: 1,
      sessionId: SEED_IDS.sessions.sep9,
      sessionDate: "2026-09-09",
      title: "Sep 9, 2026 | Game 1",
    },
    {
      gameId: "game-sep9-2",
      gameNumber: 2,
      sessionId: SEED_IDS.sessions.sep9,
      sessionDate: "2026-09-09",
      title: "Sep 9, 2026 | Game 2",
    },
  ],
};

export const emptyDashboard: DashboardData = {
  latestSessions: [],
  unfinishedUploads: [],
  failedJobs: [],
  awaitingFacebook: [],
};

export const freshSeedDashboard: DashboardData = {
  latestSessions: seedLikeDashboard.latestSessions,
  unfinishedUploads: [],
  failedJobs: [],
  awaitingFacebook: seedLikeDashboard.awaitingFacebook,
};
