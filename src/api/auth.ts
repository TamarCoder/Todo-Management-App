
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
  async seed(): Promise<void> {
    try {
      await storeSeedIfEmpty();
    } catch (e) {
      throw toApiError(e);
    }
  },

  async register(payload: RegisterPayload): Promise<User> {
    try {
      const user = await storeCreateUser(payload);
      storeSetSessionUserId(user.id);
      return user;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const user = await storeVerifyCredentials(email, password);
      storeSetSessionUserId(user.id);
      return user;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async me(): Promise<User | null> {
    try {
      const id = storeGetSessionUserId();
      if (!id) return null;
      return await storeFindUserById(id);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async updateProfile(userId: string, patch: ProfilePatch): Promise<User> {
    try {
      return await storeUpdateUser(userId, patch);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async logout(): Promise<void> {
    storeSetSessionUserId(null);
  },
};
