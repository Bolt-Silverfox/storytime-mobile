import { useQuery } from "@tanstack/react-query";
import { lazy, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import queryAvailableVoices from "../../../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetPreferredVoice from "../../../hooks/tanstack/queryHooks/useGetPreferredVoice";
import useSetPreferredVoice from "../../../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import Icon from "../../../components/Icon";
import SuspenseWrapper from "../../../components/supsense/SuspenseWrapper";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";

const AvailableVoices = lazy(
  () => import("../../../components/AvailableVoices")
);

const DefaultVoiceScreen = () => {
  const navigation = useNavigation();
  const { data: preferredVoice } = useGetPreferredVoice();
  const { data: voices } = useQuery(queryAvailableVoices);
  const { mutate: markPreferred } = useSetPreferredVoice();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    preferredVoice?.id ?? null
  );

  // Sync selectedVoice once preferredVoice query resolves (initializer may run before data loads)
  const hasSynced = useRef(false);
  useEffect(() => {
    if (hasSynced.current || !preferredVoice) return;
    hasSynced.current = true;
    setSelectedVoice(preferredVoice.id);
  }, [preferredVoice]);

  const selectedVoiceDisplay = voices?.find(
    (v) =>
      v.id === selectedVoice ||
      v.elevenLabsVoiceId === selectedVoice ||
      v.name === selectedVoice
  );

  const handleSave = () => {
    if (selectedVoice) {
      markPreferred(selectedVoice, {
        onSuccess: () => navigation.goBack(),
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between border-b border-b-border-lighter px-4 pb-4 pt-4">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon name="ArrowLeft" size={24} color="black" />
          </Pressable>
          <Text className="font-[abeezee] text-base text-black">
            Default Voice
          </Text>
          <View className="w-6" />
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={screenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-4 mt-6 flex-row items-center justify-between rounded-2xl border border-border-lighter p-4">
            <View className="flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-text">
                Selected Story Voice
              </Text>
              <Text className="font-[quilka] text-2xl text-black">
                {selectedVoiceDisplay?.displayName ??
                  selectedVoiceDisplay?.name ??
                  (!selectedVoice
                    ? "No voice selected"
                    : voices
                      ? "Unknown voice"
                      : "Loading...")}
              </Text>
            </View>
            <Icon name="CircleCheck" color="green" />
          </View>
          <SuspenseWrapper>
            <AvailableVoices
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              deferSave
            />
          </SuspenseWrapper>
          <Pressable
            onPress={handleSave}
            className="mx-4 mt-2 items-center rounded-full bg-primary px-2 py-3"
            accessibilityLabel="Save default voice"
            accessibilityRole="button"
          >
            <Text className="font-[abeezee] text-base text-white">
              Save default voice
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

const screenStyles = StyleSheet.create({
  scrollContent: { paddingBottom: 24 },
});

export default DefaultVoiceScreen;
