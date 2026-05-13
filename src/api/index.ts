/**
 * Single import surface for all API operations.
 *
 *   import { authApi, todosApi, ApiError } from "@/api";
 *
 * The application talks ONLY to this barrel. Switching to a real backend
 * means rewriting the bodies of files in this directory — every store, page,
 * and component stays unchanged.
 */

export { authApi } from "./auth";
export type { RegisterPayload, ProfilePatch } from "./auth";
export { todosApi } from "./todos";
export { ApiError, API_BASE, IS_MOCK_API } from "./client";
