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

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}
