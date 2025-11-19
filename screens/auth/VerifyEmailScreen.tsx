import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import useAuth from "../../contexts/AuthContext";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";

type VerifyEmailRouteProp = RouteProp<AuthNavigatorParamList, "verifyEmail">;

const VerifyEmailScreen = () => {
  const route = useRoute<VerifyEmailRouteProp>();
  const navigator = useNavigation<RootNavigatorProp>();
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccesMessage] = useState("");
  const { isLoading, verifyEmail, errorMessage, resendVerificationEmail } =
    useAuth();
  const [countDown, setCountdown] = useState(59);

  const handleResendEmail = async () => {
    setSuccesMessage("");
    const data = await resendVerificationEmail(route.params.email);
    if (data.success) {
      setCountdown(59);
      setSuccesMessage("Otp resent successfully");
    }
  };

  useEffect(() => {
    if (countDown < 1) return;
    setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
  }, [countDown]);

  return (
    <View style={styles.screen}>
      <Pressable
        onPress={() => navigator.goBack()}
        style={{ paddingHorizontal: 16 }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/arrow-left.png")}
        />
      </Pressable>
      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          {successMessage.length > 0 && (
            <Text className="font-[abeezee] text-xl text-primary uppercase text-center">
              {successMessage}
            </Text>
          )}
          <Text style={defaultStyles.heading}>Verify your Email</Text>
          <Text style={styles.text}>
            Enter the verification code sent to your email {route.params.email}
          </Text>
        </View>
        <ErrorMessageDisplay errorMessage={errorMessage} />
        <View style={styles.container}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            onFilled={(text) => console.log("OTP:", text)}
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
          onPress={() => verifyEmail(otp)}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Loading..." : "Verify Email"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  screen: {
    ...defaultStyles.screen,
    backgroundColor: "white",
    gap: 16,
    paddingHorizontal: 0,
    paddingBottom: 0,
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
