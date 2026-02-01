import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import colours from "../../../../colours";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import SuccessScreen from "../../../../components/UI/SuccessScreen";
import useSubmitFeedback from "../../../../hooks/tanstack/mutationHooks/useSubmitFeedback";
import ErrorMessageDisplay from "../../../../components/ErrorMessageDisplay";

const feedBack = z.object({
  fullName: z.string().trim().min(1, "Name is required"),

  email: z.email("Invalid email, try again"),

  message: z.string().min(1, "feedback should not be empty"),
});

type FeedBackSchema = z.infer<typeof feedBack>;
type Errors = Partial<Record<keyof FeedBackSchema, string>>;

export default function SuggestionsScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [errors, setErrors] = useState<Errors>({});

  const { mutate: submitFeedback, isPending } = useSubmitFeedback({
    onSuccess: () => setSuccess(true),
    onError: (msg) => setApiError(msg),
  });

  const handleSubmit = () => {
    setErrors({});
    setApiError("");
    const result = feedBack.safeParse({
      fullName,
      email,
      message,
    });
    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FeedBackSchema;
        formatted[field] = err.message;
      });
      setErrors(formatted);
      return;
    }
    submitFeedback({
      fullname: fullName.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });
  };

  return (
    <View className="flex-1 bg-[#FFFCFBFB]">
      <View className="relative flex-row justify-center gap-[10px] border-b-[0.5px] border-[#EAE8E8] bg-white p-4 ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, suggestStyles.headerTitle]}
          className="self-center text-center  "
        >
          Suggestions & Feedback
        </Text>
      </View>
      <View className="mb-8 mt-9 items-center">
        <Text
          style={[defaultStyles.defaultText, suggestStyles.subtitle]}
          className="max-w-[311px] text-center"
        >
          Share your ideas, suggestions or issues to help us improve your
          experience
        </Text>
      </View>
      <View className="mx-4 gap-4">
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Name:</Text>
          <TextInput
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${errors.fullName ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.fullName ? "red" : colours.text}
            onChangeText={setFullName}
            value={fullName}
          />
          {errors.fullName && (
            <Text className="text-sm text-red-600">{errors.fullName}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Email:</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
          />
          {errors.email && (
            <Text className="text-sm text-red-600">{errors.email}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Message:</Text>
          <TextInput
            style={suggestStyles.textArea}
            onChangeText={setMessage}
            value={message}
            className={`relative min-h-[40]  justify-center rounded-[20px] border px-4 font-[abeezee] text-base text-black ${errors.message ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.message ? "red" : colours.text}
            multiline
          />
          {errors.message && (
            <Text className="text-sm text-red-600">{errors.message}</Text>
          )}
          {apiError ? <ErrorMessageDisplay errorMessage={apiError} /> : null}
        </View>
      </View>
      <View className="flex-1 justify-end  gap-6 px-4">
        <Pressable
          className="pb-10"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text
            style={[defaultStyles.defaultText, suggestStyles.whiteText]}
            className={` mx-auto w-full rounded-[99px] px-2 py-3 text-center  ${
              Object.keys(errors).length === 0 && !isPending
                ? "bg-[#EC4007]"
                : "bg-[#FF8771]"
            }`}
          >
            {isPending ? "Sending…" : "Save"}
          </Text>
        </Pressable>
      </View>
      <SuccessScreen
        message="Success!"
        secondaryMessage="Your message has been sent successfully"
        visible={success}
        onProceed={() => navigator.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formItem: {
    gap: 4,
  },
});

const suggestStyles = StyleSheet.create({
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
  },
  textArea: {
    height: 150,
    maxHeight: 140,
    textAlignVertical: "top",
  },
  whiteText: {
    color: "white",
  },
});
