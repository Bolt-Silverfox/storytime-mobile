import AsyncStorage from "@react-native-async-storage/async-storage";

const GUEST_STORIES_KEY = "guestStoriesRead";

const GUEST_MODE_KEY = "guestMode";

const GUEST_SESSION_STORAGE_KEYS = ["guestSessionId", "guestSessionCreatedAt"];

const GUEST_STATE_STORAGE_KEYS = [
  GUEST_MODE_KEY,
  ...GUEST_SESSION_STORAGE_KEYS,
  "guestDeviceId",
];

const clearGuestStoryAccess = () => AsyncStorage.removeItem(GUEST_STORIES_KEY);

const clearGuestSessionStorage = () =>
  __DEV__ ? AsyncStorage.multiRemove(GUEST_SESSION_STORAGE_KEYS) : undefined;

const clearGuestStateStorage = () =>
  AsyncStorage.multiRemove(
    __DEV__ ? GUEST_STATE_STORAGE_KEYS : [GUEST_MODE_KEY]
  );

export {
  GUEST_MODE_KEY,
  clearGuestSessionStorage,
  clearGuestStateStorage,
  clearGuestStoryAccess,
  GUEST_SESSION_STORAGE_KEYS,
  GUEST_STATE_STORAGE_KEYS,
  GUEST_STORIES_KEY,
};
