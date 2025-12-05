import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import defaultStyles from "../../../styles";
import colours from "../../../colours";
import PageTitle from "../../../components/PageTitle";
import { useNavigation } from "@react-navigation/native";
import { ParentAuthNavigatorProps } from "../../../Navigation/ParentAuthNavigator";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import useAuth from "../../../contexts/AuthContext";
import LoadingOverlay from "../../../components/LoadingOverlay";

const VerifyTokenScreen = () => {
  const navigator = useNavigation<ParentAuthNavigatorProps>();
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const { isLoading, validatePinResetOtp } = useAuth();

  const onSubmit = () => {
    if (otp.length < 6) {
      setError("Pin must be 6 characters long");
      return;
    }
    validatePinResetOtp({
      otp,
      setErrorCb: setError,
      onSuccess: () => {
        navigator.navigate("resetPin", {
          otp,
        });
      },
    });
  };
  return (
    <View className="flex flex-1">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle goBack={() => navigator.goBack()} title="Verify reset OTP" />
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>Verify OTP</Text>
            <Text style={styles.text}>
              Enter the verification code sent to your email{" "}
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
          </View>

          <Pressable
            className="mt-10"
            onPress={onSubmit}
            style={
              isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
            }
          >
            <Text style={{ ...styles.text, color: "white" }}>
              {isLoading ? "Verifying..." : "Verify"}
            </Text>
          </Pressable>
        </View>
      </View>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default VerifyTokenScreen;

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
    paddingTop: 10,
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
