import { Story } from "../types";

const READ_STATUS_ORDER: Record<string, number> = {
  done: 2,
  reading: 1,
};

/**
 * Sorts stories so unread appear first, then reading, then done.
 * Preserves the original order within each group.
 */
export const sortStoriesByReadStatus = (stories: Story[]): Story[] =>
  [...stories].sort(
    (a, b) =>
      (READ_STATUS_ORDER[a.readStatus ?? ""] ?? 0) -
      (READ_STATUS_ORDER[b.readStatus ?? ""] ?? 0),
  );
