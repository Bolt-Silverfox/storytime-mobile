import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import colours from "../colours";
import useAuth from "../contexts/AuthContext";
import { RootNavigatorProp } from "../Navigation/RootNavigator";
import defaultStyles from "../styles";
import { registerSchema } from "../zodSchemas";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import LoadingOverlay from "./LoadingOverlay";
import PasswordInput from "./PasswordInput";

type RegisterSchema = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof RegisterSchema, string>>;

// cleanup with reducer later
const SignupForm = () => {
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
      const formatted: any = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }
    await signUp({
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
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${errors.fullName ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.fullName ? "red" : colours.text}
            placeholder="Enter your name"
            onChangeText={setFullName}
            value={fullName}
          />
          {errors.fullName && (
            <Text className="text-sm text-red-600">{errors.fullName}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Email Address</Text>
          <TextInput
            placeholder="Enter your email address"
            onChangeText={setEmail}
            value={email}
            className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
          />
          {errors.email && (
            <Text className="text-sm text-red-600">{errors.email}</Text>
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
      <Pressable
        onPress={onRegister}
        style={[{ marginTop: 44 }, defaultStyles.button]}
      >
        <Text style={{ ...styles.text, color: "white" }}>Create Account</Text>
      </Pressable>

      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
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
