import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { ParentAuthNavigatorProps } from "../../../Navigation/ParentAuthNavigator";
import colours from "../../../colours";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import PageTitle from "../../../components/PageTitle";
import useAuth from "../../../contexts/AuthContext";
import defaultStyles from "../../../styles";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import LoadingOverlay from "../../../components/LoadingOverlay";

const VerifyPinScreen = () => {
  const navigator = useNavigation<ParentAuthNavigatorProps>();
  const parentNav = useNavigation<ProtectedRoutesNavigationProp>();
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const { isLoading, verifyInAppPin, requestPinReset } = useAuth();

  const onSubmit = () => {
    if (otp.length < 6) {
      setError("Pin must be 6 characters long");
      return;
    }
    verifyInAppPin({
      pin: otp,
      setErrorCb: setError,
      onSuccess: () => {
        parentNav.navigate("parents");
      },
    });
  };
  return (
    <View className="flex flex-1">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle goBack={() => navigator.goBack()} title="Enter your Pin" />
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>
              Verify your Pin to continue
            </Text>
          </View>
          {error && (
            <View className="flex flex-row justify-center mb-5">
              <ErrorMessageDisplay errorMessage={error} />
            </View>
          )}
          <View style={styles.container}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => setOtp(text)}
              theme={{
                containerStyle: { width: "auto" },
                pinCodeContainerStyle: styles.box,
                pinCodeTextStyle: styles.text,
                focusedPinCodeContainerStyle: styles.boxFocused,
              }}
              focusColor="blue"
            />
            <Pressable
              onPress={() =>
                requestPinReset({
                  setErrorCb: setError,
                  onSuccess: () => {
                    navigator.navigate("verifyToken");
                  },
                })
              }
            >
              <Text className="font-[abeezee] text-link self-end mt-3">
                Forgot Pin?
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onSubmit}
            className="mt-20"
            style={
              isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
            }
          >
            <Text style={{ ...styles.text, color: "white" }}>
              {isLoading ? "Loading..." : "Verify"}
            </Text>
          </Pressable>
        </View>
      </View>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default VerifyPinScreen;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textContainer: {
    gap: 8,
    marginBottom: 20,
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 32,
  },
  formItem: {
    gap: 4,
  },

  container: {
    paddingHorizontal: 20,
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
  countDown: {
    ...defaultStyles.linkText,
    textAlign: "right",
    marginTop: 8,
  },
});
