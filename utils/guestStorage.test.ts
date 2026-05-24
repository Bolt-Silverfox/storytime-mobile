import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GUEST_MODE_KEY,
  clearGuestSessionStorage,
  clearGuestStateStorage,
  clearGuestStoryAccess,
  GUEST_SESSION_STORAGE_KEYS,
  GUEST_STATE_STORAGE_KEYS,
  GUEST_STORIES_KEY,
} from "./guestStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  multiRemove: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe("guestStorage", () => {
  const originalDev = __DEV__;

  beforeEach(() => {
    Object.defineProperty(globalThis, "__DEV__", {
      configurable: true,
      value: originalDev,
    });
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(globalThis, "__DEV__", {
      configurable: true,
      value: originalDev,
    });
  });

  it("clears guest story access", async () => {
    await clearGuestStoryAccess();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(GUEST_STORIES_KEY);
  });

  it("clears guest session storage in development without removing guest mode", async () => {
    await clearGuestSessionStorage();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
      GUEST_SESSION_STORAGE_KEYS
    );
  });

  it("does not clear guest session storage in production", async () => {
    Object.defineProperty(globalThis, "__DEV__", {
      configurable: true,
      value: false,
    });

    await clearGuestSessionStorage();

    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });

  it("clears full guest state storage in development without resetting story access", async () => {
    await clearGuestStateStorage();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
      GUEST_STATE_STORAGE_KEYS
    );
    expect(GUEST_STATE_STORAGE_KEYS).toContain(GUEST_MODE_KEY);
    expect(GUEST_STATE_STORAGE_KEYS).not.toContain(GUEST_STORIES_KEY);
  });

  it("clears only guest mode from guest state storage in production", async () => {
    Object.defineProperty(globalThis, "__DEV__", {
      configurable: true,
      value: false,
    });

    await clearGuestStateStorage();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([GUEST_MODE_KEY]);
    expect(GUEST_STATE_STORAGE_KEYS).toContain(GUEST_MODE_KEY);
    expect(GUEST_STATE_STORAGE_KEYS).not.toContain(GUEST_STORIES_KEY);
  });
});
