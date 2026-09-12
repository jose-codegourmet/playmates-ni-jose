import { AwaitingFacebook } from "../awaiting-facebook/AwaitingFacebook";
import { FailedJobs } from "../failed-jobs/FailedJobs";
import { LatestSessions } from "../latest-sessions/LatestSessions";
import { QuickCreate } from "../quick-create/QuickCreate";
import { UnfinishedUploads } from "../unfinished-uploads/UnfinishedUploads";
import type { DashboardWidgetsProps } from "./DashboardWidgets.types";

function DashboardWidgets({
  latestSessions,
  unfinishedUploads,
  failedJobs,
  awaitingFacebook,
}: DashboardWidgetsProps) {
  return (
    <div data-slot="dashboard-widgets" className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UnfinishedUploads rows={unfinishedUploads} />
        <FailedJobs rows={failedJobs} />
        <AwaitingFacebook rows={awaitingFacebook} />
        <QuickCreate />
      </div>
      <LatestSessions rows={latestSessions} />
    </div>
  );
}

export type { DashboardWidgetsProps };
export { DashboardWidgets };
