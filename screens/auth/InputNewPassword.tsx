import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../components/LoadingOverlay";
import PasswordInput from "../../components/PasswordInput";
import useAuth from "../../contexts/AuthContext";
import defaultStyles from "../../styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long"),

    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both password fields must match",
  });

type ResetSchema = z.infer<typeof resetPasswordSchema>;
type Errors = Partial<Record<keyof ResetSchema, string>>;

type PropRoutes = RouteProp<AuthNavigatorParamList, "inputNewPassword">;

const InputNewPassword = () => {
  const route = useRoute<PropRoutes>();
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, resetPassword } = useAuth();

  const onRegister = async () => {
    setErrors({});
    const result = resetPasswordSchema.safeParse({
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
    await resetPassword({
      email: route.params.email.trim(),
      token: route.params.token.trim(),
      newPassword: confirmPassword,
      setErrorCb: setApiError,
    });
  };

  return (
    <View className="flex flex-col mx-5 max-w-screen-md sm:mx-auto sm:w-full">
      <Text className="font-[quilka] text-2xl text-center my-10">
        Input your New Password
      </Text>
      <View style={styles.form}>
        <ErrorMessageDisplay errorMessage={apiError} />

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
        <Text style={{ ...styles.text, color: "white" }}>Proceed</Text>
      </Pressable>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default InputNewPassword;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
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
  eyeImage: {
    top: 37,
    right: 16,
    position: "absolute",
  },
});
