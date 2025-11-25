import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import PasswordInput from "../../../components/PasswordInput";
import { z } from "zod";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";

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
  const { isLoading, errorMessage, signUp } = useAuth();

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
    // await signUp(email, password, fullName.trim(), title);
    // if (success) {
      navigator.navigate('resetPasswordSuccessful');
    // }
  };

  return (
    <View className="flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Manage Password/Pin
        </Text>
      </View>
      <View className="mx-[17]  ">
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 16 }]}
          className="mt-8 mx-auto"
        >
          Reset your Password
        </Text>
        <View className="mt-[60] gap-[16]">
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
      <View className="flex-1 justify-center px-4 gap-6">
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
      {/* <LoadingOverlay visible={isLoading} /> */}
    </View>
  );
}
