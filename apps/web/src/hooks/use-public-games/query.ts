export const publicGamesQueryKey = {
  all: () => ["public-games"] as const,
  list: () => publicGamesQueryKey.all(),
};
