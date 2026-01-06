import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import CustomButton from "../../components/UI/CustomButton";
import SuccessScreen from "../../components/UI/SuccessScreen";
import useAuth from "../../contexts/AuthContext";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import defaultStyles from "../../styles";

const SetUserPinScreen = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const { isLoading, setInAppPin, user } = useAuth();
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();

  const onSubmit = () => {
    setInAppPin({
      pin,
      setErrorCb: setError,
      onSuccess: () => {
        setSuccess(true);
        queryClient.invalidateQueries({
          queryKey: ["userProfile", user?.id],
        });
      },
    });
  };

  const onProceed = () => {
    navigator.replace("parentProfileSetup", { screen: "enableBiometrics" });
  };

  const isButtonDisabled = pin.length < 6;

  return (
    <View className="flex flex-1 pb-5 bg-bgLight">
      <PageTitle title="Setup your PIN" goBack={() => navigator.goBack()} />
      <View className="flex flex-row mx-4 sm:mx-auto max-w-screen-md w-full items-center gap-x-5  mt-6 px-3 py-2 rounded-md">
        {data?.avatar ? (
          <Image
            className="size-[50px] rounded-full"
            source={{ uri: data.avatar.url }}
          />
        ) : (
          <Image
            className="size-[50px] rounded-full"
            source={require("../../assets/placeholder-pfp.png")}
          />
        )}

        <Text className="font-[abeezee] text-xl">{data?.name}</Text>
      </View>
      <Text className="font-[abeezee] sm:mx-auto max-w-screen-md sm:w-full text-wrap mx-4 text-base mt-6">
        Please setup your PIN to access your StoryTime parent account.
      </Text>
      <View className="flex-1 mx-4 flex gap-y-7 ">
        <ErrorMessageDisplay errorMessage={error} />
        <View className="flex flex-col gap-y-2 mx-auto max-w-screen-md w-full">
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
      </View>
      <View className="flex flex-col items-center gap-y-3">
        <CustomButton
          disabled={isButtonDisabled || isLoading}
          onPress={onSubmit}
          text={isLoading ? "Loading..." : "Set PN"}
        />
        <CustomButton
          transparent
          text="Skip"
          onPress={() => navigator.navigate("selection")}
        />
      </View>
      <SuccessScreen
        visible={success}
        message="PIN setup successful"
        secondaryMessage="You have successfully set up your Pin"
        onProceed={onProceed}
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
