import { GUEST_DEFAULT_VOICE_ID } from "../constants";
import { DEFAULT_GUEST_VOICE_ID } from "../constants/constants";
import type { AvailableVoices as VoiceData } from "../types";
import {
  getDefaultVoiceListId,
  getGuestAudioVoiceId,
  isGuestDefaultVoice,
  isVoiceMatch,
  normalizePreferredVoice,
  resolveVoiceIdForAudio,
} from "./voice";

const makeVoice = (overrides: Partial<VoiceData> = {}): VoiceData => ({
  id: "voice-list-id",
  name: "Nimbus",
  displayName: "Nimbus",
  type: "NIMBUS",
  previewUrl: "https://example.com/preview.mp3",
  voiceAvatar: "https://example.com/avatar.png",
  elevenLabsVoiceId: "elevenlabs-nimbus",
  ...overrides,
});

describe("voice helpers", () => {
  describe("isGuestDefaultVoice", () => {
    const defaultVoiceCases = [
      {
        label: "elevenLabsVoiceId",
        voice: makeVoice({ elevenLabsVoiceId: GUEST_DEFAULT_VOICE_ID }),
      },
      {
        label: "id",
        voice: makeVoice({ id: DEFAULT_GUEST_VOICE_ID }),
      },
      {
        label: "name",
        voice: makeVoice({ name: ` ${DEFAULT_GUEST_VOICE_ID.toLowerCase()} ` }),
      },
      {
        label: "type",
        voice: makeVoice({ type: DEFAULT_GUEST_VOICE_ID.toLowerCase() }),
      },
    ];

    it.each(defaultVoiceCases)(
      "detects guest default voice by $label",
      ({ voice }) => {
        expect(isGuestDefaultVoice(voice)).toBe(true);
      }
    );

    it("rejects unrelated voices", () => {
      expect(
        isGuestDefaultVoice(
          makeVoice({
            id: "storyteller",
            name: "Storyteller",
            type: "STORYTELLER",
            elevenLabsVoiceId: "elevenlabs-storyteller",
          })
        )
      ).toBe(false);
    });
  });

  describe("isVoiceMatch", () => {
    const voice = makeVoice({
      id: "voice-id",
      name: "Friendly Voice",
      type: "FRIENDLY",
      elevenLabsVoiceId: "elevenlabs-friendly",
    });

    const matchCases = [
      { label: "id", voiceId: "voice-id" },
      { label: "name", voiceId: "Friendly Voice" },
      { label: "type", voiceId: "FRIENDLY" },
      { label: "elevenLabsVoiceId", voiceId: "elevenlabs-friendly" },
      { label: "normalized id", voiceId: " voice-id " },
      { label: "normalized name", voiceId: "friendly voice" },
      { label: "normalized type", voiceId: " friendly " },
    ];

    it.each(matchCases)("matches by $label", ({ voiceId }) => {
      expect(isVoiceMatch(voice, voiceId)).toBe(true);
    });

    it.each([
      { label: "null", voiceId: null },
      { label: "undefined", voiceId: undefined },
      { label: "unrelated value", voiceId: "other-voice" },
    ])("rejects $label voice ids", ({ voiceId }) => {
      expect(isVoiceMatch(voice, voiceId)).toBe(false);
    });
  });

  describe("default selectors", () => {
    it("returns the list id for the guest default voice", () => {
      const voices = [
        makeVoice({ id: "other", name: "Other", type: "OTHER" }),
        makeVoice({
          id: "guest-default-list-id",
          elevenLabsVoiceId: GUEST_DEFAULT_VOICE_ID,
        }),
      ];

      expect(getDefaultVoiceListId(voices)).toBe("guest-default-list-id");
    });

    it.each([
      { label: "empty list", voices: [] },
      {
        label: "missing default voice",
        voices: [
          makeVoice({
            id: "other",
            name: "Other",
            type: "OTHER",
            elevenLabsVoiceId: "elevenlabs-other",
          }),
        ],
      },
      { label: "null list", voices: null },
      { label: "undefined list", voices: undefined },
    ])("returns null for $label", ({ voices }) => {
      expect(getDefaultVoiceListId(voices)).toBeNull();
    });

    it("returns the guest audio id from the default voice", () => {
      const voices = [
        makeVoice({
          id: DEFAULT_GUEST_VOICE_ID,
          elevenLabsVoiceId: GUEST_DEFAULT_VOICE_ID,
        }),
      ];

      expect(getGuestAudioVoiceId(voices)).toBe(GUEST_DEFAULT_VOICE_ID);
    });

    it.each([
      { label: "empty list", voices: [] },
      { label: "null list", voices: null },
      { label: "undefined list", voices: undefined },
    ])("falls back to guest audio id for $label", ({ voices }) => {
      expect(getGuestAudioVoiceId(voices)).toBe(GUEST_DEFAULT_VOICE_ID);
    });
  });

  describe("resolveVoiceIdForAudio", () => {
    const voices = [
      makeVoice({
        id: "voice-id",
        name: "Friendly Voice",
        type: "FRIENDLY",
        elevenLabsVoiceId: "elevenlabs-friendly",
      }),
      makeVoice({
        id: DEFAULT_GUEST_VOICE_ID,
        elevenLabsVoiceId: GUEST_DEFAULT_VOICE_ID,
      }),
    ];

    it("returns the guest default audio id for guest readers", () => {
      expect(
        resolveVoiceIdForAudio({
          availableVoices: voices,
          isGuest: true,
          voiceId: "voice-id",
        })
      ).toBe(GUEST_DEFAULT_VOICE_ID);
    });

    it("returns the guest default audio id when guest voices are unavailable", () => {
      expect(
        resolveVoiceIdForAudio({
          availableVoices: null,
          isGuest: true,
          voiceId: "voice-id",
        })
      ).toBe(GUEST_DEFAULT_VOICE_ID);
    });

    it.each([
      { label: "missing voice id", availableVoices: voices, voiceId: null },
      {
        label: "empty available voices",
        availableVoices: [],
        voiceId: "voice-id",
      },
      {
        label: "unmatched voice id",
        availableVoices: voices,
        voiceId: "unknown-voice",
      },
    ])(
      "returns null for non-guest readers with $label",
      ({ availableVoices, voiceId }) => {
        expect(
          resolveVoiceIdForAudio({
            availableVoices,
            isGuest: false,
            voiceId,
          })
        ).toBeNull();
      }
    );

    it("returns the hardcoded Nimbus ElevenLabs id when voices haven't loaded but voiceId is Nimbus", () => {
      expect(
        resolveVoiceIdForAudio({
          availableVoices: null,
          isGuest: false,
          voiceId: "NIMBUS",
        })
      ).toBe("XrExE9yKIg1WjnnlVkGX");
    });

    it.each([
      { label: "id", voiceId: "voice-id" },
      { label: "name", voiceId: "Friendly Voice" },
      { label: "type", voiceId: "friendly" },
    ])("returns the matched ElevenLabs id by $label", ({ voiceId }) => {
      expect(
        resolveVoiceIdForAudio({
          availableVoices: voices,
          isGuest: false,
          voiceId,
        })
      ).toBe("elevenlabs-friendly");
    });
  });

  describe("normalizePreferredVoice", () => {
    it("returns null for the backend default preferred voice placeholder", () => {
      expect(
        normalizePreferredVoice({
          id: "default",
          name: "default",
          displayName: "Default Voice",
        })
      ).toBeNull();
    });

    it("keeps a real preferred voice", () => {
      const voice = makeVoice({ id: "voice-id", name: "Nimbus" });

      expect(normalizePreferredVoice(voice)).toBe(voice);
    });
  });
});
