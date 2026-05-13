/**
 * Mock API client base.
 *
 * The app talks to feature-specific API modules (authApi, todosApi) rather
 * than the localStorage layer directly. This gives us a single seam to swap
 * in a real backend later — only the bodies of these functions change, not
 * any consumer.
 *
 * `API_BASE` is read from NEXT_PUBLIC_API_URL so the boundary already
 * matches a real deployment. With the `mock://` scheme it just signals
 * "no network".
 */

export const API_BASE: string = process.env.NEXT_PUBLIC_API_URL ?? "mock://localhost";

export const IS_MOCK_API = API_BASE.startsWith("mock://");

/** HTTP-like status codes used by the mock API to classify errors. */
export type ApiStatus = 400 | 401 | 403 | 404 | 409 | 500;

export class ApiError extends Error {
  readonly status: ApiStatus;
  constructor(message: string, status: ApiStatus = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Convert any thrown error from the data layer into a typed ApiError so
 * UI code can branch on status (e.g. show 401 vs 404 differently).
 */
export function toApiError(e: unknown, fallbackStatus: ApiStatus = 500): ApiError {
  if (e instanceof ApiError) return e;
  const message = e instanceof Error ? e.message : "Unexpected error";
  if (/not authorized/i.test(message)) return new ApiError(message, 403);
  if (/not found/i.test(message)) return new ApiError(message, 404);
  if (/invalid (email|password|credentials)/i.test(message))
    return new ApiError(message, 401);
  if (/already exists/i.test(message)) return new ApiError(message, 409);
  return new ApiError(message, fallbackStatus);
}
