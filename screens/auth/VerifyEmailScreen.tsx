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
import { formatTime } from "../../utils/utils";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import CustomButton from "../../components/UI/CustomButton";

type VerifyEmailRouteProp = RouteProp<AuthNavigatorParamList, "verifyEmail">;

type SuccessMessageType =
  | "Otp resent successfully"
  | "Start enjoying amazing Storytime with your kids.";

const EXPIRY_KEY = "verify-email-otp_expiry";
const OTP_DURATION = 60;

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
      const expiryTime = Date.now() + OTP_DURATION * 1000;
      await AsyncStorage.setItem(EXPIRY_KEY, expiryTime.toString());
      setCountdown(OTP_DURATION);
      setSuccesMessage("Otp resent successfully");
    }
  };

  const onSuccessCb = async () => {
    await AsyncStorage.removeItem(EXPIRY_KEY);
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
    let interval: NodeJS.Timeout | undefined;
    let mounted = true;

    const init = async () => {
      let expiry = await AsyncStorage.getItem(EXPIRY_KEY);

      if (!expiry || Number(expiry) <= Date.now()) {
        expiry = String(Date.now() + OTP_DURATION * 1000);
        await AsyncStorage.setItem(EXPIRY_KEY, expiry);
      }

      const update = async () => {
        const stored = await AsyncStorage.getItem(EXPIRY_KEY);
        if (!stored || !mounted) return;

        const remaining = Math.max(
          0,
          Math.floor((Number(stored) - Date.now()) / 1000)
        );

        if (mounted) {
          setCountdown(remaining);
        }
      };

      await update();
      if (mounted) {
        interval = setInterval(update, 1000);
      }
    };

    init();

    return () => {
      mounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1">
        <PageTitle goBack={() => navigator.goBack()} title="" />
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>Verify your Email</Text>
            <Text style={styles.text}>
              Enter the verification code sent to your email{" "}
              {route.params.email}
            </Text>
          </View>
          <ErrorMessageDisplay errorMessage={error} />
          <View style={styles.otpWrapper}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => setOtp(text)}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.box,
                pinCodeTextStyle: styles.text,
                focusedPinCodeContainerStyle: styles.boxFocused,
              }}
              focusColor="blue"
            />
            <Text style={styles.countDown}>{formatTime(countDown)}</Text>
            <Pressable disabled={isLoading}>
              <Text
                onPress={handleResendEmail}
                disabled={countDown > 0}
                className={`my-11 text-center font-[abeezee] text-base  ${countDown > 0 ? "text-link/40" : "text-link"} `}
              >
                Resend OTP
              </Text>
            </Pressable>
          </View>
          <CustomButton
            disabled={isLoading}
            text={isLoading ? "Loading..." : "Verify Email"}
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
          />
        </View>
        <SuccessScreen
          message="Congratulations, your account has been created successfully!"
          secondaryMessage={successMessage!}
          visible={
            successMessage ===
            "Start enjoying amazing Storytime with your kids."
          }
          onProceed={onSuccessCb}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
  },
  otpWrapper: {
    width: "100%",
    alignItems: "center",
  },
  otpContainer: {
    justifyContent: "center",
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
