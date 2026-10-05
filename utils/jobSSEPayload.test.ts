import { parseJobSSEPayload } from "./jobSSEPayload";

type Payload = {
  type?: string;
  jobId?: string;
  error?: string;
  progressMessage?: string;
  paragraphIndex?: number;
};

describe("parseJobSSEPayload", () => {
  it("returns null for empty or unparseable data", () => {
    expect(parseJobSSEPayload<Payload>(null)).toBeNull();
    expect(parseJobSSEPayload<Payload>(undefined)).toBeNull();
    expect(parseJobSSEPayload<Payload>("")).toBeNull();
    expect(parseJobSSEPayload<Payload>("not json")).toBeNull();
    expect(parseJobSSEPayload<Payload>('"a string"')).toBeNull();
    // An array is JSON and typeof "object", but spreading one yields
    // {0: ..., 1: ...}, which is not a payload.
    expect(parseJobSSEPayload<Payload>("[1,2]")).toBeNull();
  });

  it("unwraps the envelope and takes the inner payload's fields", () => {
    const data = JSON.stringify({
      id: "1",
      type: "progress",
      data: JSON.stringify({ jobId: "job-1", paragraphIndex: 2 }),
    });
    expect(parseJobSSEPayload<Payload>(data, "progress")).toEqual({
      jobId: "job-1",
      paragraphIndex: 2,
      type: "progress",
    });
  });

  it("resolves type from inner payload, then envelope, then event name", () => {
    const inner = JSON.stringify({
      id: "1",
      type: "envelope",
      data: JSON.stringify({ type: "inner" }),
    });
    expect(parseJobSSEPayload<Payload>(inner, "event")?.type).toBe("inner");

    const envelope = JSON.stringify({
      id: "1",
      type: "envelope",
      data: JSON.stringify({ jobId: "job-1" }),
    });
    expect(parseJobSSEPayload<Payload>(envelope, "event")?.type).toBe(
      "envelope"
    );

    const neither = JSON.stringify({ data: JSON.stringify({ jobId: "j" }) });
    expect(parseJobSSEPayload<Payload>(neither, "event")?.type).toBe("event");
  });

  it("keeps the outer object when `data` is a string but not JSON", () => {
    const data = JSON.stringify({ type: "plain", data: "hello" });
    expect(parseJobSSEPayload<Payload>(data)).toEqual({
      type: "plain",
      data: "hello",
    });
  });

  it("keeps a string error untouched", () => {
    const data = JSON.stringify({
      type: "failed",
      data: JSON.stringify({ error: "Voice synthesis failed" }),
    });
    expect(parseJobSSEPayload<Payload>(data)?.error).toBe(
      "Voice synthesis failed"
    );
  });

  it("drops a non-string error rather than handing it to the UI", () => {
    // Consumers type `error` as a string but check only for a value, not a
    // type: useStoryAudioBatchSSE does `payload.error ?? "Audio generation
    // failed."`, which an object sails through, to be rendered as
    // "[object Object]" or trimmed and thrown on.
    for (const error of [
      { code: 500, detail: "boom" },
      ["boom"],
      42,
      true,
      null,
    ]) {
      const data = JSON.stringify({
        type: "failed",
        data: JSON.stringify({ jobId: "job-1", error }),
      });
      // toStrictEqual, not toEqual: toEqual ignores undefined-valued keys, so
      // it would also pass for an implementation that set `error: undefined`
      // rather than removing the key.
      expect(parseJobSSEPayload<Payload>(data, "failed")).toStrictEqual({
        jobId: "job-1",
        type: "failed",
      });
    }
  });

  it("drops a non-string progressMessage, which is rendered directly", () => {
    // GenerationProgressScreen renders progressMessage as a <Text> child
    // without sanitising it, so a non-string there is a render-time failure.
    const data = JSON.stringify({
      type: "progress",
      data: JSON.stringify({
        jobId: "job-1",
        progressMessage: { stage: "tts" },
      }),
    });
    expect(parseJobSSEPayload<Payload>(data, "progress")).toStrictEqual({
      jobId: "job-1",
      type: "progress",
    });
  });

  it("keeps a string progressMessage", () => {
    const data = JSON.stringify({
      type: "progress",
      data: JSON.stringify({ progressMessage: "Generating audio" }),
    });
    expect(parseJobSSEPayload<Payload>(data)?.progressMessage).toBe(
      "Generating audio"
    );
  });

  // Regression guard rather than a test of the new behaviour: an absent error
  // was absent before this change too.
  it("leaves an absent error absent", () => {
    const data = JSON.stringify({
      type: "completed",
      data: JSON.stringify({ jobId: "job-1" }),
    });
    expect(parseJobSSEPayload<Payload>(data)).toEqual({
      jobId: "job-1",
      type: "completed",
    });
  });
});
