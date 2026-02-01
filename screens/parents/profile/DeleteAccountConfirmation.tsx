import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { useNavigation } from "@react-navigation/native";
import defaultStyles from "../../../styles";
import z from "zod";
import colours from "../../../colours";
import useAuth from "../../../contexts/AuthContext";
import PageTitle from "../../../components/PageTitle";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../../components/LoadingOverlay";

const feedBack = z.object({
  email: z.email("Invalid email, try again"),
});

type FeedBackSchema = z.infer<typeof feedBack>;
type Errors = Partial<Record<keyof FeedBackSchema, string>>;

export default function DeleteAccount() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const { isLoading, deleteAccount } = useAuth();

  const handleSubmit = async () => {
    setErrors({});
    const result = feedBack.safeParse({
      email,
    });
    if (!result.success) {
      const formatted: Errors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FeedBackSchema;
        formatted[field] = err.message;
      });
      setErrors(formatted);
      return;
    }
    deleteAccount(setApiError);
    // navigator.navigate("deleteAccountSuccessful");
  };

  return (
    <View className="flex-1 ">
      <PageTitle title="Delete Account" goBack={() => navigator.goBack()} />
      <ScrollView
        className="mx-[16] flex-1 "
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-12  items-center">
          <Text
            style={[defaultStyles.defaultText, styles.textFontSize]}
            className="mt-4 max-w-[311px] text-center"
          >
            Enter your email to confirm account deletion
          </Text>
        </View>
        <View style={styles.formItem} className="mt-8">
          {/* <Text style={defaultStyles.label}>Enter email address</Text> */}
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="Enter email address"
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
          />
          {errors.email && (
            <Text className="text-sm text-red-600">{errors.email}</Text>
          )}
          {apiError && <ErrorMessageDisplay errorMessage={apiError} />}
        </View>
      </ScrollView>
      <View className="mx-[16] my-8 flex  justify-center gap-6">
        <Pressable onPress={handleSubmit}>
          <Text
            style={[defaultStyles.defaultText, styles.whiteText]}
            className="mx-auto w-full rounded-[99px] bg-[#EC4007] px-2 py-3 text-center"
          >
            Delete Account
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigator.reset({
              index: 0,
              routes: [{ name: "indexPage" }],
            });
          }}
        >
          <Text
            style={[defaultStyles.defaultText, styles.blackText]}
            className="mx-auto w-full  rounded-[99px] border-[0.5px] border-[#212121] px-2 py-3 text-center"
          >
            Cancel
          </Text>
        </Pressable>
      </View>
      <LoadingOverlay visible={isLoading} label="Deleting your account..." />
    </View>
  );
}

const styles = StyleSheet.create({
  formItem: {
    gap: 4,
  },
  textFontSize: {
    fontSize: 16,
  },
  whiteText: {
    color: "white",
  },
  blackText: {
    color: "black",
  },
});
