import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { SuccessScreen } from "./ResetPasswordSuccessFul";

export default function FeedBackMessageSuccess() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const onNavigate = () => {
    navigator.navigate("helpAndSupport");
  };
  return (
    <SuccessScreen
      onPress={onNavigate}
      message="Your message has been sent successfully"
    />
  );
}
