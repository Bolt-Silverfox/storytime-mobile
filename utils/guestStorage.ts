import AsyncStorage from "@react-native-async-storage/async-storage";

const GUEST_STORIES_KEY = "guestStoriesRead";

const GUEST_SESSION_STORAGE_KEYS = ["guestSessionId", "guestSessionCreatedAt"];

const GUEST_STORAGE_KEYS = [
  "guestMode",
  ...GUEST_SESSION_STORAGE_KEYS,
  "guestDeviceId",
  GUEST_STORIES_KEY,
];

const clearGuestStoryAccess = () => AsyncStorage.removeItem(GUEST_STORIES_KEY);

const clearGuestSessionStorage = () =>
  AsyncStorage.multiRemove(GUEST_SESSION_STORAGE_KEYS);

const clearGuestStorage = () => AsyncStorage.multiRemove(GUEST_STORAGE_KEYS);

export {
  clearGuestSessionStorage,
  clearGuestStorage,
  clearGuestStoryAccess,
  GUEST_SESSION_STORAGE_KEYS,
  GUEST_STORAGE_KEYS,
  GUEST_STORIES_KEY,
};
