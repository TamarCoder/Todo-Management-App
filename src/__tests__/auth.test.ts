import { _resetForTests, createUser, verifyCredentials } from "@/lib/db";

beforeEach(() => _resetForTests());

describe("auth (db layer)", () => {
  test("createUser then verifyCredentials succeeds", async () => {
    await createUser({ email: "a@b.com", password: "abcd1234", displayName: "A" });
    const u = await verifyCredentials("a@b.com", "abcd1234");
    expect(u.email).toBe("a@b.com");
    expect(u.displayName).toBe("A");
  });

  test("duplicate email rejected", async () => {
    await createUser({ email: "a@b.com", password: "abcd1234", displayName: "A" });
    await expect(
      createUser({ email: "a@b.com", password: "abcd1234", displayName: "Other" })
    ).rejects.toThrow(/already exists/i);
  });

  test("wrong password rejected", async () => {
    await createUser({ email: "a@b.com", password: "abcd1234", displayName: "A" });
    await expect(verifyCredentials("a@b.com", "wrongpass")).rejects.toThrow(
      /invalid email or password/i
    );
  });

  test("unknown email rejected", async () => {
    await expect(verifyCredentials("none@x.com", "abcd1234")).rejects.toThrow(
      /invalid email or password/i
    );
  });

  test("email is case-insensitive on lookup", async () => {
    await createUser({ email: "Mixed@Case.COM", password: "abcd1234", displayName: "Mc" });
    const u = await verifyCredentials("mixed@case.com", "abcd1234");
    expect(u.displayName).toBe("Mc");
  });
});
