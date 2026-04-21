import React from "react";
import { Platform } from "react-native";
import {
  androidTermsAndConditionsData,
  iosTermsAndConditionsData,
} from "../../data";
import DisclaimerInformationComponent from "./DisclaimerInformationComponent";

const TermsAndConditionsScreenComponent = ({
  goBack,
}: {
  goBack: () => void;
}) => {
  return (
    <DisclaimerInformationComponent
      pageTitle="Terms & Conditions"
      goBack={goBack}
      data={
        Platform.OS === "ios"
          ? iosTermsAndConditionsData
          : androidTermsAndConditionsData
      }
    />
  );
};

export default TermsAndConditionsScreenComponent;
