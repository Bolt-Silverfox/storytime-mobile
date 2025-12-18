import { View, Text, Switch, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import * as SecureStore from "expo-secure-store";

const BIOMETRICS_KEY = "biometrics_enabled";

export default function EnableBiometrics() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [isEnableFaceID, setIsEnableFaceID] = useState(false);
  const [isEnableFingerPrint, setIsEnableFingerPrint] = useState(false);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      alert("Biometrics not set up on this device");
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Setup your biometrics",
      fallbackLabel: "Use passcode",
      cancelLabel: "Cancel",
    });

    return result.success;
  };

  const persistBiometrics = async (faceId: boolean, fingerprint: boolean) => {
    await SecureStore.setItemAsync(
      BIOMETRICS_KEY,
      JSON.stringify({ faceId, fingerprint })
    );
  };

  const toggleSwitchFaceID = async () => {
    const nextValue = !isEnableFaceID;

    if (nextValue) {
      const success = await authenticate();
      if (!success) return;
    }

    setIsEnableFaceID(nextValue);
    await persistBiometrics(nextValue, isEnableFingerPrint);
    navigator.navigate("indexPage");
  };

  const toggleSwitchFingerPrint = async () => {
    const nextValue = !isEnableFingerPrint;

    if (nextValue) {
      const success = await authenticate();
      if (!success) return;
    }

    setIsEnableFingerPrint(nextValue);
    await persistBiometrics(isEnableFaceID, nextValue);
    navigator.navigate("indexPage");
  };

  if (isEnableFaceID) {
    // navigator.navigate("resetParentPassword");
  }
  if (isEnableFingerPrint) {
    // navigator.navigate("EnableFingerPrint");
  }

  useEffect(() => {
  const loadSettings = async () => {
    const stored = await SecureStore.getItemAsync(BIOMETRICS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setIsEnableFaceID(!!parsed.faceId);
      setIsEnableFingerPrint(!!parsed.fingerprint);
    }
  };
  loadSettings();
}, []);


  return (
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Fingerprint/Face ID
        </Text>
      </View>
      <View className="mt-[24px] mx-[16] gap-4">
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8] justify-between rounded-[20px] px-[16] bg-white items-center">
          {/* Left text column */}
          <View className="flex-1 gap-2">
            <Text style={[defaultStyles.defaultText, { color: "black" }]}>
              ENABLE FACE ID
            </Text>
            <Text
              style={[
                defaultStyles.defaultText,
                { color: "#6B6B6B", fontSize: 13 },
              ]}
              className="text-sm"
            >
              Use your Face ID for secure actions.
            </Text>
          </View>

          {/* Right switch */}
          <Switch
            trackColor={{ false: "#E0E0E0", true: "#4807EC" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#E0E0E0"
            onValueChange={toggleSwitchFaceID}
            value={isEnableFaceID}
          />
        </View>

        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white">
          <View className="flex-1 gap-2">
            <Text style={[defaultStyles.defaultText, { color: "black" }]}>
              ENABLE FINGERPRINT
            </Text>
            <Text
              style={[
                defaultStyles.defaultText,
                { color: "#6B6B6B", fontSize: 13 },
              ]}
              className="text-sm"
            >
              Use your fingerprint for secure actions.
            </Text>
          </View>
          <View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#4807EC" }}
              thumbColor={isEnableFingerPrint ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleSwitchFingerPrint}
              value={isEnableFingerPrint}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
