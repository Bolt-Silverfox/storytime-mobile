import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import colours from "../../../colours";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";
import { useQueryClient } from "@tanstack/react-query";

const SetPin = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const { isLoading, setInAppPin, user } = useAuth();
  const queryClient = useQueryClient();

  const onSubmit = () => {
    if (pin !== confirmPin) {
      setError("Both pins must match");
      return;
    }
    setInAppPin({
      pin,
      setErrorCb: setError,
      onSuccess: () => {
        Alert.alert("Pin set successfully!");
        navigator.goBack();
        queryClient.invalidateQueries({
          queryKey: ["userProfile", user?.id],
        });
      },
    });
  };

  return (
    <View className="flex flex-1 pb-5 bg-bgLight">
      <PageTitle title="Set Pin" goBack={() => navigator.goBack()} />
      <View className="flex-1 mx-4 flex gap-y-7 py-6">
        <ErrorMessageDisplay errorMessage={error} />
        <View className="flex flex-col gap-y-2">
          <Text className="font-[abeezee]">Enter your Pin</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setPin(text)}
            onFilled={(text) => console.log("OTP:", text)}
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
          <Text className="font-[abeezee]">Confirm your Pin</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setConfirmPin(text)}
            onFilled={(text) => console.log("OTP:", text)}
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

export default SetPin;

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
