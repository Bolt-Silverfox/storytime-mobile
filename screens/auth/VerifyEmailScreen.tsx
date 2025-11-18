import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import { OtpInput } from "react-native-otp-entry";
import colours from "../../colours";

const VerifyEmailScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

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
          <Text style={defaultStyles.heading}>Verify your Email</Text>
          <Text style={styles.text}>
            Enter the verification code sent to your email
            daisyluke2025@gmail.com
          </Text>
        </View>
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
          <Text style={styles.countDown}>00:50</Text>
          <Text style={styles.resend}>Resend OTP</Text>
        </View>

        <Pressable
          onPress={() =>
            navigator.navigate("auth", { screen: "createNewPassword" })
          }
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>Verify Email</Text>
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
  resend: {
    ...defaultStyles.linkText,
    textAlign: "center",
    marginVertical: 42,
  },
});
