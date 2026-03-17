import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";
import colours from "../../../colours";

const sendTokenSchema = z.object({
  email: z.email({ error: "Email is required" }),
});

type ResetPassword = z.infer<typeof sendTokenSchema>;
type Errors = Partial<Record<keyof ResetPassword, string>>;

const SendResetTokenScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { isLoading, user, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");

  const onSendToken = () => {
    setError("");
    setErrors({});

    const parsedInput = sendTokenSchema.safeParse({ email });
    if (!parsedInput.success) {
      const formatted: Errors = {};

      parsedInput.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ResetPassword;
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }

    requestPasswordReset({
      email,
      setErrorCb: setError,
      onSuccess: () => navigator.navigate("resetPassword"),
    });
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight">
        <PageTitle title="Send reset token" goBack={() => navigator.goBack()} />
        <View className="mx-[17] mt-10 max-w-screen-md md:mx-auto md:w-full lg:max-w-screen-lg xl:max-w-screen-xl">
          {error && <ErrorMessageDisplay errorMessage={error} />}
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Email:</Text>
            <TextInput
              className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base ${error ? "border-red-600" : "border-border"}`}
              placeholder="Enter your email"
              placeholderTextColor={
                error || errors.email ? "red" : colours.text
              }
              onChangeText={setEmail}
              value={email}
              editable={false}
            />
            {errors.email && (
              <ErrorMessageDisplay errorMessage={errors.email} />
            )}
          </View>
        </View>
        <View className="flex-1 gap-6 px-4">
          <CustomButton onPress={onSendToken} text="Send reset token" />
        </View>
        <LoadingOverlay visible={isLoading} />
      </View>
    </SafeAreaWrapper>
  );
};

export default SendResetTokenScreen;

const styles = StyleSheet.create({
  formItem: {
    gap: 4,
  },
});
