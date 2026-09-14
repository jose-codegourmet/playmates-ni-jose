"use server";

import { prisma } from "@fe-template/db";
import { isMockAuthEnabled, MOCK_ADMIN_USER } from "@/lib/auth/mock-user";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "./types";

function mockCurrentUser(): CurrentUser {
  return {
    id: MOCK_ADMIN_USER.id,
    email: MOCK_ADMIN_USER.email,
    name: MOCK_ADMIN_USER.name,
    avatarUrl: null,
    role: MOCK_ADMIN_USER.role,
    bio: null,
    createdAt: new Date(0).toISOString(),
  };
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  if (isMockAuthEnabled()) {
    return mockCurrentUser();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;
  return fetchCurrentUserByEmail(user.email);
}

export async function fetchCurrentUserByEmail(email: string): Promise<CurrentUser | null> {
  if (isMockAuthEnabled()) {
    return mockCurrentUser();
  }

  const profile = await prisma.profile.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!profile?.email) return null;

  return {
    id: profile.id,
    email: profile.email,
    name: profile.displayName,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    bio: profile.bio,
    createdAt: profile.createdAt.toISOString(),
  };
}
