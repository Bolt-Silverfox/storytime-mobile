import { useNavigation } from "@react-navigation/native";
import React from "react";
import DisclaimerInformationComponent from "../../../../components/screens/DisclaimerInformationComponent";
import { privacyPolicyData } from "../../../../data";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <DisclaimerInformationComponent
      pageTitle="Privacy and Policy"
      goBack={() => navigator.goBack()}
      data={privacyPolicyData}
    />
  );
}
