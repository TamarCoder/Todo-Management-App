
export const API_BASE: string = process.env.NEXT_PUBLIC_API_URL ?? "mock://localhost";

export const IS_MOCK_API = API_BASE.startsWith("mock://");

export type ApiStatus = 400 | 401 | 403 | 404 | 409 | 500;

export class ApiError extends Error {
  readonly status: ApiStatus;
  constructor(message: string, status: ApiStatus = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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
