import { authApi, todosApi, ApiError } from "@/api";
import { _resetForTests } from "@/lib/db";

describe("API integration (mock)", () => {
  beforeEach(() => {
    _resetForTests();
  });

  describe("authApi", () => {
    test("seed bootstraps demo user", async () => {
      await authApi.seed();
      const me = await authApi.login("demo@focusflow.app", "demo1234");
      expect(me.email).toBe("demo@focusflow.app");
    });

    test("login wraps wrong-credential error into ApiError 401", async () => {
      await authApi.register({
        email: "x@y.com",
        password: "secret1234",
        displayName: "X",
      });
      // Make sure session doesn't carry over from register.
      await authApi.logout();
      await expect(
        authApi.login("x@y.com", "wrong-password")
      ).rejects.toMatchObject({ status: 401 });
    });

    test("register conflict raises ApiError 409", async () => {
      await authApi.register({
        email: "a@b.com",
        password: "secret1234",
        displayName: "A",
      });
      await expect(
        authApi.register({
          email: "a@b.com",
          password: "secret1234",
          displayName: "A2",
        })
      ).rejects.toBeInstanceOf(ApiError);
      await expect(
        authApi.register({
          email: "a@b.com",
          password: "secret1234",
          displayName: "A2",
        })
      ).rejects.toMatchObject({ status: 409 });
    });

    test("me returns null without a session", async () => {
      const me = await authApi.me();
      expect(me).toBeNull();
    });

    test("logout clears the session", async () => {
      await authApi.register({
        email: "c@d.com",
        password: "secret1234",
        displayName: "C",
      });
      expect((await authApi.me())?.email).toBe("c@d.com");
      await authApi.logout();
      expect(await authApi.me()).toBeNull();
    });
  });

  describe("todosApi", () => {
    let userId: string;

    beforeEach(async () => {
      const u = await authApi.register({
        email: "owner@test.com",
        password: "secret1234",
        displayName: "Owner",
      });
      userId = u.id;
    });

    test("create + list round-trip", async () => {
      await todosApi.create(userId, {
        title: "Write tests",
        status: "todo",
        priority: "high",
        dueDate: null,
      });
      const list = await todosApi.list(userId);
      expect(list).toHaveLength(1);
      expect(list[0].title).toBe("Write tests");
    });

    test("update changes status", async () => {
      const t = await todosApi.create(userId, {
        title: "Ship it",
        status: "todo",
        priority: "medium",
        dueDate: null,
      });
      const updated = await todosApi.update(userId, t.id, { status: "done" });
      expect(updated.status).toBe("done");
    });

    test("foreign update raises ApiError 403", async () => {
      const t = await todosApi.create(userId, {
        title: "Mine",
        status: "todo",
        priority: "low",
        dueDate: null,
      });
      // Different user
      const other = await authApi.register({
        email: "other@test.com",
        password: "secret1234",
        displayName: "Other",
      });
      await expect(
        todosApi.update(other.id, t.id, { status: "done" })
      ).rejects.toMatchObject({ status: 403 });
    });

    test("foreign get returns null (data isolation)", async () => {
      const t = await todosApi.create(userId, {
        title: "Secret",
        status: "todo",
        priority: "low",
        dueDate: null,
      });
      const other = await authApi.register({
        email: "spy@test.com",
        password: "secret1234",
        displayName: "Spy",
      });
      const seen = await todosApi.get(other.id, t.id);
      expect(seen).toBeNull();
    });

    test("remove deletes the todo", async () => {
      const t = await todosApi.create(userId, {
        title: "Trash me",
        status: "todo",
        priority: "low",
        dueDate: null,
      });
      await todosApi.remove(userId, t.id);
      const list = await todosApi.list(userId);
      expect(list.find((x) => x.id === t.id)).toBeUndefined();
    });
  });
});
