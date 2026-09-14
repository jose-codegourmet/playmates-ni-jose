-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('draft', 'ready', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PostPlatform" AS ENUM ('facebook_group');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('google_drive', 'youtube');

-- CreateEnum
CREATE TYPE "ProviderAssetStatus" AS ENUM ('created');

-- CreateEnum
CREATE TYPE "UploadJobStatus" AS ENUM ('queued', 'initiating', 'uploading', 'processing', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "CameraSide" AS ENUM ('A', 'B', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('imported', 'organized', 'ready', 'uploading', 'uploaded', 'published', 'failed', 'archived');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('draft', 'organizing', 'uploading', 'ready', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('private', 'public');

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "game_number" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "notes" TEXT,
    "status" "GameStatus" NOT NULL DEFAULT 'draft',
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "winner_team_no" INTEGER,
    "scores" JSONB,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_teams" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "team_no" INTEGER NOT NULL,
    "label" TEXT,

    CONSTRAINT "game_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_team_players" (
    "game_team_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "game_team_players_pkey" PRIMARY KEY ("game_team_id","player_id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "slug" TEXT,
    "nickname" TEXT,
    "facebook_name" TEXT,
    "facebook_url" TEXT,
    "notes" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_drafts" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "platform" "PostPlatform" NOT NULL DEFAULT 'facebook_group',
    "title" TEXT,
    "body" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "posted_at" TIMESTAMP(3),
    "posted_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "display_name" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_assets" (
    "id" UUID NOT NULL,
    "recording_id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "provider_asset_id" TEXT NOT NULL,
    "provider_parent_id" TEXT,
    "url" TEXT,
    "embed_url" TEXT,
    "privacy" TEXT,
    "title" TEXT,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "status" "ProviderAssetStatus" NOT NULL DEFAULT 'created',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_jobs" (
    "id" UUID NOT NULL,
    "recording_id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "status" "UploadJobStatus" NOT NULL DEFAULT 'queued',
    "progress_percent" DECIMAL(65,30),
    "bytes_uploaded" BIGINT,
    "total_bytes" BIGINT,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "resumable_session_ref" TEXT,
    "last_error_code" TEXT,
    "last_error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_connections" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "provider_account_id" TEXT,
    "email" TEXT,
    "scopes" TEXT,
    "token_ref" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recordings" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "game_id" UUID,
    "original_filename" TEXT NOT NULL,
    "display_name" TEXT,
    "camera_side" "CameraSide" NOT NULL DEFAULT 'UNASSIGNED',
    "part_number" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "mime_type" TEXT,
    "size_bytes" BIGINT,
    "duration_seconds" DECIMAL(65,30),
    "captured_at" TIMESTAMP(3),
    "local_last_modified_at" TIMESTAMP(3),
    "checksum" TEXT,
    "notes" TEXT,
    "status" "RecordingStatus" NOT NULL DEFAULT 'imported',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "session_date" DATE NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "club_name" TEXT,
    "venue_id" UUID,
    "court_id" UUID,
    "notes" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'draft',
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "drive_folder_id" TEXT,
    "drive_folder_url" TEXT,
    "created_by" UUID,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_players" (
    "session_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,

    CONSTRAINT "session_players_pkey" PRIMARY KEY ("session_id","player_id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" UUID NOT NULL,
    "venue_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "games_session_id_sort_order_idx" ON "games"("session_id", "sort_order");

-- CreateIndex
CREATE INDEX "games_visibility_idx" ON "games"("visibility");

-- CreateIndex
CREATE UNIQUE INDEX "games_session_id_game_number_key" ON "games"("session_id", "game_number");

-- CreateIndex
CREATE UNIQUE INDEX "game_teams_game_id_team_no_key" ON "game_teams"("game_id", "team_no");

-- CreateIndex
CREATE INDEX "game_team_players_player_id_idx" ON "game_team_players"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_slug_key" ON "players"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "provider_assets_recording_id_provider_idx" ON "provider_assets"("recording_id", "provider");

-- CreateIndex
CREATE INDEX "provider_assets_provider_provider_asset_id_idx" ON "provider_assets"("provider", "provider_asset_id");

-- CreateIndex
CREATE INDEX "upload_jobs_recording_id_provider_idx" ON "upload_jobs"("recording_id", "provider");

-- CreateIndex
CREATE INDEX "upload_jobs_status_idx" ON "upload_jobs"("status");

-- CreateIndex
CREATE INDEX "upload_jobs_created_at_idx" ON "upload_jobs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "recordings_session_id_sort_order_idx" ON "recordings"("session_id", "sort_order");

-- CreateIndex
CREATE INDEX "recordings_game_id_camera_side_part_number_idx" ON "recordings"("game_id", "camera_side", "part_number");

-- CreateIndex
CREATE INDEX "recordings_status_idx" ON "recordings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_slug_key" ON "sessions"("slug");

-- CreateIndex
CREATE INDEX "sessions_session_date_idx" ON "sessions"("session_date" DESC);

-- CreateIndex
CREATE INDEX "sessions_venue_id_idx" ON "sessions"("venue_id");

-- CreateIndex
CREATE INDEX "sessions_visibility_idx" ON "sessions"("visibility");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "session_players_player_id_idx" ON "session_players"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_teams" ADD CONSTRAINT "game_teams_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_team_players" ADD CONSTRAINT "game_team_players_game_team_id_fkey" FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_team_players" ADD CONSTRAINT "game_team_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_drafts" ADD CONSTRAINT "post_drafts_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_assets" ADD CONSTRAINT "provider_assets_recording_id_fkey" FOREIGN KEY ("recording_id") REFERENCES "recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_jobs" ADD CONSTRAINT "upload_jobs_recording_id_fkey" FOREIGN KEY ("recording_id") REFERENCES "recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Link profiles.id to Supabase auth.users (cross-schema FK; not expressible in Prisma)
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_fkey"
  FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE;
