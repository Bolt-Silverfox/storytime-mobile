import { useQuery } from "@tanstack/react-query";
import { Dispatch, lazy, SetStateAction, Suspense } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import queryAvailableVoices from "../../hooks/tanstack/queryHooks/queryAvailableVoices";
import useSetPreferredVoice from "../../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import useAuth from "../../contexts/AuthContext";
import { GUEST_DEFAULT_VOICE_ID } from "../../constants";
import { isGuestDefaultVoice, isVoiceMatch } from "../../utils/voice";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

const AvailableVoices = lazy(() => import("../AvailableVoices"));

type PropTypes = {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
  storyId?: string;
  /** Show "Save default voice" button and defer persistence to button press */
  showSaveButton?: boolean;
} & Omit<CustomModalProps, "children">;

const SelectReadingVoiceModal = ({
  isOpen,
  onClose,
  selectedVoice,
  setSelectedVoice,
  storyId,
  showSaveButton = false,
}: PropTypes) => {
  const {
    data: voices,
    isLoading: voicesLoading,
    isError: voicesError,
  } = useQuery(queryAvailableVoices);
  const { mutate: markPreferred } = useSetPreferredVoice();
  const { isGuest, user } = useAuth();
  const isGuestReader = isGuest || !user;
  const guestDefaultVoice = voices?.find(isGuestDefaultVoice);
  const effectiveSelectedVoice =
    selectedVoice ?? (isGuestReader ? GUEST_DEFAULT_VOICE_ID : null);
  const selectedVoiceDisplay = voices?.find((v) =>
    isVoiceMatch(v, effectiveSelectedVoice)
  );
  const displayedSelectedVoice = isGuestReader
    ? (guestDefaultVoice ?? selectedVoiceDisplay)
    : selectedVoiceDisplay;

  const handleSave = () => {
    if (isGuestReader) {
      onClose();
      return;
    }
    if (selectedVoice) {
      markPreferred(selectedVoice, {
        onSuccess: () => onClose(),
      });
    }
    // When showSaveButton is true (first-time setup), don't close without a voice selection
    // When showSaveButton is false (manual open), allow closing even without selection
  };

  if (voicesError) {
    return (
      <CustomModal isOpen={isOpen} onClose={onClose} maxHeight={0.9}>
        <View className="flex flex-1 items-center justify-center">
          <Text className="font-[abeezee] text-red-600">
            Failed to load voices. Please try again.
          </Text>
        </View>
      </CustomModal>
    );
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} maxHeight={0.9}>
      <View className="flex flex-1 flex-col gap-y-6">
        <View className="flex flex-row items-center justify-between border-b border-b-border-lighter pb-6">
          <Text className="font-[abeezee] text-base text-black">
            Try new voice
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        {showSaveButton && (
          <View className="rounded-2xl bg-blue/10 p-4">
            <Text className="font-[abeezee] text-sm leading-5 text-text">
              Choose a voice to enable audio for your stories. This will become
              your default voice.
            </Text>
          </View>
        )}
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row items-center justify-between rounded-2xl border border-border-lighter p-4">
            <View className="flex flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-text">
                Selected Story Voice
              </Text>
              <Text className="font-[quilka] text-2xl text-black">
                {displayedSelectedVoice?.displayName ??
                  displayedSelectedVoice?.name ??
                  (isGuestReader
                    ? "Guest default"
                    : !effectiveSelectedVoice
                      ? "No voice selected"
                      : voices
                        ? "Unknown voice"
                        : "Loading...")}
              </Text>
            </View>
            <Icon name="CircleCheck" color="green" />
          </View>
          {voicesLoading ? (
            <View className="flex items-center justify-center py-8">
              <Text className="font-[abeezee] text-text">
                Loading voices...
              </Text>
            </View>
          ) : (
            <Suspense fallback={<ActivityIndicator className="py-8" />}>
              <AvailableVoices
                selectedVoice={effectiveSelectedVoice}
                setSelectedVoice={setSelectedVoice}
                storyId={storyId}
                deferSave={showSaveButton}
                isGuest={isGuestReader}
              />
            </Suspense>
          )}
          {showSaveButton && (
            <Pressable
              onPress={handleSave}
              disabled={!selectedVoice}
              className={`mx-2 items-center rounded-full px-2 py-3 ${
                selectedVoice ? "bg-primary" : "bg-primary/50"
              }`}
            >
              <Text className="font-[abeezee] text-base text-white">
                Save default voice
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default SelectReadingVoiceModal;
