import AsyncStorage from "@react-native-async-storage/async-storage";

const GUEST_STORIES_KEY = "guestStoriesRead";

const GUEST_SESSION_STORAGE_KEYS = ["guestSessionId", "guestSessionCreatedAt"];

const GUEST_STATE_STORAGE_KEYS = [
  "guestMode",
  ...GUEST_SESSION_STORAGE_KEYS,
  "guestDeviceId",
];

const clearGuestStoryAccess = () => AsyncStorage.removeItem(GUEST_STORIES_KEY);

const clearGuestSessionStorage = () =>
  AsyncStorage.multiRemove(GUEST_SESSION_STORAGE_KEYS);

const clearGuestStateStorage = () =>
  AsyncStorage.multiRemove(GUEST_STATE_STORAGE_KEYS);

export {
  clearGuestSessionStorage,
  clearGuestStateStorage,
  clearGuestStoryAccess,
  GUEST_SESSION_STORAGE_KEYS,
  GUEST_STATE_STORAGE_KEYS,
  GUEST_STORIES_KEY,
};
