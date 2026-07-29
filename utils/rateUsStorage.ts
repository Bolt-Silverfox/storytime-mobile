import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Per-user local counter of finished stories, used to decide when to surface
 * the "Rate Us" prompt. Kept in AsyncStorage (not the backend) so the trigger
 * is device-local and survives app restarts.
 */
const finishedStoryKey = (userId: string) => `rateUs:finishedStories:${userId}`;

/**
 * In-memory mirror of the finished-story count, keyed by user id. It is bumped
 * SYNCHRONOUSLY on increment (before the async AsyncStorage write) so that an
 * eligibility read immediately after finishing a story — e.g. the user finishes
 * story 1 and instantly opens story 2 — never races the write and reads a stale
 * 0. AsyncStorage stays the source of truth across app restarts; reads take the
 * max of the two so neither a not-yet-persisted nor a prior-session count is lost.
 */
const memCount: Record<string, number> = {};

const readStored = async (userId: string): Promise<number> => {
  try {
    const raw = await AsyncStorage.getItem(finishedStoryKey(userId));
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

/** Returns the number of stories this user has finished on this device (0 if unknown). */
const getFinishedStoryCount = async (
  userId?: string | null
): Promise<number> => {
  if (!userId) return 0;
  const stored = await readStored(userId);
  return Math.max(stored, memCount[userId] ?? 0);
};

/** Increments the finished-story counter for this user. No-op when no userId. */
const incrementFinishedStoryCount = async (
  userId?: string | null
): Promise<void> => {
  if (!userId) return;
  // Reflect the increment in memory synchronously (this runs before the first
  // await), so a concurrent getFinishedStoryCount observes it right away.
  memCount[userId] = (memCount[userId] ?? 0) + 1;
  try {
    const stored = await readStored(userId);
    const next = Math.max(stored + 1, memCount[userId]);
    memCount[userId] = next;
    await AsyncStorage.setItem(finishedStoryKey(userId), String(next));
  } catch {
    // Best-effort persistence; the in-memory count still counts this session.
  }
};

export { getFinishedStoryCount, incrementFinishedStoryCount };
