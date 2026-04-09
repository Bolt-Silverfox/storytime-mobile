import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import DisclaimerInformationComponent from "../../../../components/screens/DisclaimerInformationComponent";
import { termsAndConditionsData } from "../../../../data";

const TermsAndConditions = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <DisclaimerInformationComponent
      pageTitle="Terms & Conditions"
      goBack={() => navigator.goBack()}
      data={termsAndConditionsData}
    />
  );
};

export default TermsAndConditions;
