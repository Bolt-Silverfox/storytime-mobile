import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { SuccessScreen } from "./ResetPasswordSuccessFul";

export default function DeleteAccountSuccessful() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const onNavigate = () => {
    // navigator.navigate('');
  };
  return (
    <SuccessScreen
      onPress={onNavigate}
      message="Your account and all connected information have been permanently deleted."
    />
  );
}
