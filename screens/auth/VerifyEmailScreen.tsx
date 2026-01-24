import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import PageTitle from "../../components/PageTitle";
import SuccessScreen from "../../components/UI/SuccessScreen";
import useAuth from "../../contexts/AuthContext";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

type VerifyEmailRouteProp = RouteProp<AuthNavigatorParamList, "verifyEmail">;

const successMessages = [
  "Otp resent successfully",
  "Start enjoying amazing Storytime with your kids.",
] as const;

type SuccessMessageType = (typeof successMessages)[number];

const VerifyEmailScreen = () => {
  const route = useRoute<VerifyEmailRouteProp>();
  const navigator = useNavigation<RootNavigatorProp>();
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccesMessage] =
    useState<SuccessMessageType | null>(null);
  const [error, setError] = useState("");
  const { isLoading, verifyEmail, resendVerificationEmail, setUser } =
    useAuth();
  const [countDown, setCountdown] = useState(59);

  const handleResendEmail = async () => {
    setSuccesMessage(null);
    const data = await resendVerificationEmail({
      email: route.params.email.trim(),
      setErrorCb: setError,
    });
    if (data.success) {
      setCountdown(59);
      setSuccesMessage("Otp resent successfully");
    }
  };

  const onSuccessCb = async () => {
    const unverifiedUser = await AsyncStorage.getItem("unverifiedUser");
    if (unverifiedUser) {
      await AsyncStorage.setItem("user", unverifiedUser);
      setUser(JSON.parse(unverifiedUser));
      Keyboard.dismiss();
    } else {
      Keyboard.dismiss();
      navigator.navigate("auth", { screen: "login" });
    }
  };

  useEffect(() => {
    if (countDown < 1) return;
    setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
  }, [countDown]);

  return (
    <View className="flex flex-1">
      <PageTitle goBack={() => navigator.goBack()} title="" />
      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          <Text style={defaultStyles.heading}>Verify your Email</Text>
          <Text style={styles.text}>
            Enter the verification code sent to your email {route.params.email}
          </Text>
        </View>
        <ErrorMessageDisplay errorMessage={error} />
        <View>
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
          <Text style={styles.countDown}>
            00:{countDown > 0 ? countDown : "00"}
          </Text>
          <Text
            onPress={handleResendEmail}
            disabled={countDown > 0}
            className={`font-[abeezee] text-base my-11 text-center  ${countDown > 0 ? "text-link/40" : "text-link"} `}
          >
            Resend OTP
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            verifyEmail({
              token: otp,
              setErrorCb: setError,
              onSuccess: () =>
                setSuccesMessage(
                  "Start enjoying amazing Storytime with your kids."
                ),
            });
          }}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Loading..." : "Verify Email"}
          </Text>
        </Pressable>
      </View>
      <SuccessScreen
        message="Congratulations, your account has been created succesfully!"
        secondaryMessage={successMessage!}
        visible={
          successMessage === "Start enjoying amazing Storytime with your kids."
        }
        onProceed={onSuccessCb}
      />
    </View>
  );
};

export default VerifyEmailScreen;

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
    marginBottom: 56,
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
