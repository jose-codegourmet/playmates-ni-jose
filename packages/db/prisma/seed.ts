import { prisma } from "../src/client";

const SEED_IDS = {
  players: {
    jose: "aaaaaaaa-0001-4000-8000-000000000001",
    carlo: "aaaaaaaa-0001-4000-8000-000000000002",
    mika: "aaaaaaaa-0001-4000-8000-000000000003",
    marco: "aaaaaaaa-0001-4000-8000-000000000004",
  },
  venues: {
    smashCourtQc: "bbbbbbbb-0002-4000-8000-000000000001",
    greenShuttlePasig: "bbbbbbbb-0002-4000-8000-000000000002",
  },
  courts: {
    smash1: "cccccccc-0003-4000-8000-000000000001",
    smash2: "cccccccc-0003-4000-8000-000000000002",
    green1: "cccccccc-0003-4000-8000-000000000003",
  },
} as const;

async function main() {
  await prisma.venue.upsert({
    where: { id: SEED_IDS.venues.smashCourtQc },
    update: {},
    create: {
      id: SEED_IDS.venues.smashCourtQc,
      name: "Smash Court QC",
      slug: "smash-court-qc",
      address: "Quezon City",
    },
  });

  await prisma.venue.upsert({
    where: { id: SEED_IDS.venues.greenShuttlePasig },
    update: {},
    create: {
      id: SEED_IDS.venues.greenShuttlePasig,
      name: "Green Shuttle Pasig",
      slug: "green-shuttle-pasig",
      address: "Pasig",
    },
  });

  await prisma.court.upsert({
    where: { id: SEED_IDS.courts.smash1 },
    update: {},
    create: {
      id: SEED_IDS.courts.smash1,
      venueId: SEED_IDS.venues.smashCourtQc,
      name: "Court 1",
      sortOrder: 1,
    },
  });

  await prisma.court.upsert({
    where: { id: SEED_IDS.courts.smash2 },
    update: {},
    create: {
      id: SEED_IDS.courts.smash2,
      venueId: SEED_IDS.venues.smashCourtQc,
      name: "Court 2",
      sortOrder: 2,
    },
  });

  await prisma.court.upsert({
    where: { id: SEED_IDS.courts.green1 },
    update: {},
    create: {
      id: SEED_IDS.courts.green1,
      venueId: SEED_IDS.venues.greenShuttlePasig,
      name: "Court 1",
      sortOrder: 1,
    },
  });

  const players = [
    { id: SEED_IDS.players.jose, displayName: "José", slug: "jose", nickname: "José" },
    { id: SEED_IDS.players.carlo, displayName: "Carlo", slug: "carlo" },
    { id: SEED_IDS.players.mika, displayName: "Mika", slug: "mika" },
    { id: SEED_IDS.players.marco, displayName: "Marco", slug: "marco" },
  ] as const;

  for (const player of players) {
    await prisma.player.upsert({
      where: { id: player.id },
      update: {},
      create: player,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
