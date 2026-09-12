"use client";

import { Badge, cn } from "@fe-template/ui";

import {
  SESSION_WORKSPACE_STEPS,
  type SessionWorkspaceStepperProps,
  type StepId,
} from "./SessionWorkspaceStepper.types";

function SessionWorkspaceStepper({ current, completed, hrefFor }: SessionWorkspaceStepperProps) {
  const completedSet = new Set<StepId>(completed);

  return (
    <nav
      data-slot="session-workspace-stepper"
      aria-label="Session workspace steps"
      className="w-full bg-background text-foreground"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {SESSION_WORKSPACE_STEPS.map((step, index) => {
          const isCurrent = step.id === current;
          const isCompleted = completedSet.has(step.id);

          return (
            <li key={step.id} className="flex min-w-0 items-center">
              <a
                href={hrefFor(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline outline-none",
                  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Badge variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}>
                  {index + 1}
                </Badge>
                <span>{step.label}</span>
                {isCompleted ? <span className="sr-only">Completed</span> : null}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export {
  SESSION_WORKSPACE_STEP_IDS,
  SESSION_WORKSPACE_STEPS,
} from "./SessionWorkspaceStepper.types";
export type { SessionWorkspaceStepperProps, StepId };
export { SessionWorkspaceStepper };
