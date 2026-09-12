export const publicPlayersQueryKey = {
  all: () => ["public-players"] as const,
  list: () => publicPlayersQueryKey.all(),
};
