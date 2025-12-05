import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../../colours";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";
import {
  ParentAuthNavigatorParamList,
  ParentAuthNavigatorProps,
} from "../../../Navigation/ParentAuthNavigator";

type RoutePropTypes = RouteProp<ParentAuthNavigatorParamList, "resetPin">;

const ResetPinScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<ParentAuthNavigatorProps>();
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const { isLoading, resetPinWithOtp } = useAuth();

  const onSubmit = () => {
    if (pin !== confirmPin) {
      setError("Both pins must match");
      return;
    }
    resetPinWithOtp({
      otp: params.otp,
      newPin: pin,
      confirmNewPin: confirmPin,
      setErrorCb: setError,
      onSuccess: () => {
        Alert.alert("Pin reset successfully");
        navigator.reset({
          index: 0,
          routes: [{ name: "verifyPin" }],
        });
      },
    });
  };

  return (
    <View className="flex flex-1 pb-5">
      <PageTitle title="Reset Pin" goBack={() => navigator.goBack()} />
      <View className="flex-1 mt-5 mx-4 flex gap-y-7 py-6">
        {error && <ErrorMessageDisplay errorMessage={error} />}
        <View className="flex flex-col gap-y-2">
          <Text className="font-[abeezee]">Enter your new Pin</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setPin(text)}
            theme={{
              containerStyle: { width: "auto" },
              pinCodeContainerStyle: styles.box,
              pinCodeTextStyle: styles.text,
              focusedPinCodeContainerStyle: styles.boxFocused,
            }}
            focusColor="blue"
          />
        </View>
        <View className="flex flex-col gap-y-2">
          <Text className="font-[abeezee]">Confirm your new Pin</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setConfirmPin(text)}
            theme={{
              containerStyle: { width: "auto" },
              pinCodeContainerStyle: styles.box,
              pinCodeTextStyle: styles.text,
              focusedPinCodeContainerStyle: styles.boxFocused,
            }}
            focusColor="blue"
          />
        </View>
        <CustomButton
          onPress={onSubmit}
          text={isLoading ? "Loading..." : "Save changes"}
        />
      </View>
    </View>
  );
};

export default ResetPinScreen;

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 47,
    height: 47,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  boxFocused: {
    borderColor: colours.primary,
  },
});
