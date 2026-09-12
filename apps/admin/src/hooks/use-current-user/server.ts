"use server";

import { prisma } from "@fe-template/db";
import type { CurrentUser } from "./types";

const MOCK_CURRENT_USER: CurrentUser = {
  email: "jose@local.dev",
  name: "José",
  avatarUrl: null,
  role: "ADMIN",
  bio: null,
  createdAt: new Date(0).toISOString(),
};

export async function fetchCurrentUserByEmail(email: string): Promise<CurrentUser | null> {
  // TODO(PNJ-007): full MOCK_AUTH bypass in middleware + dedicated mock-user module.
  if (process.env.MOCK_AUTH === "true") {
    return { ...MOCK_CURRENT_USER, email: email || MOCK_CURRENT_USER.email };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
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
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}
