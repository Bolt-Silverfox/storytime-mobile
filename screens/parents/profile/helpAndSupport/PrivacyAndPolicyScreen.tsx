import { useNavigation } from "@react-navigation/native";
import React from "react";
import DisclaimerInformationComponent from "../../../../components/screens/DisclaimerInformationComponent";
import {
  androidPrivacyPolicyData,
  iosPrivacyPolicyData,
} from "../../../../data";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import { Platform } from "react-native";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <DisclaimerInformationComponent
      pageTitle="Privacy and Policy"
      goBack={() => navigator.goBack()}
      data={
        Platform.OS === "ios" ? iosPrivacyPolicyData : androidPrivacyPolicyData
      }
    />
  );
}
