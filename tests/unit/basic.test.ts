import { beforeEach, expect, test } from "vitest";
import { SessionManager } from "../../src/core/session-manager";
import { MemoryStorage, data } from "./fixtures";

let storage: MemoryStorage;
let manager: SessionManager;

beforeEach(async () => {
  storage = new MemoryStorage(new Map(data));
  manager = new SessionManager(storage);
  await manager.load();
});

test("Session manager should load sessions from storage", async () => {
  expect(manager.sessions.length).toBeGreaterThan(0);
});

test("Session manager should clone existing session", async () => {
  const a = await manager.newSession();
  const b = await manager.clone(a);

  expect(b.meta).toEqual(a.meta);
  expect(b.slug).not.toBe(a.slug);
  expect(b.request).toEqual(a.request);
  expect(b.response).toEqual(a.response);
});

test("Session manager should save cloned session", async () => {
  const storage = new MemoryStorage(data);
  const manager = new SessionManager(storage);

  await manager.load();

  const initial_size = storage.size;
  const initial_manager_size = manager.sessions.length;

  const [one] = storage.data;

  const a = await manager.get(one.slug);

  expect(a).toBeDefined();

  await manager.clone(a!);

  expect(storage.size).toBeGreaterThan(initial_size);
  expect(manager.sessions.length).toBeGreaterThan(initial_manager_size);
});

test("Session manager should load full session data", async () => {
  const storage = new MemoryStorage(data);
  const manager = new SessionManager(storage);

  await manager.load();

  const [a] = storage.data;

  const b = (await manager.get(a.slug))!;

  expect(a).toBeDefined();
  expect(a.meta).toEqual(b.meta);
  expect(a.request).toEqual(b.request);
  expect(a.response).toEqual(b.response);
});

test("Session manager peek method should return the first session", async () => {
  const manager = new SessionManager(storage);

  await manager.load();

  const [a] = storage.data;
  const b = (await manager.peek())!;

  expect(b).toBeDefined();
  expect(b.slug).toBe(a.slug);
  expect(b.meta).toEqual(a.meta);
  expect(b.request).toEqual(a.request);
  expect(b.response).toEqual(a.response);
});
