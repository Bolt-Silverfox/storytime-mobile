import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { guestLogger } from "../../utils/logger";

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
    AsyncStorage.getItem(GUEST_STORIES_KEY)
      .then((stored) => {
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
      })
      .catch(() => {
        // Storage read failed — treat as empty quota
        setReadStoryIds([]);
        readStoryIdsRef.current = [];
      })
      .finally(() => {
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
      try {
        await AsyncStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
      } catch (err) {
        // Rollback in-memory state on persistence failure
        setReadStoryIds(readStoryIds);
        readStoryIdsRef.current = readStoryIds;
        guestLogger.error("Failed to persist guest quota:", err);
      }
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
    try {
      await AsyncStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
    } catch (err) {
      // Rollback in-memory state on persistence failure
      readStoryIdsRef.current = current;
      setReadStoryIds(current);
      guestLogger.error("Failed to persist guest quota:", err);
      return false;
    }
    return true;
  }, []);

  const resetQuota = useCallback(async () => {
    const prev = readStoryIdsRef.current;
    setReadStoryIds([]);
    readStoryIdsRef.current = [];
    try {
      await AsyncStorage.removeItem(GUEST_STORIES_KEY);
    } catch (err) {
      // Restore in-memory state on failure
      setReadStoryIds(prev);
      readStoryIdsRef.current = prev;
      guestLogger.error("Failed to reset guest quota:", err);
    }
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
