import { View, Text, Switch, Pressable } from "react-native";
import { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

export default function EnableBiometrics() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [isEnableFaceID, setIsEnableFaceID] = useState(false);

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

  const toggleSwitchFaceID = async () => {
  if (!isEnableFaceID) {
    const success = await authenticate();
    if (!success) return;
  }
  setIsEnableFaceID(!isEnableFaceID);
};


  const [isEnableFingerPrint, setIsEnableFingerPrint] = useState(false);
  const toggleSwitchFingerPrint = async () => {
  if (!isEnableFingerPrint) {
    const success = await authenticate();
    if (!success) return;
  }
  setIsEnableFingerPrint(!isEnableFingerPrint);
};


  if (isEnableFaceID) {
    // navigator.navigate("resetParentPassword");
  }
  if (isEnableFingerPrint) {
    // navigator.navigate("EnableFingerPrint");
  }

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
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white">
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="self-center"
          >
            ENABLE FACE ID
          </Text>
          <View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#4807EC" }}
              thumbColor={isEnableFaceID ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleSwitchFaceID}
              value={isEnableFaceID}
            />
          </View>
        </View>
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white">
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="self-center"
          >
            ENABLE FINGERPRINT
          </Text>
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

      <View className="flex-1 justify-end  px-4 gap-6">
        <Pressable
          className="pb-10"
          onPress={() => navigator.navigate("indexPage")}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full bg-[#EC4007]`}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
