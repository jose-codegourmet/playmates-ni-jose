export type GameDetailPagerNeighbor = {
  href: string;
  gameNumber: number;
};

export type GameDetailPagerSectionProps = {
  className?: string;
  previous?: GameDetailPagerNeighbor;
  next?: GameDetailPagerNeighbor;
};
