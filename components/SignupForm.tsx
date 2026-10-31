import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import useAuth from "../contexts/AuthContext";
import { RootNavigatorProp } from "../Navigation/RootNavigator";
import { useDefaultStyles } from "../styles";
import { registerSchema } from "../zodSchemas";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import LoadingOverlay from "./LoadingOverlay";
import PasswordInput from "./PasswordInput";
import CustomButton from "./UI/CustomButton";
import { useTheme } from "../theme/ThemeContext";

type RegisterSchema = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof RegisterSchema, string>>;

// cleanup with reducer later
const SignupForm = () => {
  const defaultStyles = useDefaultStyles();
  const { tokens } = useTheme();
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, signUp } = useAuth();
  const navigator = useNavigation<RootNavigatorProp>();

  const onRegister = async () => {
    setErrors({});
    const result = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Errors = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterSchema;
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }
    signUp({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      setErrorCb: setApiError,
      onSuccess: () =>
        navigator.navigate("auth", {
          screen: "verifyEmail",
          params: {
            email,
          },
        }),
    });
  };

  return (
    <View>
      <View style={styles.form}>
        {apiError && <ErrorMessageDisplay errorMessage={apiError} />}
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Full Name</Text>
          <TextInput
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-fg ${errors.fullName ? "border-red-600" : "border-line"}`}
            placeholderTextColor={errors.fullName ? "red" : tokens.textBody}
            placeholder="Enter your name"
            onChangeText={setFullName}
            value={fullName}
          />
          {errors.fullName && (
            <Text className="text-sm text-danger">{errors.fullName}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Email Address</Text>
          <TextInput
            placeholder="Enter your email address"
            onChangeText={setEmail}
            value={email}
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-fg ${errors.email ? "border-red-600" : "border-line"}`}
            placeholderTextColor={errors.email ? "red" : tokens.textBody}
          />
          {errors.email && (
            <Text className="text-sm text-danger">{errors.email}</Text>
          )}
        </View>
        <PasswordInput
          label="Password:"
          setPassword={setPassword}
          password={password}
          placeholder="Enter your password"
          errorMessage={errors.password}
        />
        <PasswordInput
          label="Confirm Password:"
          setPassword={setConfirmPassword}
          password={confirmPassword}
          placeholder="Confirm your password"
          errorMessage={errors.confirmPassword}
        />
      </View>
      <CustomButton
        onPress={onRegister}
        disabled={isLoading}
        text="Create Account"
      />

      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
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
