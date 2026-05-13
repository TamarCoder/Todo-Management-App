import {
  validateConfirmPassword,
  validateDisplayName,
  validateDueDate,
  validateEmail,
  validatePassword,
  validatePriority,
  validateStatus,
  validateTodoTitle,
} from "@/lib/validation";

describe("validation", () => {
  describe("email", () => {
    test("accepts valid email", () => {
      expect(validateEmail("user@example.com").valid).toBe(true);
      expect(validateEmail("a.b+c@sub.example.io").valid).toBe(true);
    });
    test("rejects empty/invalid", () => {
      expect(validateEmail("").valid).toBe(false);
      expect(validateEmail("not-an-email").valid).toBe(false);
      expect(validateEmail("missing@tld").valid).toBe(false);
    });
  });

  describe("password", () => {
    test("requires 8 chars, letter, number", () => {
      expect(validatePassword("abc1").valid).toBe(false);
      expect(validatePassword("abcdefgh").valid).toBe(false); // no number
      expect(validatePassword("12345678").valid).toBe(false); // no letter
      expect(validatePassword("abcd1234").valid).toBe(true);
    });
  });

  describe("confirmPassword", () => {
    test("must match", () => {
      expect(validateConfirmPassword("abcd1234", "abcd1234").valid).toBe(true);
      expect(validateConfirmPassword("abcd1234", "different").valid).toBe(false);
      expect(validateConfirmPassword("abcd1234", "").valid).toBe(false);
    });
  });

  describe("displayName", () => {
    test("must not be empty and within limit", () => {
      expect(validateDisplayName("Alice").valid).toBe(true);
      expect(validateDisplayName("").valid).toBe(false);
      expect(validateDisplayName("x".repeat(61)).valid).toBe(false);
    });
  });

  describe("todoTitle", () => {
    test("required and within 120 chars", () => {
      expect(validateTodoTitle("Hello").valid).toBe(true);
      expect(validateTodoTitle("").valid).toBe(false);
      expect(validateTodoTitle("  ").valid).toBe(false);
      expect(validateTodoTitle("x".repeat(121)).valid).toBe(false);
    });
  });

  describe("status & priority", () => {
    test("validates enum", () => {
      expect(validateStatus("todo").valid).toBe(true);
      expect(validateStatus("nope").valid).toBe(false);
      expect(validatePriority("high").valid).toBe(true);
      expect(validatePriority("urgent").valid).toBe(false);
    });
  });

  describe("dueDate", () => {
    test("optional", () => {
      expect(validateDueDate(null).valid).toBe(true);
      expect(validateDueDate("").valid).toBe(true);
    });
    test("rejects invalid dates", () => {
      expect(validateDueDate("not-a-date").valid).toBe(false);
    });
    test("rejects past dates", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(validateDueDate(past.toISOString().slice(0, 10)).valid).toBe(false);
    });
    test("allows today and future", () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(validateDueDate(today).valid).toBe(true);
      const future = new Date();
      future.setDate(future.getDate() + 5);
      expect(validateDueDate(future.toISOString().slice(0, 10)).valid).toBe(true);
    });
  });
});
