/**
 * Typed errors for the mock data layer (actions map codes, not message strings).
 */

export const ASSET_EXISTS = "ASSET_EXISTS" as const;
export const GAME_HAS_RECORDINGS = "GAME_HAS_RECORDINGS" as const;
export const MOCK_PROVIDER_ERROR = "MOCK_PROVIDER_ERROR" as const;

export class MockDomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "MockDomainError";
    this.code = code;
  }
}

export function isMockDomainError(error: unknown): error is MockDomainError {
  return error instanceof MockDomainError;
}

export function assetExistsError(recordingId: string, provider: string): MockDomainError {
  return new MockDomainError(
    ASSET_EXISTS,
    `Provider asset already exists for ${provider} on recording ${recordingId}`,
  );
}
