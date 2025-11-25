import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { z } from "zod";
import colours from "../../../colours";

const feedBack = z.object({
  fullName: z.string().trim().min(1, "Name is required"),

  email: z.email("Invalid email, try again"),

  message: z.string().min(1, "feedback should not be empty"),
});

type FeedBackSchema = z.infer<typeof feedBack>;
type Errors = Partial<Record<keyof FeedBackSchema, string>>;

export default function Feedback() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async () => {
    setErrors({});
    const result = feedBack.safeParse({
      fullName,
      email,
      message,
    });
    if (!result.success) {
      const formatted: any = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }
    // await signUp(email, password, fullName.trim(), title);
    navigator.navigate("feedBackMessageSuccessful");
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
            className={`border rounded-[20px]  font-[abeezee] justify-center min-h-[40] text-base text-black relative px-4 ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.message ? "red" : colours.text}
            multiline
          />
          {errors.message && (
            <Text className="text-red-600 text-sm">{errors.message}</Text>
          )}
        </View>
      </View>
      <View className="flex-1 justify-end  px-4 gap-6">
        <Pressable className="pb-10" onPress={handleSubmit}>
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full  ${
              Object.keys(errors).length === 0 ? "bg-[#EC4007]" : "bg-[#FF8771]"
            }`}
          >
            Save
          </Text>
        </Pressable>
      </View>
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
