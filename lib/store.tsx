"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Application, Member } from "./types";

type AppState = {
  member: Member | null;
  savedJobIds: string[];
  applications: Application[];
  hydrated: boolean;
};

type AppActions = {
  login: (member: Member) => void;
  logout: () => Promise<void>;
  refreshMember: () => Promise<void>;
  refreshSaved: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  updateMember: (patch: Partial<Member>) => void;
  toggleSaved: (jobId: string) => Promise<void>;
  isSaved: (jobId: string) => boolean;
  addApplication: (app: Application) => void;
};

const AppCtx = createContext<(AppState & AppActions) | null>(null);

const defaultState: AppState = {
  member: null,
  savedJobIds: [],
  applications: [],
  hydrated: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const fetchSaved = useCallback(async (): Promise<string[]> => {
    try {
      const r = await fetch("/api/saved-jobs", { credentials: "include" });
      const data = (await r.json()) as { jobIds?: string[] };
      return Array.isArray(data.jobIds) ? data.jobIds : [];
    } catch {
      return [];
    }
  }, []);

  const fetchApps = useCallback(async (): Promise<Application[]> => {
    try {
      const r = await fetch("/api/applications", { credentials: "include" });
      const data = (await r.json()) as { applications?: Application[] };
      return Array.isArray(data.applications) ? data.applications : [];
    } catch {
      return [];
    }
  }, []);

  const refreshSaved = useCallback(async () => {
    const ids = await fetchSaved();
    setState((s) => ({ ...s, savedJobIds: ids }));
  }, [fetchSaved]);

  const refreshApplications = useCallback(async () => {
    const apps = await fetchApps();
    setState((s) => ({ ...s, applications: apps }));
  }, [fetchApps]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = (await res.json()) as { member: Member | null };
        const member = data?.member ?? null;
        if (member) {
          const [ids, apps] = await Promise.all([fetchSaved(), fetchApps()]);
          if (cancelled) return;
          setState({ member, savedJobIds: ids, applications: apps, hydrated: true });
        } else {
          if (cancelled) return;
          setState({ member: null, savedJobIds: [], applications: [], hydrated: true });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, hydrated: true }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchSaved, fetchApps]);

  const login = useCallback(
    (member: Member) => {
      setState((s) => ({ ...s, member }));
      // Hydrate user-scoped data after login
      (async () => {
        const [ids, apps] = await Promise.all([fetchSaved(), fetchApps()]);
        setState((s) => ({ ...s, savedJobIds: ids, applications: apps }));
      })();
    },
    [fetchSaved, fetchApps],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      /* no-op */
    }
    setState({ member: null, savedJobIds: [], applications: [], hydrated: true });
  }, []);

  const refreshMember = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { credentials: "include" });
      const data = (await r.json()) as { member: Member | null };
      setState((s) => ({ ...s, member: data.member ?? null }));
    } catch {
      /* no-op */
    }
  }, []);

  const updateMember = useCallback((patch: Partial<Member>) => {
    setState((s) => (s.member ? { ...s, member: { ...s.member, ...patch } } : s));
  }, []);

  const toggleSaved = useCallback(async (jobId: string) => {
    setState((s) => {
      const exists = s.savedJobIds.includes(jobId);
      return {
        ...s,
        savedJobIds: exists ? s.savedJobIds.filter((x) => x !== jobId) : [...s.savedJobIds, jobId],
      };
    });
    try {
      await fetch("/api/saved-jobs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "toggle" }),
      });
    } catch {
      // Revert on failure
      setState((s) => {
        const exists = s.savedJobIds.includes(jobId);
        return {
          ...s,
          savedJobIds: exists ? s.savedJobIds.filter((x) => x !== jobId) : [...s.savedJobIds, jobId],
        };
      });
    }
  }, []);

  const isSaved = useCallback(
    (jobId: string) => state.savedJobIds.includes(jobId),
    [state.savedJobIds],
  );

  // Kept for backwards compat — apply flow now POSTs to /api/applications directly.
  const addApplication = useCallback((app: Application) => {
    setState((s) => ({ ...s, applications: [app, ...s.applications] }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshMember,
      refreshSaved,
      refreshApplications,
      updateMember,
      toggleSaved,
      isSaved,
      addApplication,
    }),
    [
      state,
      login,
      logout,
      refreshMember,
      refreshSaved,
      refreshApplications,
      updateMember,
      toggleSaved,
      isSaved,
      addApplication,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
