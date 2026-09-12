export const publicSessionsQueryKey = {
  all: () => ["public-sessions"] as const,
  list: () => publicSessionsQueryKey.all(),
};
