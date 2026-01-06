import * as LocalAuthentiction from "expo-local-authentication";
import { Alert } from "react-native";

const useBioMetrics = () => {
  const checkFingerPrintStatus = async (): Promise<boolean> => {
    const result = await LocalAuthentiction.isEnrolledAsync();
    console.log("fingerprint data status", result);

    return result;
  };

  const checkHardwareStatus = async (): Promise<boolean> => {
    const result = await LocalAuthentiction.hasHardwareAsync();
    console.log("hardware status", result);
    return result;
  };

  const enableBiometrics = async () => {
    if (!checkHardwareStatus) {
      Alert.alert("Your device doesn't support biometric authentication!");
      return;
    }
    if (!checkFingerPrintStatus) {
      Alert.alert(
        "Your don't have any biometric data on your device, add biometrics your device and try again"
      );
      return;
    }
    const result: LocalAuthentiction.LocalAuthenticationResult =
      await LocalAuthentiction.authenticateAsync({
        biometricsSecurityLevel: "strong",
        promptMessage: "Setup your biometrics",
      });
    // MAKE A POST REQUEST TO THE BACKEND, AND UPDAGTE THE USER'S FINGERIPRINT FIELD, ALSO UPDATE THE QUERYDATA ON USERPROFILE
    console.log("authentiction result", result);
  };

  return { checkFingerPrintStatus, checkHardwareStatus, enableBiometrics };
};

export default useBioMetrics;
