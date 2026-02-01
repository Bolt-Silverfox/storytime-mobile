import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../components/LoadingOverlay";
import PasswordInput from "../../components/PasswordInput";
import useAuth from "../../contexts/AuthContext";
import defaultStyles from "../../styles";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import SuccessScreen from "../../components/UI/SuccessScreen";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";

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
  const navigator = useNavigation<RootNavigatorProp>();
  const route = useRoute<PropRoutes>();
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, resetPassword } = useAuth();
  const [success, setSuccess] = useState(false);

  const onRegister = async () => {
    setErrors({});
    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Errors = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ResetSchema;
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
      onSuccess: () => setSuccess(true),
    });
  };

  return (
    <View className="mx-5 flex max-w-screen-md flex-col sm:mx-auto sm:w-full">
      <Text className="my-10 text-center font-[quilka] text-2xl">
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
        style={[styles.buttonMargin, defaultStyles.button]}
      >
        <Text style={styles.textWhite}>Proceed</Text>
      </Pressable>
      <LoadingOverlay visible={isLoading} />
      <SuccessScreen
        visible={success}
        message="Successful!"
        secondaryMessage="Your password has been reset"
        onProceed={() => navigator.navigate("auth", { screen: "login" })}
      />
    </View>
  );
};

export default InputNewPassword;

const styles = StyleSheet.create({
  textWhite: {
    ...defaultStyles.defaultText,
    textAlign: "center",
    color: "white",
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  buttonMargin: {
    marginTop: 44,
  },
});
