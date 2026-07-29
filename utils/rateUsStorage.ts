import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Per-user local counter of finished stories, used to decide when to surface
 * the "Rate Us" prompt. Kept in AsyncStorage (not the backend) so the trigger
 * is device-local and survives app restarts.
 */
const finishedStoryKey = (userId: string) => `rateUs:finishedStories:${userId}`;

/** Returns the number of stories this user has finished on this device (0 if unknown). */
const getFinishedStoryCount = async (
  userId?: string | null
): Promise<number> => {
  if (!userId) return 0;
  try {
    const raw = await AsyncStorage.getItem(finishedStoryKey(userId));
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

/** Increments the finished-story counter for this user. No-op when no userId. */
const incrementFinishedStoryCount = async (
  userId?: string | null
): Promise<void> => {
  if (!userId) return;
  try {
    const current = await getFinishedStoryCount(userId);
    await AsyncStorage.setItem(finishedStoryKey(userId), String(current + 1));
  } catch {
    // Best-effort persistence; a failed increment should never break story flow.
  }
};

export { getFinishedStoryCount, incrementFinishedStoryCount };
