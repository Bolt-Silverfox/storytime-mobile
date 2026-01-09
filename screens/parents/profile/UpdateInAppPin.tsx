import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import colours from "../../../colours";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";
import SuccessScreen from "../../../components/UI/SuccessScreen";

const UpdateInAppPin = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const { isLoading, updateInAppPin } = useAuth();
  const [success, setSuccess] = useState(false);

  const onSubmit = () => {
    if (pin !== confirmPin) {
      setError("Both pins must match");
      return;
    }
    updateInAppPin({
      oldPin,
      newPin: pin,
      confirmNewPin: confirmPin,
      setErrorCb: setError,
      onSuccess: () => {
        Keyboard.dismiss();
        setSuccess(true);
      },
    });
  };

  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle title="Update Pin" goBack={() => navigator.goBack()} />
      <View className="flex-1 mx-4 md:max-w-md md:mx-auto md:w-full flex gap-y-7 py-6">
        <ErrorMessageDisplay errorMessage={error} />
        <View className="flex flex-col gap-y-2">
          <Text className="font-[abeezee]">Enter your Old Pin</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOldPin(text)}
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
      <SuccessScreen
        visible={success}
        message="Success!"
        secondaryMessage="Pin updated successfully"
        onProceed={() => navigator.goBack()}
      />
    </View>
  );
};

export default UpdateInAppPin;

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
