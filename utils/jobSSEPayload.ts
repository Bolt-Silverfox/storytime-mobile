/**
 * Decoding for events on the shared job stream, GET /events/jobs/:jobId.
 *
 * The stream wraps each event in an envelope whose `data` is the event
 * re-encoded as a string: `{id, type, data: "{...}"}`. Parsing only the outer
 * layer looks like it works — the envelope also carries `type`, so the right
 * branch is entered — but `result` lives in the INNER payload, so fields such
 * as `paragraphIndex`/`audioUrl` come back undefined and the event is silently
 * dropped. Unwrapping blindly is just as wrong: if the envelope carries the
 * event name and the inner payload does not, `type` is lost and the job never
 * reaches a terminal state.
 *
 * So: take the inner payload's fields, and resolve `type` from the inner
 * payload, then the envelope, then — as a last resort — the SSE event name the
 * listener was registered under.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object";

export const parseJobSSEPayload = <T>(
  data: string | null | undefined,
  eventName?: string
): T | null => {
  if (!data) return null;

  let outer: unknown;
  try {
    outer = JSON.parse(data);
  } catch {
    return null;
  }

  let inner: unknown = outer;
  if (isRecord(outer) && typeof outer.data === "string") {
    try {
      inner = JSON.parse(outer.data);
    } catch {
      // A `data` string that isn't JSON means this is a plain event whose
      // payload happens to have a string `data` field; keep the outer object.
      inner = outer;
    }
  }

  if (!isRecord(inner)) return null;

  const type =
    inner.type ?? (isRecord(outer) ? outer.type : undefined) ?? eventName;

  return { ...inner, ...(type === undefined ? {} : { type }) } as T;
};

export default parseJobSSEPayload;
