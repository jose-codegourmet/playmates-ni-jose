"use client";

import { useQuery } from "@tanstack/react-query";
import { currentUserQueryKey } from "./query";
import { fetchCurrentUser } from "./server";

async function loadCurrentUser() {
  return fetchCurrentUser();
}

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey.current(),
    queryFn: loadCurrentUser,
  });
}

export function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}
