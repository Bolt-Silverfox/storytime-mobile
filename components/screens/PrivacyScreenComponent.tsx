import { Platform } from "react-native";
import DisclaimerInformationComponent from "../../components/screens/DisclaimerInformationComponent";
import { androidPrivacyPolicyData, iosPrivacyPolicyData } from "../../data";

const PrivacyScreenComponent = ({ goBack }: { goBack: () => void }) => {
  return (
    <DisclaimerInformationComponent
      pageTitle="Privacy Policy"
      goBack={goBack}
      data={
        Platform.OS === "ios" ? iosPrivacyPolicyData : androidPrivacyPolicyData
      }
    />
  );
};

export default PrivacyScreenComponent;
