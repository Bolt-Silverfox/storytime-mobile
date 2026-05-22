import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearGuestSessionStorage,
  clearGuestStorage,
  clearGuestStoryAccess,
  GUEST_SESSION_STORAGE_KEYS,
  GUEST_STORAGE_KEYS,
  GUEST_STORIES_KEY,
} from "./guestStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  multiRemove: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe("guestStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clears guest story access", async () => {
    await clearGuestStoryAccess();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(GUEST_STORIES_KEY);
  });

  it("clears guest session storage without removing guest mode", async () => {
    await clearGuestSessionStorage();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
      GUEST_SESSION_STORAGE_KEYS
    );
  });

  it("clears all guest storage", async () => {
    await clearGuestStorage();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(GUEST_STORAGE_KEYS);
  });
});
