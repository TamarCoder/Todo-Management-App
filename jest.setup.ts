import "@testing-library/jest-dom";

// In-memory localStorage mock so tests don't share state across files via real storage.
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  key(i: number) {
    return Object.keys(this.store)[i] ?? null;
  }
  get length() {
    return Object.keys(this.store).length;
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
  writable: true,
});

beforeEach(() => {
  window.localStorage.clear();
});
