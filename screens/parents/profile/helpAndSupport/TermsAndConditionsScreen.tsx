import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import TermsAndConditionsScreenComponent from "../../../../components/screens/TermsAndConditionsScreenComponent";

const TermsAndConditions = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <TermsAndConditionsScreenComponent goBack={() => navigator.goBack()} />
  );
};

export default TermsAndConditions;
