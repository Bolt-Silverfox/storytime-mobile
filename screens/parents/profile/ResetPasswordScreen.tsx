import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { z } from "zod";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import PasswordInput from "../../../components/PasswordInput";
import CustomButton from "../../../components/UI/CustomButton";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import SuccessScreen from "../../../components/UI/SuccessScreen";
import useAuth from "../../../contexts/AuthContext";
import { passwordSchema } from "../../../zodSchemas";

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .regex(/^\d{6,}$/, "Token must be at least 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both password fields must match",
  });

type ResetPassword = z.infer<typeof resetPasswordSchema>;
type Errors = Partial<Record<keyof ResetPassword, string>>;

const ResetPasswordScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");
  const { isLoading, resetPassword, user } = useAuth();
  const [success, setSuccess] = useState(false);

  const onResetPassword = async () => {
    setErrors({});
    setError("");
    const result = resetPasswordSchema.safeParse({
      token,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Errors = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ResetPassword;
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }

    await resetPassword({
      email: user!.email,
      token,
      newPassword,
      setErrorCb: setError,
      onSuccess: () => {
        Keyboard.dismiss();
        setSuccess(true);
      },
    });
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight">
        <PageTitle
          title="Reset your password"
          goBack={() => navigator.goBack()}
        />
        <View className="mx-[17] max-w-screen-md md:mx-auto md:w-full lg:max-w-screen-lg xl:max-w-screen-xl">
          <View className="mt-[60] gap-[16px]">
            {error && <ErrorMessageDisplay errorMessage={error} />}
            <PasswordInput
              label="Enter token:"
              setPassword={setToken}
              password={token}
              placeholder="Enter token"
              errorMessage={errors.token}
            />
            <PasswordInput
              label="Enter new password:"
              setPassword={setNewPassword}
              password={newPassword}
              placeholder="Enter new password"
              errorMessage={errors.newPassword}
            />
            <PasswordInput
              label="Confirm new password:"
              setPassword={setConfirmPassword}
              password={confirmPassword}
              placeholder="Confirm new password"
              errorMessage={errors.confirmPassword}
            />
          </View>
        </View>
        <View className="mt-10 flex-1 gap-6 px-4">
          <CustomButton onPress={onResetPassword} text="Reset Password" />
        </View>
        <SuccessScreen
          visible={success}
          message="Success!"
          secondaryMessage="Password reset successful"
          onProceed={() =>
            navigator.reset({ index: 0, routes: [{ name: "indexPage" }] })
          }
        />
        <LoadingOverlay visible={isLoading} />
      </View>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;
