import { GUEST_DEFAULT_VOICE_ID } from "../constants";
import { DEFAULT_GUEST_VOICE_ID } from "../constants/constants";
import type { AvailableVoices as VoiceData } from "../types";

const isDefaultVoiceKey = (value: string | null | undefined) =>
  value?.trim().toUpperCase() === DEFAULT_GUEST_VOICE_ID;

const normalizeVoiceKey = (value: string | null | undefined) =>
  value?.trim().toUpperCase() ?? null;

const isGuestDefaultVoice = (
  voice: Pick<VoiceData, "id" | "name" | "type" | "elevenLabsVoiceId">
) =>
  voice.elevenLabsVoiceId === GUEST_DEFAULT_VOICE_ID ||
  isDefaultVoiceKey(voice.id) ||
  isDefaultVoiceKey(voice.name) ||
  isDefaultVoiceKey(voice.type);

const isVoiceMatch = (
  voice: Pick<VoiceData, "id" | "name" | "type" | "elevenLabsVoiceId">,
  voiceId: string | null | undefined
) => {
  if (!voiceId) return false;
  return (
    voice.id === voiceId ||
    voice.elevenLabsVoiceId === voiceId ||
    voice.name === voiceId ||
    voice.type === voiceId ||
    normalizeVoiceKey(voice.id) === normalizeVoiceKey(voiceId) ||
    normalizeVoiceKey(voice.name) === normalizeVoiceKey(voiceId) ||
    normalizeVoiceKey(voice.type) === normalizeVoiceKey(voiceId)
  );
};

const getDefaultVoiceListId = (voices: VoiceData[] | null | undefined) => {
  if (!voices?.length) return null;
  const defaultVoice = voices.find(isGuestDefaultVoice);
  return defaultVoice?.id ?? null;
};

const getGuestAudioVoiceId = (voices: VoiceData[] | null | undefined) => {
  if (!voices?.length) return GUEST_DEFAULT_VOICE_ID;
  const defaultVoice = voices.find(isGuestDefaultVoice);
  return defaultVoice?.elevenLabsVoiceId ?? GUEST_DEFAULT_VOICE_ID;
};

const normalizePreferredVoice = <
  T extends Partial<VoiceData> | null | undefined,
>(
  voice: T
) => {
  if (!voice) return null;
  const isBackendDefaultPlaceholder =
    normalizeVoiceKey(voice.id) === "DEFAULT" &&
    normalizeVoiceKey(voice.name) === "DEFAULT" &&
    !voice.elevenLabsVoiceId;

  return isBackendDefaultPlaceholder ? null : voice;
};

const resolveVoiceIdForAudio = ({
  availableVoices,
  isGuest,
  voiceId,
}: {
  availableVoices: VoiceData[] | null | undefined;
  isGuest: boolean;
  voiceId: string | null;
}) => {
  if (isGuest) return getGuestAudioVoiceId(availableVoices);
  if (!voiceId) return null;

  // If voices haven't loaded yet, but voiceId is a known system voice,
  // return the appropriate ElevenLabs ID for that voice
  const nimbusElevenLabsId = "XrExE9yKIg1WjnnlVkGX";
  const isNimbus = normalizeVoiceKey(voiceId) === "NIMBUS";
  if (isNimbus && !availableVoices?.length) {
    return nimbusElevenLabsId;
  }

  if (!availableVoices?.length) return null;

  const voice = availableVoices.find((v) => isVoiceMatch(v, voiceId));
  return voice?.elevenLabsVoiceId ?? null;
};

export {
  getDefaultVoiceListId,
  getGuestAudioVoiceId,
  isGuestDefaultVoice,
  isVoiceMatch,
  normalizePreferredVoice,
  resolveVoiceIdForAudio,
};
