import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const GUEST_STORIES_KEY = "guestStoriesRead";
const GUEST_FREE_LIMIT = 10;

/**
 * Device-local quota tracking for guest users.
 * Tracks story IDs read in AsyncStorage.
 */
const useGuestQuota = () => {
  const [readStoryIds, setReadStoryIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(GUEST_STORIES_KEY).then((stored) => {
      if (stored) {
        try {
          setReadStoryIds(JSON.parse(stored));
        } catch {
          setReadStoryIds([]);
        }
      }
    });
  }, []);

  const canAccessStory = useCallback(
    (storyId: string) => {
      if (readStoryIds.includes(storyId)) return true;
      return readStoryIds.length < GUEST_FREE_LIMIT;
    },
    [readStoryIds]
  );

  const recordStoryAccess = useCallback(
    async (storyId: string) => {
      if (readStoryIds.includes(storyId)) return;
      const updated = [...readStoryIds, storyId];
      setReadStoryIds(updated);
      await AsyncStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
    },
    [readStoryIds]
  );

  const resetQuota = useCallback(async () => {
    setReadStoryIds([]);
    await AsyncStorage.removeItem(GUEST_STORIES_KEY);
  }, []);

  return {
    used: readStoryIds.length,
    remaining: Math.max(0, GUEST_FREE_LIMIT - readStoryIds.length),
    totalAllowed: GUEST_FREE_LIMIT,
    canAccessStory,
    recordStoryAccess,
    resetQuota,
  };
};

export default useGuestQuota;
