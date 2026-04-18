"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Application, Member } from "./types";

type AppState = {
  member: Member | null;
  savedJobIds: string[];
  applications: Application[];
};

type AppActions = {
  login: (member: Member) => void;
  logout: () => void;
  updateMember: (patch: Partial<Member>) => void;
  toggleSaved: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;
  addApplication: (app: Application) => void;
};

const AppCtx = createContext<(AppState & AppActions) | null>(null);

const STORAGE_KEY = "ace-career::state::v1";

const defaultState: AppState = {
  member: null,
  savedJobIds: [],
  applications: [],
};

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* no-op */
    }
  }, [state, hydrated]);

  const login = useCallback((member: Member) => {
    setState((s) => ({ ...s, member }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, member: null }));
  }, []);

  const updateMember = useCallback((patch: Partial<Member>) => {
    setState((s) => (s.member ? { ...s, member: { ...s.member, ...patch } } : s));
  }, []);

  const toggleSaved = useCallback((jobId: string) => {
    setState((s) => {
      const exists = s.savedJobIds.includes(jobId);
      return {
        ...s,
        savedJobIds: exists ? s.savedJobIds.filter((x) => x !== jobId) : [...s.savedJobIds, jobId],
      };
    });
  }, []);

  const isSaved = useCallback(
    (jobId: string) => state.savedJobIds.includes(jobId),
    [state.savedJobIds]
  );

  const addApplication = useCallback((app: Application) => {
    setState((s) => ({ ...s, applications: [app, ...s.applications] }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateMember,
      toggleSaved,
      isSaved,
      addApplication,
    }),
    [state, login, logout, updateMember, toggleSaved, isSaved, addApplication]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
