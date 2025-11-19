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
import { emailRegex } from "../../constants";
import colours from "../../colours";

const ResetPasswordScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestPasswordReset = async () => {
    if (!emailRegex.test(email)) {
      setError("Invalid email");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Typp": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (data.message) {
        setError(data.message);
        return;
      }
      navigator.navigate("auth", { screen: "createNewPassword" });
      console.log("reset password data", data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected error, try again later";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={defaultStyles.heading}>Reset Password</Text>
          <Text style={styles.text}>Change your password</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Email:</Text>
            <TextInput
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${error ? "border-red-600" : "border-border"}`}
              placeholderTextColor={error ? "red" : colours.text}
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
            />
            {error && <Text className="text-red-600 text-sm">{error}</Text>}
          </View>
        </View>
        <Pressable
          onPress={handleRequestPasswordReset}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Loading..." : "Proceed"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

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
});
