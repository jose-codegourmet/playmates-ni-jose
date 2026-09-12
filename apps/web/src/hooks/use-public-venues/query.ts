export const publicVenuesQueryKey = {
  all: () => ["public-venues"] as const,
  list: () => publicVenuesQueryKey.all(),
};
