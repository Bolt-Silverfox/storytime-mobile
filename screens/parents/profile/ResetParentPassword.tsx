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
import useAuth from "../../../contexts/AuthContext";
import SuccessScreen from "../../../components/UI/SuccessScreen";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import { passwordSchema } from "../../../zodSchemas";

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both password fields must match",
  });

type ResetPassword = z.infer<typeof resetPasswordSchema>;
type Errors = Partial<Record<keyof ResetPassword, string>>;

export default function ResetParentPassword() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");
  const { isLoading, changePassword } = useAuth();
  const [success, setSuccess] = useState(false);

  const onResetPassword = async () => {
    setErrors({});
    setError("");
    const result = resetPasswordSchema.safeParse({
      oldPassword,
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
    changePassword({
      oldPassword,
      newPassword,
      onSuccess: () => {
        Keyboard.dismiss();
        setSuccess(true);
      },
      setErrorCb: setError,
    });
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight">
        <PageTitle
          title="Reset your password"
          goBack={() => navigator.goBack()}
        />
        <View className="mx-[17] max-w-screen-md md:mx-auto md:w-full">
          <View className="mt-[60] gap-[16px]">
            {error && <ErrorMessageDisplay errorMessage={error} />}
            <PasswordInput
              label="Enter old password:"
              setPassword={setOldPassword}
              password={oldPassword}
              placeholder="Enter old password"
              errorMessage={errors.oldPassword}
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
          onProceed={() => navigator.goBack()}
        />
        <LoadingOverlay visible={isLoading} />
      </View>
    </SafeAreaWrapper>
  );
}
