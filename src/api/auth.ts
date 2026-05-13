/**
 * Auth API surface.
 *
 * Every consumer (Zustand stores, pages, tests if they want) calls these
 * methods — NOT the underlying mock-store. To swap to a real backend, only
 * the function bodies here change: replace each call with `fetch()` against
 * the real endpoint.
 *
 * Endpoint contract (what a real REST backend would expose):
 *   POST   /auth/register     → 201 User | 409 conflict
 *   POST   /auth/login        → 200 User | 401 unauthorized
 *   GET    /auth/me           → 200 User | 401 unauthorized
 *   PATCH  /auth/me           → 200 User | 401 unauthorized
 *   POST   /auth/logout       → 204
 */

import type { User } from "@/lib/types";
import {
  createUser as storeCreateUser,
  findUserById as storeFindUserById,
  getSessionUserId as storeGetSessionUserId,
  seedIfEmpty as storeSeedIfEmpty,
  setSessionUserId as storeSetSessionUserId,
  updateUser as storeUpdateUser,
  verifyCredentials as storeVerifyCredentials,
} from "@/lib/db";
import { toApiError } from "./client";

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type ProfilePatch = {
  displayName: string;
};

export const authApi = {
  /**
   * Initialise the mock backend on first launch (creates the demo user
   * and seed todos). A real backend wouldn't expose this — it's a no-op
   * client-side hook for the mock impl only.
   */
  async seed(): Promise<void> {
    try {
      await storeSeedIfEmpty();
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** POST /auth/register */
  async register(payload: RegisterPayload): Promise<User> {
    try {
      const user = await storeCreateUser(payload);
      storeSetSessionUserId(user.id);
      return user;
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** POST /auth/login */
  async login(email: string, password: string): Promise<User> {
    try {
      const user = await storeVerifyCredentials(email, password);
      storeSetSessionUserId(user.id);
      return user;
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** GET /auth/me — returns null when no active session. */
  async me(): Promise<User | null> {
    try {
      const id = storeGetSessionUserId();
      if (!id) return null;
      return await storeFindUserById(id);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** PATCH /auth/me */
  async updateProfile(userId: string, patch: ProfilePatch): Promise<User> {
    try {
      return await storeUpdateUser(userId, patch);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** POST /auth/logout */
  async logout(): Promise<void> {
    storeSetSessionUserId(null);
  },
};
