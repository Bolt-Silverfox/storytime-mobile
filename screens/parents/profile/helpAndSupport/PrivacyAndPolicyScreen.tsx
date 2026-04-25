import { useNavigation } from "@react-navigation/native";
import React from "react";
import PrivacyScreenComponent from "../../../../components/screens/PrivacyScreenComponent";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return <PrivacyScreenComponent goBack={() => navigator.goBack()} />;
}
