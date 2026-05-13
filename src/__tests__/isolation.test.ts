import {
  _resetForTests,
  createTodo,
  createUser,
  deleteTodo,
  getTodo,
  listTodos,
  updateTodo,
} from "@/lib/db";

beforeEach(() => _resetForTests());

describe("user isolation", () => {
  test("user B cannot read, update, or delete user A's todos", async () => {
    const a = await createUser({ email: "a@x.com", password: "abcd1234", displayName: "A" });
    const b = await createUser({ email: "b@x.com", password: "abcd1234", displayName: "B" });

    const todoA = await createTodo(a.id, {
      title: "Secret of A",
      status: "todo",
      priority: "high",
      dueDate: null,
    });

    const aList = await listTodos(a.id);
    const bList = await listTodos(b.id);
    expect(aList).toHaveLength(1);
    expect(bList).toHaveLength(0);

    const fromB = await getTodo(b.id, todoA.id);
    expect(fromB).toBeNull();

    await expect(
      updateTodo(b.id, todoA.id, { title: "hacked" })
    ).rejects.toThrow(/not authorized/i);

    await expect(deleteTodo(b.id, todoA.id)).rejects.toThrow(/not authorized/i);

    const stillA = await getTodo(a.id, todoA.id);
    expect(stillA).not.toBeNull();
    expect(stillA!.title).toBe("Secret of A");
  });

  test("each user only sees their own todos", async () => {
    const a = await createUser({ email: "a@x.com", password: "abcd1234", displayName: "A" });
    const b = await createUser({ email: "b@x.com", password: "abcd1234", displayName: "B" });
    await createTodo(a.id, { title: "A1", status: "todo", priority: "low", dueDate: null });
    await createTodo(a.id, { title: "A2", status: "todo", priority: "low", dueDate: null });
    await createTodo(b.id, { title: "B1", status: "todo", priority: "low", dueDate: null });

    const aList = await listTodos(a.id);
    const bList = await listTodos(b.id);
    expect(aList.map((t) => t.title).sort()).toEqual(["A1", "A2"]);
    expect(bList.map((t) => t.title)).toEqual(["B1"]);
  });
});
