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
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Suggestions & Feedback
        </Text>
      </View>
      <View className="mt-9 mb-8 items-center">
        <Text
          style={[defaultStyles.defaultText, { fontSize: 16 }]}
          className="text-center max-w-[311px]"
        >
          Share your ideas, suggestions or issues to help us improve your
          experience
        </Text>
      </View>
      <View className="mx-4 gap-4">
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Name:</Text>
          <TextInput
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errors.fullName ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.fullName ? "red" : colours.text}
            onChangeText={setFullName}
            value={fullName}
          />
          {errors.fullName && (
            <Text className="text-red-600 text-sm">{errors.fullName}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Email:</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
          />
          {errors.email && (
            <Text className="text-red-600 text-sm">{errors.email}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Message:</Text>
          <TextInput
            style={{
              height: 150,
              maxHeight: 140,
              textAlignVertical: "top",
            }}
            onChangeText={setMessage}
            value={message}
            className={`border rounded-[20px]  font-[abeezee] justify-center min-h-[40] text-base text-black relative px-4 ${errors.message ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.message ? "red" : colours.text}
            multiline
          />
          {errors.message && (
            <Text className="text-red-600 text-sm">{errors.message}</Text>
          )}
          {apiError ? (
            <ErrorMessageDisplay errorMessage={apiError} />
          ) : null}
        </View>
      </View>
      <View className="flex-1 justify-end  px-4 gap-6">
        <Pressable
          className="pb-10"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full  ${Object.keys(errors).length === 0 && !isPending
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
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  formItem: {
    gap: 4,
  },
});
