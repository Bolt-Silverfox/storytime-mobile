import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { makeDefaultStyles, useDefaultStyles } from "../../styles";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import PageTitle from "../../components/PageTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../../utils/utils";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import CustomButton from "../../components/UI/CustomButton";
import { useTheme } from "../../theme/ThemeContext";
import type { Tokens } from "../../theme/tokens";

type VerifyEmailRouteProp = RouteProp<
  AuthNavigatorParamList,
  "confirmResetPasswordToken"
>;

const OTP_DURATION = 60;
export const RESET_CODE_LENGTH = 8;
const VALID_RESET_CODE = /^(\d{6}|\d{8})$/;
const SCREEN_HORIZONTAL_PADDING = 17;
const BOX_MARGIN = 2;
const MAX_BOX_WIDTH = 34;
const MIN_BOX_WIDTH = 24;

const boxWidthFor = (windowWidth: number) => {
  const available = windowWidth - 2 * SCREEN_HORIZONTAL_PADDING;
  const perBox = Math.floor(available / RESET_CODE_LENGTH) - 2 * BOX_MARGIN;
  return Math.max(MIN_BOX_WIDTH, Math.min(MAX_BOX_WIDTH, perBox));
};
const RESET_EXPIRY_KEY = "reset_password_otp_expiry";

const ConfirmResetPasswordTokenScreen = () => {
  const defaultStyles = useDefaultStyles();
  const { tokens, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const styles = useMemo(
    () => makeStyles(defaultStyles, tokens, boxWidthFor(windowWidth)),
    [defaultStyles, tokens, windowWidth]
  );
  const route = useRoute<VerifyEmailRouteProp>();
  const navigator = useNavigation<RootNavigatorProp>();
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const otpRef = useRef<OtpInputRef>(null);
  const [successMessage, setSuccesMessage] = useState("");
  const { isLoading, validatePasswordReset, resendVerificationEmail } =
    useAuth();
  const isCodeComplete = VALID_RESET_CODE.test(otp);
  const [countDown, setCountdown] = useState(OTP_DURATION);

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setOtp(digits);
    if (digits !== text) otpRef.current?.setValue(digits);
  };

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
    let interval: NodeJS.Timeout | undefined;
    let mounted = true;

    const init = async () => {
      let expiry = await AsyncStorage.getItem(RESET_EXPIRY_KEY);

      if (!expiry || Number(expiry) <= Date.now()) {
        expiry = String(Date.now() + OTP_DURATION * 1000);
        await AsyncStorage.setItem(RESET_EXPIRY_KEY, expiry);
      }

      const update = async () => {
        const stored = await AsyncStorage.getItem(RESET_EXPIRY_KEY);
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
            {successMessage.length > 0 && (
              <Text className="text-center font-[abeezee] text-xl uppercase text-brand-text">
                {successMessage}
              </Text>
            )}
            <Text style={defaultStyles.heading}>Reset your password</Text>
            <Text style={styles.text}>
              Enter the verification code sent to your email{" "}
              {route.params.email}
            </Text>
          </View>
          <ErrorMessageDisplay errorMessage={error} />
          <View style={styles.container}>
            <OtpInput
              ref={otpRef}
              numberOfDigits={RESET_CODE_LENGTH}
              onTextChange={handleOtpChange}
              onFilled={() => {}}
              theme={{
                containerStyle: { width: "auto" },
                pinCodeContainerStyle: styles.box,
                pinCodeTextStyle: styles.text,
                focusedPinCodeContainerStyle: styles.boxFocused,
              }}
              focusColor={isDark ? tokens.link : "blue"}
            />
            <Text style={styles.countDown}>{formatTime(countDown)}</Text>
            <Pressable disabled={isLoading || countDown > 0}>
              <Text
                onPress={handleResendEmail}
                className={`my-11 text-center font-[abeezee] text-base ${countDown > 0 ? "text-link/40" : "text-link"} `}
              >
                Resend OTP
              </Text>
            </Pressable>
          </View>
          <CustomButton
            disabled={isLoading || !isCodeComplete}
            text={isLoading ? "Loading..." : "Verify Email"}
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
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default ConfirmResetPasswordTokenScreen;

const makeStyles = (
  defaultStyles: ReturnType<typeof makeDefaultStyles>,
  tokens: Tokens,
  boxWidth: number
) =>
  StyleSheet.create({
    text: {
      ...defaultStyles.defaultText,
      textAlign: "center",
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
      width: boxWidth,
      height: 44,
      marginHorizontal: BOX_MARGIN,
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
