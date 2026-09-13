"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import type { SessionWorkspaceSaveState } from "./SessionWorkspaceHeader.types";

type SessionWorkspaceSaveContextValue = {
  saveState: SessionWorkspaceSaveState;
  beginSave: () => void;
  endSave: (ok: boolean) => void;
};

const SessionWorkspaceSaveContext = createContext<SessionWorkspaceSaveContextValue | null>(null);

const NOOP_SAVE: SessionWorkspaceSaveContextValue = {
  saveState: "saved",
  beginSave: () => undefined,
  endSave: () => undefined,
};

function SessionWorkspaceSaveProvider({ children }: { children: ReactNode }) {
  const [saveState, setSaveState] = useState<SessionWorkspaceSaveState>("saved");

  const beginSave = useCallback(() => {
    setSaveState("saving");
  }, []);

  const endSave = useCallback((ok: boolean) => {
    setSaveState(ok ? "saved" : "error");
  }, []);

  const value = useMemo(() => ({ saveState, beginSave, endSave }), [saveState, beginSave, endSave]);

  return (
    <SessionWorkspaceSaveContext.Provider value={value}>
      {children}
    </SessionWorkspaceSaveContext.Provider>
  );
}

function useOptionalSessionWorkspaceSave(): SessionWorkspaceSaveContextValue | null {
  return useContext(SessionWorkspaceSaveContext);
}

function useSessionWorkspaceSave(): SessionWorkspaceSaveContextValue {
  return useOptionalSessionWorkspaceSave() ?? NOOP_SAVE;
}

export { SessionWorkspaceSaveProvider, useOptionalSessionWorkspaceSave, useSessionWorkspaceSave };
