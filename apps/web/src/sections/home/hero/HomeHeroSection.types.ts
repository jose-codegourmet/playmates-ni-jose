export type HomeHeroPortrait = {
  name: string;
  src: string;
  alt: string;
};

export type HomeHeroSectionProps = {
  className?: string;
  sessionCount?: number;
  gameCount?: number;
  portraits?: HomeHeroPortrait[];
};
