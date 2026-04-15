import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import DisclaimerInformationComponent from "../../../../components/screens/DisclaimerInformationComponent";
import {
  androidTermsAndConditionsData,
  iosTermsAndConditionsData,
} from "../../../../data";
import { Platform } from "react-native";

const TermsAndConditions = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <DisclaimerInformationComponent
      pageTitle="Terms & Conditions"
      goBack={() => navigator.goBack()}
      data={
        Platform.OS === "ios"
          ? iosTermsAndConditionsData
          : androidTermsAndConditionsData
      }
    />
  );
};

export default TermsAndConditions;
