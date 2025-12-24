import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import CustomButton from "../../components/UI/CustomButton";
import useAuth from "../../contexts/AuthContext";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import defaultStyles from "../../styles";

// USE SUCCESS MODAL TO SHOW SUCCESS SCREEN, INSTEAD OF ADDING A NEW SCREEN TO A NAVIGATOR; CREATE A REUSABLE COMPONENT THAT ACCEPTS MESSAGE PROP AND ONCONTINUE CTA BUTTON ACTION.

const SetUserPinScreen = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const { isLoading, setInAppPin, user } = useAuth();
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();

  useEffect(() => {
    if (data?.pinSet) {
      console.log("pin is set");
      navigator.navigate("parentProfileSetup", {
        screen: "enableBiometrics",
      });
    }
  }, [data]);

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

  const onProceed = () => {
    navigator.navigate("parentProfileSetup", { screen: "enableBiometrics" });
  };

  const isButtonDisabled =
    pin !== confirmPin || !pin || !confirmPin || error.length > 0;

  return (
    <View className="flex flex-1 pb-5 bg-bgLight">
      <PageTitle title="Setup your PIN" goBack={() => navigator.goBack()} />
      <Button title="Navigate" onPress={onProceed} />
      <View className="flex flex-row mx-4 items-center gap-x-5  mt-6 px-3 py-2 rounded-md">
        <Image
          className="size-[50px] rounded-full"
          source={require("../../assets/life-of-pi.png")}
        />
        <Text className="font-[abeezee] text-xl">Samson Benson</Text>
      </View>
      <Text className="font-[abeezee] mx-4 text-base mt-6">
        Please setup your PIN to access your StoryTime parent account.
      </Text>
      <View className="flex-1 mx-4 flex gap-y-7 ">
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
      </View>
      <CustomButton
        disabled={isButtonDisabled}
        onPress={onSubmit}
        text={isLoading ? "Loading..." : "Set PN"}
      />
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default SetUserPinScreen;

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
