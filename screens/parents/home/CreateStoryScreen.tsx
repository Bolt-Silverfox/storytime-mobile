import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../../../components/UI/CustomButton";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useAuth from "../../../contexts/AuthContext";
import useToast from "../../../contexts/ToastContext";
import useGenerateStoryAsync from "../../../hooks/tanstack/mutationHooks/useGenerateStoryAsync";
import { StoryNavigatorProp } from "../../../Navigation/StoryNavigator";
import { GenerateStoryInput } from "../../../types";

/** Split a comma/newline separated field into a trimmed, de-duped list. */
const parseList = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

/** Parse an age input into a positive integer, or undefined when empty/invalid. */
const parseAge = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // Parse the WHOLE value (Number, not parseInt) so "4.5"/"4years" are rejected
  // rather than silently truncated to 4.
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

const inputClass =
  "rounded-2xl border border-border-light bg-white px-4 py-3 font-[abeezee] text-base text-black";
const labelClass = "font-[abeezee] text-sm font-medium text-gray-500";

const CreateStoryScreen = () => {
  const navigation = useNavigation<StoryNavigatorProp>();
  const { isGuest } = useAuth();
  const { notify } = useToast();
  const { mutate: generateStory, isPending } = useGenerateStoryAsync();

  const [themes, setThemes] = useState("");
  const [categories, setCategories] = useState("");
  const [kidName, setKidName] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [language, setLanguage] = useState("English");
  const [additionalContext, setAdditionalContext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (isGuest) {
      notify("Please sign up to create your own stories.");
      return;
    }
    setError(null);

    const min = parseAge(ageMin);
    const max = parseAge(ageMax);
    if (min !== undefined && max !== undefined && min > max) {
      setError("Minimum age can't be greater than maximum age.");
      return;
    }

    const themeList = parseList(themes);
    const categoryList = parseList(categories);
    const trimmedLanguage = language.trim();
    const trimmedContext = additionalContext.trim();
    const trimmedKidName = kidName.trim();

    // All fields are optional — only send what the parent actually filled in.
    const input: GenerateStoryInput = {
      ...(themeList.length ? { themes: themeList } : {}),
      ...(categoryList.length ? { categories: categoryList } : {}),
      ...(trimmedKidName ? { kidName: trimmedKidName } : {}),
      ...(min !== undefined ? { ageMin: min } : {}),
      ...(max !== undefined ? { ageMax: max } : {}),
      ...(trimmedLanguage ? { language: trimmedLanguage } : {}),
      ...(trimmedContext ? { additionalContext: trimmedContext } : {}),
    };

    generateStory(input, {
      onSuccess: (job) => {
        navigation.navigate("generationProgress", {
          jobId: job.jobId,
          estimatedWaitTime: job.estimatedWaitTime,
        });
      },
      onError: (err) => {
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't start your story. Please try again."
        );
      },
    });
  };

  return (
    <SafeAreaWrapper variant="solid">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6 mt-2 flex-row items-center gap-x-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
            >
              <Feather name="arrow-left" size={22} color="#1a1a1a" />
            </TouchableOpacity>
            <Text className="font-[quilka] text-2xl text-black">
              Create a Story
            </Text>
          </View>

          <Text className="mb-6 font-[abeezee] text-base text-gray-600">
            Tell us what kind of story you'd like and our AI will write a fresh
            one just for you.
          </Text>

          <View className="flex-col gap-y-5">
            <View className="flex-col gap-y-2">
              <Text className={labelClass}>Themes</Text>
              <TextInput
                value={themes}
                onChangeText={setThemes}
                placeholder="e.g. friendship, courage, space"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className={inputClass}
              />
              <Text className="font-[abeezee] text-xs text-text">
                Separate multiple themes with commas.
              </Text>
            </View>

            <View className="flex-col gap-y-2">
              <Text className={labelClass}>Categories</Text>
              <TextInput
                value={categories}
                onChangeText={setCategories}
                placeholder="e.g. adventure, bedtime"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className={inputClass}
              />
              <Text className="font-[abeezee] text-xs text-text">
                Separate multiple categories with commas.
              </Text>
            </View>

            <View className="flex-col gap-y-2">
              <Text className={labelClass}>Child's name (optional)</Text>
              <TextInput
                value={kidName}
                onChangeText={setKidName}
                placeholder="e.g. Ada"
                placeholderTextColor="#9CA3AF"
                className={inputClass}
              />
            </View>

            <View className="flex-row gap-x-4">
              <View className="flex-1 flex-col gap-y-2">
                <Text className={labelClass}>Min age</Text>
                <TextInput
                  value={ageMin}
                  onChangeText={setAgeMin}
                  placeholder="4"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  className={inputClass}
                />
              </View>
              <View className="flex-1 flex-col gap-y-2">
                <Text className={labelClass}>Max age</Text>
                <TextInput
                  value={ageMax}
                  onChangeText={setAgeMax}
                  placeholder="6"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  className={inputClass}
                />
              </View>
            </View>

            <View className="flex-col gap-y-2">
              <Text className={labelClass}>Language</Text>
              <TextInput
                value={language}
                onChangeText={setLanguage}
                placeholder="English"
                placeholderTextColor="#9CA3AF"
                className={inputClass}
              />
            </View>

            <View className="flex-col gap-y-2">
              <Text className={labelClass}>Anything else? (optional)</Text>
              <TextInput
                value={additionalContext}
                onChangeText={setAdditionalContext}
                placeholder="Add any details you'd like in the story…"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className={`${inputClass} min-h-[110px]`}
              />
            </View>

            {error && (
              <View className="rounded-2xl bg-red-50 px-4 py-3">
                <Text className="font-[abeezee] text-sm text-red-600">
                  {error}
                </Text>
              </View>
            )}
          </View>

          <View className="mt-8 flex-row">
            {isPending ? (
              <View className="mx-5 mt-4 h-[46px] w-full flex-row items-center justify-center self-center rounded-full bg-primary">
                <ActivityIndicator color="white" />
              </View>
            ) : (
              <CustomButton
                text="Generate"
                onPress={handleGenerate}
                ariaLabel="Generate a story"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CreateStoryScreen;
