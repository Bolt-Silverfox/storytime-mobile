import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import PasswordInput from "../../../components/PasswordInput";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";

const resetPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),

    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
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

  const onResetPassword = async () => {
    setErrors({});
    const result = resetPasswordSchema.safeParse({
      oldPassword,
      newPassword,
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
    changePassword({
      oldPassword,
      newPassword,
      onSuccess: () => {
        Alert.alert("Password changed");
        navigator.goBack();
      },
      setErrorCb: setError,
    });
  };

  return (
    <View className="flex-1">
      <PageTitle
        title="Reset your password"
        goBack={() => navigator.goBack()}
      />
      <View className="mx-[17]  ">
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
      <View className="flex-1 mt-10 px-4 gap-6">
        <Pressable onPress={onResetPassword}>
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={`rounded-[99px] py-3 px-2 text-center mx-auto w-full bg-[#FF8771] ${
              Object.keys(errors).length === 0 && "bg-[#EC4007]"
            }`}
          >
            Reset Password
          </Text>
        </Pressable>
      </View>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
