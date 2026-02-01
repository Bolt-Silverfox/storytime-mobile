import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import PageTitle from "../../components/PageTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../../utils/utils";

type VerifyEmailRouteProp = RouteProp<
  AuthNavigatorParamList,
  "confirmResetPasswordToken"
>;

const OTP_DURATION = 60;
const RESET_EXPIRY_KEY = "reset_password_otp_expiry";

const ConfirmResetPasswordTokenScreen = () => {
  const route = useRoute<VerifyEmailRouteProp>();
  const navigator = useNavigation<RootNavigatorProp>();
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccesMessage] = useState("");
  const { isLoading, validatePasswordReset, resendVerificationEmail } =
    useAuth();
  const [countDown, setCountdown] = useState(OTP_DURATION);

  const handleResendEmail = async () => {
    setSuccesMessage("");
    const data = await resendVerificationEmail({
      email: route.params.email.trim(),
      setErrorCb: setError,
    });
    if (data.success) {
      const expiry = Date.now() + OTP_DURATION * 1000;
      await AsyncStorage.setItem(RESET_EXPIRY_KEY, String(expiry));
      setCountdown(OTP_DURATION);
      setSuccesMessage("Otp resent successfully");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const init = async () => {
      let expiry = await AsyncStorage.getItem(RESET_EXPIRY_KEY);

      if (!expiry || Number(expiry) <= Date.now()) {
        expiry = String(Date.now() + OTP_DURATION * 1000);
        await AsyncStorage.setItem(RESET_EXPIRY_KEY, expiry);
      }

      const update = async () => {
        const stored = await AsyncStorage.getItem(RESET_EXPIRY_KEY);
        if (!stored) return;

        const remaining = Math.max(
          0,
          Math.floor((Number(stored) - Date.now()) / 1000)
        );

        setCountdown(remaining);
      };

      await update();
      interval = setInterval(update, 1000);
    };

    init();

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex flex-1">
      <PageTitle goBack={() => navigator.goBack()} title="" />
      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          {successMessage.length > 0 && (
            <Text className="text-center font-[abeezee] text-xl uppercase text-primary">
              {successMessage}
            </Text>
          )}
          <Text style={defaultStyles.heading}>Reset your password</Text>
          <Text style={styles.text}>
            Enter the verification code sent to your emails {route.params.email}
          </Text>
        </View>
        <ErrorMessageDisplay errorMessage={error} />
        <View style={styles.container}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            onFilled={() => {}}
            theme={{
              containerStyle: { width: "auto" },
              pinCodeContainerStyle: styles.box,
              pinCodeTextStyle: styles.text,
              focusedPinCodeContainerStyle: styles.boxFocused,
            }}
            focusColor="blue"
          />
          <Text style={styles.countDown}>{formatTime(countDown)}</Text>
          <Text
            onPress={handleResendEmail}
            disabled={countDown > 0}
            className={`my-11 text-center font-[abeezee] text-base  ${countDown > 0 ? "text-link/40" : "text-link"} `}
          >
            Resend OTP
          </Text>
        </View>

        <Pressable
          onPress={() =>
            validatePasswordReset({
              email: route.params.email.trim(),
              token: otp,
              setErrorCb: setError,
              onSuccess: () =>
                navigator.navigate("auth", {
                  screen: "inputNewPassword",
                  params: {
                    email: route.params.email.trim(),
                    token: otp,
                  },
                }),
            })
          }
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={styles.textWhite}>
            {isLoading ? "Loading..." : "Verify Email"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ConfirmResetPasswordTokenScreen;

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textWhite: {
    ...defaultStyles.defaultText,
    textAlign: "center",
    color: "white",
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
  },
  container: {
    width: "100%",
    alignItems: "center",
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
