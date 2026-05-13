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

async function userId() {
  const u = await createUser({ email: "u@x.com", password: "abcd1234", displayName: "U" });
  return u.id;
}

describe("todos (db layer)", () => {
  test("create + list", async () => {
    const uid = await userId();
    const t = await createTodo(uid, {
      title: "Write tests",
      description: "Cover the db layer",
      status: "todo",
      priority: "high",
      dueDate: null,
    });
    expect(t.id).toBeDefined();
    expect(t.title).toBe("Write tests");
    const list = await listTodos(uid);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(t.id);
  });

  test("update modifies fields and bumps updatedAt", async () => {
    const uid = await userId();
    const t = await createTodo(uid, {
      title: "Old",
      status: "todo",
      priority: "low",
      dueDate: null,
    });
    const before = t.updatedAt;
    await new Promise((r) => setTimeout(r, 10));
    const updated = await updateTodo(uid, t.id, {
      title: "New",
      status: "done",
      priority: "high",
    });
    expect(updated.title).toBe("New");
    expect(updated.status).toBe("done");
    expect(updated.priority).toBe("high");
    expect(updated.updatedAt > before).toBe(true);
  });

  test("delete removes from list", async () => {
    const uid = await userId();
    const t = await createTodo(uid, {
      title: "x",
      status: "todo",
      priority: "low",
      dueDate: null,
    });
    await deleteTodo(uid, t.id);
    const list = await listTodos(uid);
    expect(list).toHaveLength(0);
  });

  test("get returns null for missing id", async () => {
    const uid = await userId();
    expect(await getTodo(uid, "missing")).toBeNull();
  });

  test("trims title and description", async () => {
    const uid = await userId();
    const t = await createTodo(uid, {
      title: "  spaced  ",
      description: "  with whitespace  ",
      status: "todo",
      priority: "low",
      dueDate: null,
    });
    expect(t.title).toBe("spaced");
    expect(t.description).toBe("with whitespace");
  });
});
