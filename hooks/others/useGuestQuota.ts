import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const GUEST_STORIES_KEY = "guestStoriesRead";
const GUEST_FREE_LIMIT = 10;

/**
 * Device-local quota tracking for guest users.
 * Tracks story IDs read in AsyncStorage.
 */
const useGuestQuota = () => {
  const [readStoryIds, setReadStoryIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const readStoryIdsRef = useRef<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(GUEST_STORIES_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as string[];
          setReadStoryIds(parsed);
          readStoryIdsRef.current = parsed;
        } catch {
          setReadStoryIds([]);
          readStoryIdsRef.current = [];
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const canAccessStory = useCallback(
    (storyId: string) => {
      if (!isLoaded) return false;
      if (readStoryIds.includes(storyId)) return true;
      return readStoryIds.length < GUEST_FREE_LIMIT;
    },
    [readStoryIds, isLoaded]
  );

  const recordStoryAccess = useCallback(
    async (storyId: string) => {
      if (readStoryIds.includes(storyId)) return;
      const updated = [...readStoryIds, storyId];
      setReadStoryIds(updated);
      readStoryIdsRef.current = updated;
      await AsyncStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
    },
    [readStoryIds]
  );

  /**
   * Atomic check-and-consume: reads from ref for latest state,
   * performs the quota check and records access in one call.
   * Returns true if access was granted, false if quota exceeded.
   */
  const tryAccessStory = useCallback(async (storyId: string) => {
    const current = readStoryIdsRef.current;
    if (current.includes(storyId)) return true;
    if (current.length >= GUEST_FREE_LIMIT) return false;

    const updated = [...current, storyId];
    readStoryIdsRef.current = updated;
    setReadStoryIds(updated);
    await AsyncStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
    return true;
  }, []);

  const resetQuota = useCallback(async () => {
    setReadStoryIds([]);
    readStoryIdsRef.current = [];
    await AsyncStorage.removeItem(GUEST_STORIES_KEY);
  }, []);

  return {
    isLoaded,
    used: readStoryIds.length,
    remaining: isLoaded
      ? Math.max(0, GUEST_FREE_LIMIT - readStoryIds.length)
      : 0,
    totalAllowed: GUEST_FREE_LIMIT,
    canAccessStory,
    recordStoryAccess,
    tryAccessStory,
    resetQuota,
  };
};

export default useGuestQuota;
