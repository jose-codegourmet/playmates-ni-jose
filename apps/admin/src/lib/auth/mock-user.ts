export const MOCK_ADMIN_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "jose@local.dev",
  name: "José",
  role: "ADMIN",
} as const;

export function isMockAuthEnabled() {
  return process.env.MOCK_AUTH === "true";
}
